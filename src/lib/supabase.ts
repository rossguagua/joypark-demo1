import { createClient } from '@supabase/supabase-js'

// 从环境变量获取配置，如果没有则使用占位符
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_PROJECT_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

// 检查是否为占位符配置
const isPlaceholderConfig = supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY'

// 创建Supabase客户端（即使使用占位符也创建，以避免应用崩溃）
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 导出配置状态，供其他组件使用
export const isSupabaseConfigured = !isPlaceholderConfig

// 如果使用占位符配置，在控制台输出提示信息
if (isPlaceholderConfig) {
  console.warn('⚠️ Supabase配置未设置，正在使用fallback测试数据')
  console.warn('📖 请参考SETUP_GUIDE.md配置Supabase连接')
}

// Fallback测试数据
const fallbackGames = [
  {
    id: '1',
    name: '聊天破冰盲盒',
    category_tag: 'ice-breaker-box',
    description: '打破沉默，开启有趣对话的神器',
    features: ['破冰神器', '聚会必备', '话题丰富'],
    players: '2-10人',
    duration: '15-30分钟',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: '聚会心理学',
    category_tag: 'party-psychology',
    description: '通过心理测试了解朋友',
    features: ['心理测试', '深度交流', '趣味分析'],
    players: '3-8人',
    duration: '20-40分钟',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: '德州扑克牌',
    category_tag: 'poker',
    description: '经典扑克游戏，考验智慧与运气',
    features: ['策略游戏', '经典玩法', '技巧对决'],
    players: '2-9人',
    duration: '30-60分钟',
    is_active: false,
    created_at: new Date().toISOString()
  }
];

// 获取所有游戏
export async function getGames() {
  // 如果配置未设置，直接返回fallback数据
  if (isPlaceholderConfig) {
    console.log('使用fallback测试数据');
    return fallbackGames.filter(game => game.is_active);
  }

  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching games:', error)
      console.log('回退到测试数据');
      return fallbackGames.filter(game => game.is_active);
    }

    return data || []
  } catch (error) {
    console.error('Error in getGames:', error)
    console.log('回退到测试数据');
    return fallbackGames.filter(game => game.is_active);
  }
}

// 根据category_tag获取游戏
export async function getGameByCategoryTag(categoryTag) {
  // 如果配置未设置，从fallback数据中查找
  if (isPlaceholderConfig) {
    return fallbackGames.find(game => game.category_tag === categoryTag && game.is_active) || null;
  }

  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('category_tag', categoryTag)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching game by category tag:', error)
      // 回退到fallback数据
      return fallbackGames.find(game => game.category_tag === categoryTag && game.is_active) || null;
    }

    return data
  } catch (error) {
    console.error('Error in getGameByCategoryTag:', error)
    // 回退到fallback数据
    return fallbackGames.find(game => game.category_tag === categoryTag && game.is_active) || null;
  }
}

// 获取指定游戏和类别的所有卡片ID
export async function getGameCardIds(gameId, cardCategory) {
  // 如果配置未设置，返回空数组
  if (isPlaceholderConfig) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('cards')
      .select('id')
      .eq('game_id', gameId)
      .eq('category', cardCategory)
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
  // 如果配置未设置，返回null
  if (isPlaceholderConfig) {
    return null;
  }

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