import { createClient } from '@supabase/supabase-js'

// 从环境变量获取配置，如果没有则使用占位符
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// 检查是否为占位符配置
const isPlaceholderConfig = supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key'

// 创建Supabase客户端（即使使用占位符也创建，以避免应用崩溃）
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 导出配置状态，供其他组件使用
export const isSupabaseConfigured = !isPlaceholderConfig

// 如果使用占位符配置，在控制台输出提示信息
if (isPlaceholderConfig) {
  console.warn('⚠️ Supabase配置未设置，正在使用fallback测试数据')
  console.warn('📖 请参考SETUP_GUIDE.md配置Supabase连接')
}