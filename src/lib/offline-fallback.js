// 离线模式的fallback数据
// 当网络连接失败时，使用这些数据确保游戏能正常运行

// 游戏基础信息
export const fallbackGameData = {
  id: 'offline-drinking-topics',
  name: '🍻 聊天破冰盲盒',
  category_tag: 'drinking-topics',
  description: '🔥 一秒打破社恐，瞬间变身话题王！让聚会嗨起来的神器！',
  features: ['四种辣度', '聚会破冰', '随机话题', '微醺必备'],
  players: '2-8人',
  duration: '15-30分钟',
  is_active: true,
  created_at: new Date().toISOString()
};

// 游戏数组数据（用于主页显示）
export const fallbackGamesData = [
  {
    id: 'offline-drinking-topics',
    name: '聊天破冰盲盒',
    category_tag: 'drinking-topics',
    description: '每句话都是命运的🎲 用盲盒话题开启今晚的聊天，打破沉默，快速拉近距离！',
    features: ['随机话题抽取', '四种辣度等级', '适合聚会破冰'],
    players: '2-10人',
    duration: '15-30分钟',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'offline-battle-royale',
    name: '得吃大逃杀',
    category_tag: 'battle-royale',
    description: '紧张刺激的生存竞技游戏，在酒桌上展开一场智慧与运气的较量！',
    features: ['策略对战', '淘汰机制', '团队合作'],
    players: '4-8人',
    duration: '20-40分钟',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'offline-kiss-marks',
    name: '二本吻痕',
    category_tag: 'kiss-marks',
    description: '浪漫互动游戏，通过有趣的挑战和任务增进彼此了解和亲密度。',
    features: ['浪漫互动', '情侣专属', '增进感情'],
    players: '2-6人',
    duration: '10-25分钟',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'offline-party-psychology',
    name: '派对心理学',
    category_tag: 'party-psychology',
    description: '通过心理测试和性格分析，深入了解朋友们的内心世界和真实想法。',
    features: ['心理测试', '性格分析', '深度交流'],
    players: '3-8人',
    duration: '15-30分钟',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'offline-wisdom',
    name: '酒宝急生智',
    category_tag: 'wisdom',
    description: '考验知识储备和反应速度的智力竞赛，看谁能在酒桌上展现最强大脑！',
    features: ['知识竞赛', '快速抢答', '智力挑战'],
    players: '2-8人',
    duration: '10-20分钟',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'offline-man-di-piao-ling',
    name: '满地飘零',
    category_tag: 'man-di-piao-ling',
    description: '创意表演和即兴发挥的游戏，让每个人都能展现自己的艺术天赋。',
    features: ['创意表演', '即兴发挥', '艺术展示'],
    players: '3-10人',
    duration: '15-35分钟',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'offline-moon-night',
    name: '酒宝月圆夜',
    category_tag: 'moon-night',
    description: '经典狼人杀游戏的酒桌版本，在推理和欺骗中寻找真相！',
    features: ['角色扮演', '逻辑推理', '心理博弈'],
    players: '6-12人',
    duration: '30-60分钟',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'offline-love-battle',
    name: '纯爱大作战',
    category_tag: 'love-battle',
    description: '甜蜜的恋爱主题游戏，通过各种浪漫挑战增进情侣或朋友间的感情。',
    features: ['恋爱主题', '甜蜜挑战', '情感升温'],
    players: '2-8人',
    duration: '15-30分钟',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'offline-poker',
    name: '德州扑克牌',
    category_tag: 'poker',
    description: '经典的德州扑克游戏，考验你的牌技、心理素质和运气！',
    features: ['经典扑克', '策略博弈', '技巧竞技'],
    players: '2-9人',
    duration: '20-45分钟',
    is_active: true,
    created_at: new Date().toISOString()
  }
];

