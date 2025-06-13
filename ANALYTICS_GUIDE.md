# JoyPark 用户分析系统使用指南

## 系统概述

这套用户分析系统为你的 JoyPark 小程序提供了完整的、隐私友好的用户行为追踪解决方案。系统设计遵循以下原则：

- **用户无感知**：所有数据收集在后台进行，用户体验不受影响
- **匿名化追踪**：使用UUID标识用户，不收集个人隐私信息
- **资源节俭**：采用数据聚合策略，不会耗尽Supabase免费额度
- **批量发送**：减少网络请求，提升性能

## 系统架构

### 数据收集流程
1. **事件追踪**：前端代码在关键操作时调用 `trackEvent()` 函数
2. **批量发送**：事件被收集在队列中，每3秒或达到10个事件时批量发送
3. **数据存储**：原始事件存储在 `analytics_events` 表中
4. **自动聚合**：每天凌晨自动运行聚合程序，将数据转移到 `daily_summary` 表
5. **数据清理**：聚合后删除3天前的原始数据，节省存储空间

### 追踪的事件类型

| 事件类型 | 描述 | 触发时机 | 数据字段 |
|---------|------|---------|----------|
| `GAME_VIEW` | 游戏预览 | 用户点击游戏卡片查看详情 | `category_tag` |
| `GAME_START` | 游戏启动 | 用户点击"开始游戏"按钮 | `category_tag` |
| `TOPIC_DRAW` | 话题抽取 | 用户在游戏中抽取新话题 | `category` |
| `CATEGORY_COMPLETE` | 分类完成 | 用户完成某个话题分类 | `category` |
| `CATEGORY_RESTART` | 分类重启 | 用户重新开始某个话题分类 | `category` |

## 使用方法

### 1. 查看实时数据（开发阶段）

在浏览器控制台中：
```javascript
// 查看当前用户的匿名ID
import { getDebugUserId } from './src/lib/analytics.js';
console.log('User ID:', getDebugUserId());

// 手动发送队列中的事件
import { flushAnalytics } from './src/lib/analytics.js';
flushAnalytics();
```

### 2. 在Supabase中分析数据

#### 查看原始事件（最近3天）
```sql
SELECT * FROM analytics_events 
ORDER BY created_at DESC 
LIMIT 100;
```

#### 查看聚合数据
```sql
SELECT * FROM daily_summary 
ORDER BY summary_date DESC 
LIMIT 50;
```

### 3. 使用预定义查询

在项目根目录的 `analytics-queries.sql` 文件中，我为你准备了10个常用查询：

1. **游戏启动排行榜** - 了解哪个游戏最受欢迎
2. **话题类别偏好分析** - 了解用户最喜欢的话题类型
3. **日活跃用户趋势** - 监控用户活跃度变化
4. **游戏预览转化率** - 分析从预览到启动的转化情况
5. **话题类别完成率** - 了解用户参与深度
6. **用户留存分析** - 分析用户持续使用情况
7. **热门时段分析** - 了解用户活跃时间
8. **话题类别重启率** - 分析用户重复游戏习惯
9. **综合用户行为报告** - 获得全面的行为概览
10. **数据库空间使用监控** - 监控存储使用情况

## 核心问题解答

### 你提出的关键问题及解决方案

#### 1. "用户最常打开的游戏是什么？"

**使用查询1**：
```sql
SELECT
    event_details AS game_category,
    SUM(daily_count) AS total_starts,
    SUM(unique_users) AS total_unique_users
FROM public.daily_summary
WHERE event_type = 'GAME_START'
GROUP BY game_category
ORDER BY total_starts DESC;
```

**结果示例**：
- `drinking-topics`: 1,250 次启动，450 独立用户
- `party-psychology`: 45 次启动，32 独立用户（即将推出）

#### 2. "用户最喜欢的社交破冰盲盒游戏类型是哪个？"

**使用查询2**：
```sql
SELECT
    event_details AS topic_category,
    SUM(daily_count) AS total_draws,
    ROUND(SUM(daily_count)::decimal / SUM(unique_users), 2) AS avg_draws_per_user
FROM public.daily_summary
WHERE event_type = 'TOPIC_DRAW'
GROUP BY topic_category
ORDER BY total_draws DESC;
```

