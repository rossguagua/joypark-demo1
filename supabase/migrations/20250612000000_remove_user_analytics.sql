/*
  # 移除用户分析系统
  
  这个迁移文件将：
  1. 删除所有与用户识别相关的analytics表
  2. 删除users表
  3. 清理相关的索引和策略
  4. 确保数据库不再依赖用户标识符
*/

-- 删除analytics_events表（如果存在）
DROP TABLE IF EXISTS public.analytics_events CASCADE;

-- 删除daily_summary表（如果存在）
DROP TABLE IF EXISTS public.daily_summary CASCADE;

-- 删除users表（如果存在）
DROP TABLE IF EXISTS public.users CASCADE;

-- 删除相关的索引（如果存在）
DROP INDEX IF EXISTS idx_analytics_events_user_id;
DROP INDEX IF EXISTS idx_analytics_events_event_type;
DROP INDEX IF EXISTS idx_analytics_events_created_at;
DROP INDEX IF EXISTS idx_daily_summary_date;
DROP INDEX IF EXISTS idx_daily_summary_event_type;

-- 删除相关的函数（如果存在）
DROP FUNCTION IF EXISTS public.update_daily_summary() CASCADE;
DROP FUNCTION IF EXISTS public.calculate_daily_analytics() CASCADE;

-- 删除相关的触发器（如果存在）
DROP TRIGGER IF EXISTS trigger_update_daily_summary ON public.analytics_events;

-- 清理策略（如果存在）
DROP POLICY IF EXISTS "Allow all operations on analytics_events" ON public.analytics_events;
DROP POLICY IF EXISTS "Allow read access to daily_summary" ON public.daily_summary;
DROP POLICY IF EXISTS "Allow read for all" ON public.users;

-- 添加注释说明变更
COMMENT ON SCHEMA public IS 'JoyPark游戏库 - 已移除用户分析系统，改为纯前端计数模式';

-- 记录迁移日志
DO $$
BEGIN
    RAISE NOTICE '✅ 已成功移除所有用户分析相关表和功能';
    RAISE NOTICE '📊 应用现在使用纯前端计数模式，无用户追踪';
    RAISE NOTICE '🔒 这将解决iOS端cookie和localStorage兼容性问题';
END $$; 