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

// 获取所有游戏
export async function getGames() {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching games:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getGames:', error)
    return []
  }
}

// 获取指定游戏的所有卡片ID
export async function getGameCardIds(gameId) {
  try {
    const { data, error } = await supabase
      .from('cards')
      .select('id')
      .eq('game_id', gameId)
      .eq('is_active', true)

    if (error) {
      console.error('Error fetching game card IDs:', error)
      return []
    }

    return data?.map(card => card.id) || []
  } catch (error) {
    console.error('Error in getGameCardIds:', error)
    return []
  }
}

// 根据ID获取卡片
export async function getCardById(cardId) {
  try {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('id', cardId)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching card by ID:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getCardById:', error)
    return null
  }
}