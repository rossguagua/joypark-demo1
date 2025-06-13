import { supabase } from './supabase.js';

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
    
    isFlushingQueue = true;
    const eventsToSend = [...eventQueue];
    eventQueue = [];
    clearTimeout(debounceTimer);
    debounceTimer = null;
    
    try {
        const { error } = await supabase.from('analytics_events').insert(eventsToSend);
        if (error) {
            console.warn('Analytics Batch Error:', error);
            // 如果发送失败，可以选择重新加入队列或忽略
        } else {
            console.log(`Successfully sent ${eventsToSend.length} analytics events`);
        }
    } catch (err) {
        console.warn('Failed to flush analytics queue:', err);
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
        console.warn('Failed to track event:', err);
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