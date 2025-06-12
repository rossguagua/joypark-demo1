import { createClient } from '@supabase/supabase-js'

// Supabase 配置 - 请在这里填入你的项目信息
const supabaseUrl = (import.meta as any)?.env?.VITE_SUPABASE_URL || 'https://frqjqmwuznhjqukdmexg.supabase.co'
const supabaseAnonKey = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZycWpxbXd1em5oanF1a2RtZXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0Mzg5MzksImV4cCI6MjA2NTAxNDkzOX0.xIRuRUA9ToS6LWYfRUIHVbMsu9P5LdxY35zPC2s-E4U'

// 验证基本配置存在
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('请配置 Supabase URL 和 ANON KEY')
  throw new Error('Missing Supabase configuration.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 数据库类型定义
export interface Game {
  id: string
  name: string
  category_tag: string
  description: string | null
  features: string[] | null
  players: string | null
  duration: string | null
  is_active: boolean
  created_at: string
}

export interface Card {
  id: string
  game_id: string
  category: string
  content: string
  is_active: boolean
  created_at: string
}

// 优化后的API函数 - 只返回核心游戏信息，不包含卡片数据和图片URL
export async function getGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from('games')
    .select('id, name, category_tag, description, features, players, duration, is_active, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching games:', error)
    throw error
  }

  return data || []
}

// 根据分类标签获取单个游戏
export async function getGameByCategoryTag(categoryTag: string): Promise<Game | null> {
  const { data, error } = await supabase
    .from('games')
    .select('id, name, category_tag, description, features, players, duration, is_active, created_at')
    .eq('category_tag', categoryTag)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching game by category tag:', error)
    throw error
  }

  return data
}

// 获取指定游戏的卡片ID列表（方案A - 推荐）
export async function getGameCardIds(gameId: string, category: string): Promise<string[]> {
  // 只获取卡片ID列表，不获取内容
  const { data, error } = await supabase
    .from('cards')
    .select('id')
    .eq('game_id', gameId)
    .eq('category', category)
    .eq('is_active', true)

  if (error) {
    console.error('Error fetching card IDs:', error)
    throw error
  }

  return (data || []).map(card => card.id)
}

// 保持向后兼容的函数（根据分类标签获取卡片ID）
export async function getGameCardIdsByCategoryTag(categoryTag: string, category: string): Promise<string[]> {
  // 首先获取游戏ID
  const { data: gameData, error: gameError } = await supabase
    .from('games')
    .select('id')
    .eq('category_tag', categoryTag)
    .eq('is_active', true)
    .single()

  if (gameError) {
    console.error('Error fetching game:', gameError)
    throw gameError
  }

  if (!gameData) {
    throw new Error(`Game with category_tag "${categoryTag}" not found`)
  }

  return getGameCardIds(gameData.id, category)
}

// 根据卡片ID获取单张卡片内容
export async function getCardById(cardId: string): Promise<Card | null> {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id', cardId)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching card by ID:', error)
    throw error
  }

  return data
}



// 保持向后兼容的函数（已弃用，建议使用新的优化函数）
export async function getCardsByCategory(categoryTag: string, category: string): Promise<Card[]> {
  console.warn('getCardsByCategory is deprecated. Use getGameCardIds + getCardById for better performance.')
  
  // 首先获取游戏ID
  const { data: gameData, error: gameError } = await supabase
    .from('games')
    .select('id')
    .eq('category_tag', categoryTag)
    .eq('is_active', true)
    .single()

  if (gameError) {
    console.error('Error fetching game:', gameError)
    throw gameError
  }

  if (!gameData) {
    throw new Error(`Game with category_tag "${categoryTag}" not found`)
  }

  // 然后获取该游戏指定分类的卡片
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('game_id', gameData.id)
    .eq('category', category)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching cards by category:', error)
    throw error
  }

  return data || []
}