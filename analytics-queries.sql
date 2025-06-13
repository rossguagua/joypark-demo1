-- JoyPark 用户分析查询集合
-- 使用这些查询来分析用户行为数据
-- 所有查询都基于 daily_summary 表，确保性能优化

-- 1. 用户最常打开的游戏是什么？
-- 查询游戏启动次数排行榜
SELECT
    event_details AS game_category,
    SUM(daily_count) AS total_starts,
    SUM(unique_users) AS total_unique_users,
    ROUND(SUM(daily_count)::decimal / SUM(unique_users), 2) AS avg_starts_per_user
FROM
    public.daily_summary
WHERE
    event_type = 'GAME_START'
GROUP BY
    game_category
ORDER BY
    total_starts DESC;

-- 2. 用户最喜欢的社交破冰盲盒游戏类型是哪个？
-- 基于话题抽取次数分析用户偏好
SELECT
    event_details AS topic_category,
    SUM(daily_count) AS total_draws,
    SUM(unique_users) AS total_unique_users,
    ROUND(SUM(daily_count)::decimal / SUM(unique_users), 2) AS avg_draws_per_user
FROM
    public.daily_summary
WHERE
    event_type = 'TOPIC_DRAW'
GROUP BY
    topic_category
ORDER BY
    total_draws DESC;

-- 3. 日活跃用户趋势 (DAU)
-- 查看过去30天的每日活跃用户数量
SELECT
    summary_date,
    SUM(unique_users) as daily_active_users,
    SUM(daily_count) as total_events
FROM
    public.daily_summary
WHERE
    summary_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY
    summary_date
ORDER BY
    summary_date DESC;

-- 4. 游戏预览转化率分析
-- 分析用户从预览到实际启动的转化情况
WITH game_views AS (
    SELECT 
        event_details AS game_category,
        SUM(daily_count) AS total_views,
        SUM(unique_users) AS unique_viewers
    FROM public.daily_summary 
    WHERE event_type = 'GAME_VIEW'
    GROUP BY event_details
),
game_starts AS (
    SELECT 
        event_details AS game_category,
        SUM(daily_count) AS total_starts,
        SUM(unique_users) AS unique_starters
    FROM public.daily_summary 
    WHERE event_type = 'GAME_START'
    GROUP BY event_details
)
SELECT 
    v.game_category,
    v.total_views,
    COALESCE(s.total_starts, 0) AS total_starts,
    CASE 
        WHEN v.total_views > 0 
        THEN ROUND((COALESCE(s.total_starts, 0)::decimal / v.total_views) * 100, 2)
        ELSE 0 
    END AS conversion_rate_percent
FROM game_views v
LEFT JOIN game_starts s ON v.game_category = s.game_category
ORDER BY conversion_rate_percent DESC;

-- 5. 话题类别完成率分析
-- 分析用户在各个话题类别中的参与深度
WITH category_draws AS (
    SELECT 
        event_details AS category,
        SUM(daily_count) AS total_draws,
        SUM(unique_users) AS unique_users_draws
    FROM public.daily_summary 
    WHERE event_type = 'TOPIC_DRAW'
    GROUP BY event_details
),
category_completions AS (
    SELECT 
        event_details AS category,
        SUM(daily_count) AS total_completions,
        SUM(unique_users) AS unique_users_completions
    FROM public.daily_summary 
    WHERE event_type = 'CATEGORY_COMPLETE'
    GROUP BY event_details
)
SELECT 
    d.category,
    d.total_draws,
    d.unique_users_draws,
    COALESCE(c.total_completions, 0) AS total_completions,
    COALESCE(c.unique_users_completions, 0) AS unique_users_completions,
    CASE 
        WHEN d.unique_users_draws > 0 
        THEN ROUND((COALESCE(c.unique_users_completions, 0)::decimal / d.unique_users_draws) * 100, 2)
        ELSE 0 
    END AS completion_rate_percent