**结果示例**：
- `mildmode`: 2,100 次抽取，平均每用户 4.7 次
- `ontheedge`: 1,800 次抽取，平均每用户 4.2 次
- `intense`: 950 次抽取，平均每用户 3.1 次
- `surprise`: 1,200 次抽取，平均每用户 3.8 次

#### 3. "日活跃用户趋势"

**使用查询3**：
```sql
SELECT
    summary_date,
    SUM(unique_users) as daily_active_users
FROM public.daily_summary
WHERE summary_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY summary_date
ORDER BY summary_date DESC;
```

## 数据容量管理

### 免费额度计算

- **Supabase免费额度**：500MB数据库存储
- **每条事件大小**：约100-150字节
- **理论容量**：约300-500万条事件记录
- **实际使用**：由于聚合机制，长期只保留聚合数据和最近3天原始数据

### 容量优化策略

1. **自动聚合**：每天将原始数据聚合到摘要表
2. **定期清理**：只保留最近3天的原始事件数据
3. **批量发送**：减少数据库连接开销
4. **压缩存储**：使用JSONB格式存储事件数据

### 监控数据使用

定期运行查询10来监控存储使用情况：
```sql
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
```

## 系统维护

### 自动化任务

系统已配置以下自动化任务：

1. **每日聚合**：每天UTC时间早上8点自动运行 `summarize_analytics()` 函数
2. **数据清理**：聚合时自动删除3天前的原始数据
3. **错误处理**：前端包含完善的错误处理机制

### 手动维护

如需手动触发数据聚合：
```sql
SELECT summarize_analytics();
```

如需查看聚合函数状态：
```sql
SELECT schemaname, funcname, calls, total_time, mean_time 
FROM pg_stat_user_functions 
WHERE funcname = 'summarize_analytics';
```

## 隐私和安全

### 隐私保护

- **匿名化**：使用随机UUID标识用户，不收集个人信息
- **最小化数据收集**：只收集必要的行为数据
- **本地存储**：用户ID存储在浏览器本地，不与服务器同步个人信息

### 安全措施

- **行级安全（RLS）**：数据表启用RLS策略
- **只写权限**：前端只能插入数据，不能修改或删除
- **数据验证**：前端包含输入验证和错误处理

## 故障排除

### 常见问题

1. **事件未发送**
   - 检查浏览器控制台是否有错误
   - 确认网络连接正常
   - 验证Supabase配置正确

2. **数据未聚合**
   - 检查Cron任务是否正常运行
   - 手动执行 `SELECT summarize_analytics();`

3. **存储空间不足**
   - 运行监控查询检查数据量
   - 考虑调整数据保留策略

### 调试方法

在浏览器控制台中：
```javascript
// 查看事件队列状态
console.log('Events in queue:', eventQueue.length);

// 手动触发事件
trackEvent('TEST_EVENT', { test: 'data' });

// 立即发送队列
flushAnalytics();
```

## 扩展和定制

### 添加新的事件类型

1. 在前端代码中添加 `trackEvent()` 调用
2. 更新分析查询以包含新事件类型
3. 考虑更新聚合逻辑（如需要）

### 修改数据保留策略

编辑 `summarize_analytics()` 函数中的时间间隔：
```sql
-- 当前：保留3天
WHERE created_at < NOW() - INTERVAL '3 days';

-- 修改为保留7天
WHERE created_at < NOW() - INTERVAL '7 days';
```

## 总结

这套分析系统为你提供了：

- ✅ 完整的用户行为追踪
- ✅ 节俭的资源使用策略
- ✅ 丰富的数据分析查询
- ✅ 自动化的数据管理
- ✅ 隐私友好的设计

系统已经完全集成到你的现有项目中，无需额外配置即可开始收集数据。你可以立即在Supabase的SQL编辑器中运行 `analytics-queries.sql` 中的查询来开始分析用户行为。 