// 离线模式的话题数据
export const fallbackCards = {
  // 清汤 Mild Mode - 温和话题
  mildmode: [
    { id: 'mild_1', content: '你今天最开心的一件事是什么？', category: 'mildmode' },
    { id: 'mild_2', content: '分享一个你最近学到的新技能', category: 'mildmode' },
    { id: 'mild_3', content: '如果可以和任何一个历史人物聊天，你会选择谁？', category: 'mildmode' },
    { id: 'mild_4', content: '你最喜欢的季节是什么？为什么？', category: 'mildmode' },
    { id: 'mild_5', content: '分享一个让你印象深刻的旅行经历', category: 'mildmode' },
    { id: 'mild_6', content: '你觉得自己最大的优点是什么？', category: 'mildmode' },
    { id: 'mild_7', content: '如果有超能力，你最想要哪一种？', category: 'mildmode' },
    { id: 'mild_8', content: '你小时候最想成为什么职业？', category: 'mildmode' },
    { id: 'mild_9', content: '分享一部你最近看过的好电影或书籍', category: 'mildmode' },
    { id: 'mild_10', content: '你认为朋友最重要的品质是什么？', category: 'mildmode' },
    { id: 'mild_11', content: '如果能重新选择一次专业，你会选什么？', category: 'mildmode' },
    { id: 'mild_12', content: '你最想去哪个国家旅行？为什么？', category: 'mildmode' },
    { id: 'mild_13', content: '分享一个你的小习惯或小癖好', category: 'mildmode' },
    { id: 'mild_14', content: '你觉得什么样的生活状态最理想？', category: 'mildmode' },
    { id: 'mild_15', content: '如果可以学会一门乐器，你会选择什么？', category: 'mildmode' }
  ],

  // 微辣 On the Edge - 轻松有趣
  ontheedge: [
    { id: 'edge_1', content: '分享一个你做过最勇敢的事情', category: 'ontheedge' },
    { id: 'edge_2', content: '你觉得自己身上最奇怪的特点是什么？', category: 'ontheedge' },
    { id: 'edge_3', content: '如果明天是世界末日，你今晚想做什么？', category: 'ontheedge' },
    { id: 'edge_4', content: '分享一次你最尴尬的经历', category: 'ontheedge' },
    { id: 'edge_5', content: '你曾经说过的最大的谎言是什么？', category: 'ontheedge' },
    { id: 'edge_6', content: '如果能读心术，你最想知道谁在想什么？', category: 'ontheedge' },
    { id: 'edge_7', content: '你做过最叛逆的事情是什么？', category: 'ontheedge' },
    { id: 'edge_8', content: '分享一个你的"黑历史"', category: 'ontheedge' },
    { id: 'edge_9', content: '你觉得在座的谁最有可能成为网红？', category: 'ontheedge' },
    { id: 'edge_10', content: '如果能隐身一天，你会去做什么？', category: 'ontheedge' },
    { id: 'edge_11', content: '你最不敢告诉父母的秘密是什么类型？', category: 'ontheedge' },
    { id: 'edge_12', content: '分享一次你"社会性死亡"的经历', category: 'ontheedge' },
    { id: 'edge_13', content: '你觉得自己最不为人知的一面是什么？', category: 'ontheedge' },
    { id: 'edge_14', content: '如果能交换身份一天，你想成为谁？', category: 'ontheedge' },
    { id: 'edge_15', content: '你做过最冲动的决定是什么？', category: 'ontheedge' }
  ],

  // 加麻加辣 Intense - 深度话题
  intense: [
    { id: 'intense_1', content: '你觉得人生中最重要的转折点是什么？', category: 'intense' },
    { id: 'intense_2', content: '如果知道自己只剩一年生命，你会如何度过？', category: 'intense' },
    { id: 'intense_3', content: '你对爱情最深刻的理解是什么？', category: 'intense' },
    { id: 'intense_4', content: '分享一次让你彻底改变想法的经历', category: 'intense' },
    { id: 'intense_5', content: '你觉得什么样的人生是成功的人生？', category: 'intense' },
    { id: 'intense_6', content: '你最害怕失去的是什么？', category: 'intense' },
    { id: 'intense_7', content: '如果能给18岁的自己一个建议，你会说什么？', category: 'intense' },
    { id: 'intense_8', content: '你觉得人性中最美好和最丑陋的是什么？', category: 'intense' },
    { id: 'intense_9', content: '分享一个让你重新认识自己的瞬间', category: 'intense' },
    { id: 'intense_10', content: '你觉得什么时候感到最孤独？', category: 'intense' },
    { id: 'intense_11', content: '如果能改变世界一件事，你会选择什么？', category: 'intense' },
    { id: 'intense_12', content: '你觉得真正的成熟是什么样的？', category: 'intense' },
    { id: 'intense_13', content: '分享一次你做出重大牺牲的经历', category: 'intense' },
    { id: 'intense_14', content: '你觉得人生的意义在哪里？', category: 'intense' },
    { id: 'intense_15', content: '什么事情让你对人性有了新的认识？', category: 'intense' }
  ],

  // 盲盒 Surprise Me - 随机惊喜
  surprise: [
    { id: 'surprise_1', content: '如果你的生活是一部电影，你觉得现在是什么类型？', category: 'surprise' },
    { id: 'surprise_2', content: '你觉得在座的谁最像哪个动物？为什么？', category: 'surprise' },
    { id: 'surprise_3', content: '如果能拥有一个魔法道具，你会选择什么？', category: 'surprise' },
    { id: 'surprise_4', content: '你觉得自己前世可能是什么？', category: 'surprise' },
    { id: 'surprise_5', content: '如果能设计一个节日，你会怎么设计？', category: 'surprise' },
    { id: 'surprise_6', content: '你觉得外星人存在吗？如果存在，他们在做什么？', category: 'surprise' },
    { id: 'surprise_7', content: '如果动物能说话，你最想和哪种动物聊天？', category: 'surprise' },
    { id: 'surprise_8', content: '你觉得自己最像哪种天气？为什么？', category: 'surprise' },
    { id: 'surprise_9', content: '如果能给全人类一个超能力，你会选择什么？', category: 'surprise' },
    { id: 'surprise_10', content: '你觉得什么颜色最能代表你的性格？', category: 'surprise' },
    { id: 'surprise_11', content: '如果能创造一种新的冰淇淋口味，会是什么？', category: 'surprise' },
    { id: 'surprise_12', content: '你觉得自己是什么类型的超级英雄？', category: 'surprise' },
    { id: 'surprise_13', content: '如果能和任何虚拟角色做朋友，你会选择谁？', category: 'surprise' },
    { id: 'surprise_14', content: '你觉得什么声音最能代表你的内心？', category: 'surprise' },
    { id: 'surprise_15', content: '如果能重新设计人类，你会加上什么功能？', category: 'surprise' }
  ]
};