FROM category_draws d
LEFT JOIN category_completions c ON d.category = c.category
ORDER BY completion_rate_percent DESC;

-- 6. 用户留存分析（简化版）
-- 分析用户在不同天数的活跃情况
SELECT
    summary_date,
    event_type,
    COUNT(DISTINCT event_details) AS distinct_categories_used,
    SUM(unique_users) AS unique_users,
    SUM(daily_count) AS total_events
FROM
    public.daily_summary
WHERE
    summary_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY
    summary_date, event_type
ORDER BY
    summary_date DESC, event_type;

-- 7. 热门时段分析
-- 分析什么时候用户最活跃（需要原始事件数据）
-- 注意：这个查询需要访问 analytics_events 表，只适用于最近3天的数据
SELECT
    EXTRACT(hour FROM created_at) AS hour_of_day,
    COUNT(*) AS total_events,
    COUNT(DISTINCT user_id) AS unique_users
FROM
    public.analytics_events
WHERE
    created_at >= NOW() - INTERVAL '3 days'
GROUP BY
    EXTRACT(hour FROM created_at)
ORDER BY
    hour_of_day;

-- 8. 话题类别重启率分析
-- 分析用户重启各类别的频率
WITH category_completions AS (
    SELECT 
        event_details AS category,
        SUM(daily_count) AS total_completions
    FROM public.daily_summary 
    WHERE event_type = 'CATEGORY_COMPLETE'
    GROUP BY event_details
),
category_restarts AS (
    SELECT 
        event_details AS category,
        SUM(daily_count) AS total_restarts
    FROM public.daily_summary 
    WHERE event_type = 'CATEGORY_RESTART'
    GROUP BY event_details
)
SELECT 
    c.category,
    c.total_completions,
    COALESCE(r.total_restarts, 0) AS total_restarts,
    CASE 
        WHEN c.total_completions > 0 
        THEN ROUND((COALESCE(r.total_restarts, 0)::decimal / c.total_completions) * 100, 2)
        ELSE 0 
    END AS restart_rate_percent
FROM category_completions c
LEFT JOIN category_restarts r ON c.category = r.category
ORDER BY restart_rate_percent DESC;

-- 9. 综合用户行为报告
-- 提供一个全面的用户行为概览
SELECT
    'GAME_VIEW' as metric_name,
    SUM(daily_count) as total_count,
    SUM(unique_users) as unique_users,
    COUNT(DISTINCT summary_date) as active_days
FROM public.daily_summary 
WHERE event_type = 'GAME_VIEW'

UNION ALL

SELECT
    'GAME_START' as metric_name,
    SUM(daily_count) as total_count,
    SUM(unique_users) as unique_users,
    COUNT(DISTINCT summary_date) as active_days
FROM public.daily_summary 
WHERE event_type = 'GAME_START'

UNION ALL

SELECT
    'TOPIC_DRAW' as metric_name,
    SUM(daily_count) as total_count,
    SUM(unique_users) as unique_users,
    COUNT(DISTINCT summary_date) as active_days
FROM public.daily_summary 
WHERE event_type = 'TOPIC_DRAW'

UNION ALL

SELECT
    'CATEGORY_COMPLETE' as metric_name,
    SUM(daily_count) as total_count,
    SUM(unique_users) as unique_users,
    COUNT(DISTINCT summary_date) as active_days
FROM public.daily_summary 
WHERE event_type = 'CATEGORY_COMPLETE'

ORDER BY total_count DESC;

-- 10. 数据库空间使用监控
-- 监控分析系统的存储使用情况
SELECT 
    'analytics_events' as table_name,
    COUNT(*) as record_count,
    pg_size_pretty(pg_total_relation_size('public.analytics_events')) as table_size
UNION ALL
SELECT 
    'daily_summary' as table_name,
    COUNT(*) as record_count,
    pg_size_pretty(pg_total_relation_size('public.daily_summary')) as table_size
FROM public.daily_summary; 