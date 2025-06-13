// 延迟导入supabase以避免循环依赖和模块加载失败
let supabase = null;
let isSupabaseAvailable = false;

// 初始化supabase连接（延迟加载）
async function initializeSupabase() {
  if (supabase !== null) return isSupabaseAvailable;
  
  try {
    const supabaseModule = await import('./supabase.js');
    supabase = supabaseModule.supabase;
    isSupabaseAvailable = true;
    console.log('✅ Analytics: Supabase连接已建立');
    return true;
  } catch (error) {
    console.warn('⚠️ Analytics: Supabase连接失败，分析功能将在静默模式下运行:', error.message);
    supabase = null;
    isSupabaseAvailable = false;
    return false;
  }
}

let eventQueue = [];
let debounceTimer = null;
let isFlushingQueue = false;

// 获取或创建一个唯一的匿名用户ID
function getAnonymousUserId() {
    let userId = localStorage.getItem('joypark_user_id');
    if (!userId) {
        userId = crypto.randomUUID(); // 使用内置的crypto API生成UUID
        localStorage.setItem('joypark_user_id', userId);
    }
    return userId;
}

// 立即发送队列中的所有事件
async function flushQueue() {
    if (eventQueue.length === 0 || isFlushingQueue) {
        return;
    }
    
    // 尝试初始化Supabase连接
    const supabaseReady = await initializeSupabase();
    if (!supabaseReady) {
        console.log('📊 Analytics: Supabase不可用，丢弃 ' + eventQueue.length + ' 个事件');
        eventQueue = []; // 清空队列但不发送
        return;
    }
    
    isFlushingQueue = true;
    const eventsToSend = [...eventQueue];
    eventQueue = [];
    clearTimeout(debounceTimer);
    debounceTimer = null;
    
    try {
        // 检查网络连接
        if (!navigator.onLine) {
            console.warn('📊 Analytics: 网络离线，分析事件将在网络恢复后发送');
            // 将事件重新加入队列
            eventQueue.unshift(...eventsToSend);
            return;
        }
        
        const { error } = await supabase.from('analytics_events').insert(eventsToSend);
        if (error) {
            console.warn('📊 Analytics Batch Error:', error);
            // 如果是网络错误，重新加入队列
            if (error.message && (error.message.includes('fetch') || error.message.includes('network'))) {
                console.warn('📊 Analytics: 网络错误，事件将重新加入队列');
                eventQueue.unshift(...eventsToSend);
            }
        } else {
            console.log(`📊 Analytics: 成功发送 ${eventsToSend.length} 个分析事件`);
        }
    } catch (err) {
        console.warn('📊 Analytics: 发送失败:', err.message);
        // 网络错误时重新加入队列
        if (err.name === 'AbortError' || err.message.includes('fetch')) {
            console.warn('📊 Analytics: 网络请求失败，事件将重新加入队列');
            eventQueue.unshift(...eventsToSend);
        }
    } finally {
        isFlushingQueue = false;
    }
}

// 在用户关闭页面前，尝试最后一次发送
window.addEventListener('beforeunload', () => {
    // 使用 sendBeacon API 进行更可靠的发送
    if (eventQueue.length > 0 && navigator.sendBeacon) {
        const userId = getAnonymousUserId();
        const eventsToSend = eventQueue.map(event => ({
            ...event,
            user_id: userId
        }));
        
        try {
            // 注意：sendBeacon 需要 JSON 字符串
            navigator.sendBeacon('/api/analytics', JSON.stringify(eventsToSend));
        } catch (err) {
            // 如果 sendBeacon 失败，回退到普通的 flush
            flushQueue();
        }
    }
});

// 页面可见性改变时也尝试发送数据
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        flushQueue();
    }
});

/**
 * 追踪一个分析事件
 * @param {string} eventType - 事件的名称
 * @param {object} eventData - 与事件相关的额外数据
 */
export function trackEvent(eventType, eventData = {}) {
    try {
        const userId = getAnonymousUserId();
        
        eventQueue.push({
            user_id: userId,
            event_type: eventType,
            event_data: eventData,
        });

        console.log(`📊 Analytics: 追踪事件 ${eventType}`, eventData);

        // 如果定时器已存在，则清除它，重新计时
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        // 设置一个定时器，3秒后发送队列中的所有事件
        debounceTimer = setTimeout(flushQueue, 3000);
        
        // 如果队列过大，立即发送
        if (eventQueue.length >= 10) {
            flushQueue();
        }
    } catch (err) {
        console.warn('📊 Analytics: 追踪事件失败:', err.message);
    }
}

/**
 * 手动触发发送所有待发送的事件
 */
export function flushAnalytics() {
    return flushQueue();
}

/**
 * 获取当前用户的匿名ID（用于调试）
 */
export function getDebugUserId() {
    return getAnonymousUserId();
} 