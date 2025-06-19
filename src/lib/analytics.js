// 简化的分析系统 - 纯计数模式，无用户识别
// 移除Supabase依赖，避免iOS兼容性问题

let eventQueue = [];
let isEnabled = true; // 允许用户完全禁用分析

/**
 * 追踪一个分析事件 - 简化版本，仅本地计数
 * @param {string} eventType - 事件的名称
 * @param {object} eventData - 与事件相关的额外数据
 */
export function trackEvent(eventType, eventData = {}) {
    if (!isEnabled) {
        return;
    }
    
    try {
        // 创建简化的事件记录，不包含用户ID
        const event = {
            event_type: eventType,
            event_data: eventData,
            timestamp: new Date().toISOString(),
        };

        // 仅在内存中存储，不依赖localStorage
        eventQueue.push(event);
        
        console.log(`📊 Analytics: 追踪事件 ${eventType}`, eventData);
        
        // 限制队列大小，防止内存泄漏
        if (eventQueue.length > 100) {
            eventQueue = eventQueue.slice(-50); // 保留最新的50个事件
        }
    } catch (err) {
        console.warn('📊 Analytics: 追踪事件失败:', err.message);
    }
}

/**
 * 手动触发发送所有待发送的事件 - 简化版本
 */
export function flushAnalytics() {
    if (eventQueue.length > 0) {
        console.log(`📊 Analytics: 清理队列中的 ${eventQueue.length} 个事件`);
        eventQueue = [];
    }
    return Promise.resolve();
}

/**
 * 获取当前队列中的事件数量（用于调试）
 */
export function getQueueSize() {
    return eventQueue.length;
}

/**
 * 启用或禁用分析功能
 * @param {boolean} enabled - 是否启用
 */
export function setAnalyticsEnabled(enabled) {
    isEnabled = enabled;
    if (!enabled) {
        eventQueue = [];
        console.log('📊 Analytics: 已禁用分析功能');
    } else {
        console.log('📊 Analytics: 已启用分析功能');
    }
}

/**
 * 获取基本统计信息（本地计数）
 */
export function getLocalStats() {
    const stats = {};
    
    eventQueue.forEach(event => {
        const type = event.event_type;
        stats[type] = (stats[type] || 0) + 1;
    });
    
    return stats;
}

// 移除所有与Supabase和localStorage相关的代码
// 移除beforeunload和visibilitychange事件监听器，因为不再需要发送数据

console.log('📊 Analytics: 已加载简化分析系统（无用户识别）'); 