// 获取指定分类的卡片ID列表
export function getOfflineCardIds(category) {
  const cards = fallbackCards[category] || [];
  return cards.map(card => card.id);
}

// 根据ID获取卡片内容
export function getOfflineCardById(cardId) {
  for (const category in fallbackCards) {
    const card = fallbackCards[category].find(c => c.id === cardId);
    if (card) {
      return card;
    }
  }
  return null;
}

// 检查是否处于离线模式
export function isOfflineMode() {
  return !navigator.onLine || localStorage.getItem('forceOfflineMode') === 'true';
}

// 强制启用离线模式（用于测试或网络问题严重时）
export function enableOfflineMode() {
  localStorage.setItem('forceOfflineMode', 'true');
  console.log('🔌 离线模式已启用');
}

// 禁用强制离线模式
export function disableOfflineMode() {
  localStorage.removeItem('forceOfflineMode');
  console.log('🌐 离线模式已禁用');
}

// 混合模式：优先尝试在线，失败时自动降级到离线
export async function hybridGetGameData(categoryTag) {
  try {
    // 先尝试从网络获取
    const { getGameByCategoryTag } = await import('./supabase.js');
    const result = await getGameByCategoryTag(categoryTag);
    
    // 如果网络返回null或数据不完整，fallback到离线数据
    if (!result || !result.id) {
      console.log('网络返回空数据或不完整，使用离线数据');
      return fallbackGameData;
    }
    
    return result;
  } catch (error) {
    console.warn('网络获取游戏数据失败，使用离线数据:', error.message);
    return fallbackGameData;
  }
}

export async function hybridGetGameCardIds(gameId, category) {
  // 如果gameId为空或不是UUID格式，直接使用离线数据
  const isUUID = gameId && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(gameId);
  
  if (!isUUID) {
    console.log(`游戏ID "${gameId}" 不是UUID格式或为空，使用离线数据`);
    return getOfflineCardIds(category);
  }
  
  try {
    // 先尝试从网络获取（仅当gameId是UUID格式时）
    const { getGameCardIds } = await import('./supabase.js');
    const result = await getGameCardIds(gameId, category);
    
    // 如果网络返回空数组，fallback到离线数据
    if (!result || result.length === 0) {
      console.log('网络返回空数据，使用离线数据');
      return getOfflineCardIds(category);
    }
    
    return result;
  } catch (error) {
    console.warn('网络获取卡片ID失败，使用离线数据:', error.message);
    return getOfflineCardIds(category);
  }
}

export async function hybridGetCardById(cardId) {
  // 检查ID格式，如果不是UUID格式，直接使用离线数据
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(cardId);
  
  if (!isUUID) {
    console.log(`卡片ID "${cardId}" 不是UUID格式，使用离线数据`);
    return getOfflineCardById(cardId);
  }
  
  try {
    // 先尝试从网络获取（仅当ID是UUID格式时）
    const { getCardById } = await import('./supabase.js');
    return await getCardById(cardId);
  } catch (error) {
    console.warn('网络获取卡片失败，使用离线数据:', error.message);
    return getOfflineCardById(cardId);
  }
} 