import { createClient } from '@supabase/supabase-js'

// Supabase 配置 - 修复环境变量兼容性问题
let supabaseUrl, supabaseAnonKey;

// 简化的环境变量检测，避免import.meta.env兼容性问题
try {
  // 检查是否在Vite环境中
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    console.log('✅ Vite环境变量已加载');
  }
} catch (error) {
  console.log('⚠️ 环境变量不可用，原因:', error.message);
}

// 使用硬编码配置作为fallback
if (!supabaseUrl || !supabaseAnonKey) {
  supabaseUrl = 'https://frqjqmwuznhjqukdmexg.supabase.co';
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZycWpxbXd1em5oanF1a2RtZXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0Mzg5MzksImV4cCI6MjA2NTAxNDkzOX0.xIRuRUA9ToS6LWYfRUIHVbMsu9P5LdxY35zPC2s-E4U';
  console.log('✅ 使用硬编码Supabase配置');
}

// 验证基本配置存在
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase配置缺失:')
  console.error('   URL:', supabaseUrl)
  console.error('   Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'undefined')
  throw new Error('Missing Supabase configuration.')
}

// 检测移动端浏览器
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

console.log('✅ Supabase配置已加载:')
console.log('   URL:', supabaseUrl)
console.log('   Key:', `${supabaseAnonKey.substring(0, 20)}...`)
console.log('   移动端模式:', isMobile)

// 针对移动端优化的Supabase配置
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      ...(isMobile && {
        'User-Agent': navigator.userAgent + ' MobileApp'
      })
    },
    fetch: (url, options = {}) => {
      console.log(`🌐 Supabase请求: ${url}`);
      
      // 统一的基础fetch配置
      const fetchOptions = {
        ...options,
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...options.headers
        }
      };
      
              // 统一使用超时控制，但移动端给更长时间
        const timeout = isMobile ? 20000 : 10000; // 移动端20秒，桌面端10秒
        
        console.log(`${isMobile ? '📱 移动端' : '💻 桌面端'}模式：超时时间${timeout/1000}秒`);
        
        return Promise.race([
          fetch(url, {
            ...fetchOptions,
            cache: 'no-cache'
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error(`请求超时 (${timeout/1000}秒)`)), timeout)
          )
        ]).catch(error => {
          console.error(`${isMobile ? '📱 移动端' : '💻 桌面端'}fetch失败:`, error);
          throw error;
        });
    }
  }
})

// 数据库类型定义 (JavaScript 注释)
// Game 对象包含: id, name, category_tag, description, features, players, duration, is_active, created_at
// Card 对象包含: id, game_id, category, content, is_active, created_at

// 重试机制辅助函数
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      console.warn(`操作失败，尝试第 ${i + 1}/${maxRetries} 次重试:`, error.message);
      
      if (i === maxRetries - 1) {
        throw error; // 最后一次重试失败，抛出错误
      }
      
      // 等待后重试，移动端网络可能需要更多时间
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
}

// 优化后的API函数 - 只返回核心游戏信息，不包含卡片数据和图片URL
export async function getGames() {
  return retryOperation(async () => {
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
  });
}

// 根据分类标签获取单个游戏
export async function getGameByCategoryTag(categoryTag) {
  // 防御性检查：确保categoryTag不为空
  if (!categoryTag) {
    console.warn('getGameByCategoryTag: categoryTag is undefined or empty!');
    return null;
  }
  
  return retryOperation(async () => {
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
  });
}

// 获取指定游戏的卡片ID列表（方案A - 推荐）
export async function getGameCardIds(gameId, category) {
  // 防御性检查：确保gameId不为undefined
  if (!gameId) {
    console.warn('getGameCardIds: gameId is undefined or null!');
    return [];
  }
  
  return retryOperation(async () => {
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
  });
}

// 保持向后兼容的函数（根据分类标签获取卡片ID）
export async function getGameCardIdsByCategoryTag(categoryTag, category) {
  // 防御性检查：确保categoryTag不为空
  if (!categoryTag) {
    console.warn('getGameCardIdsByCategoryTag: categoryTag is undefined or empty!');
    return [];
  }
  
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

  if (!gameData || !gameData.id) {
    console.warn(`Game with category_tag "${categoryTag}" not found or has no valid ID`);
    return []; // 返回空数组而不是抛错，防止应用崩溃
  }

  return getGameCardIds(gameData.id, category)
}

// 根据卡片ID获取单张卡片内容
export async function getCardById(cardId) {
  // 防御性检查：确保cardId不为undefined
  if (!cardId) {
    console.warn('getCardById: cardId is undefined or null!');
    return null;
  }
  
  return retryOperation(async () => {
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
  });
}

// 保持向后兼容的函数（已弃用，建议使用新的优化函数）
export async function getCardsByCategory(categoryTag, category) {
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