// 简化版Supabase客户端 - 移动端兼容性优化
// 这个版本不依赖复杂的ES6模块功能，适用于老旧移动端浏览器

// 直接使用硬编码配置，避免import.meta.env问题
const SUPABASE_URL = 'https://frqjqmwuznhjqukdmexg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZycWpxbXd1em5oanF1a2RtZXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0Mzg5MzksImV4cCI6MjA2NTAxNDkzOX0.xIRuRUA9ToS6LWYfRUIHVbMsu9P5LdxY35zPC2s-E4U';

console.log('🔌 简化版Supabase客户端加载');

// 简单的HTTP客户端
class SimpleSupabaseClient {
    constructor(url, key) {
        this.url = url;
        this.key = key;
        this.headers = {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };
        
        console.log('SimpleSupabaseClient 初始化:', {
            url: this.url,
            keyPreview: `${this.key.substring(0, 20)}...`
        });
    }

    async request(endpoint, options = {}) {
        const url = `${this.url}/rest/v1${endpoint}`;
        
        console.log(`📡 发送请求: ${options.method || 'GET'} ${url}`);
        
        const requestOptions = {
            method: options.method || 'GET',
            headers: {
                ...this.headers,
                ...options.headers
            }
        };

        if (options.body) {
            requestOptions.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, requestOptions);
            
            console.log(`📡 响应状态: ${response.status} ${response.statusText}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('请求失败:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log('📡 响应数据:', data);
            return data;
            
        } catch (error) {
            console.error('请求异常:', error);
            throw error;
        }
    }

    // 查询构建器
    from(table) {
        return new QueryBuilder(this, table);
    }
}

class QueryBuilder {
    constructor(client, table) {
        this.client = client;
        this.table = table;
        this.query = {
            select: '*',
            filters: [],
            order: null,
            limit: null,
            single: false
        };
    }

    select(columns) {
        this.query.select = columns;
        return this;
    }

    eq(column, value) {
        this.query.filters.push(`${column}=eq.${encodeURIComponent(value)}`);
        return this;
    }

    order(column, options = {}) {
        const direction = options.ascending ? 'asc' : 'desc';
        this.query.order = `${column}.${direction}`;
        return this;
    }

    limit(count) {
        this.query.limit = count;
        return this;
    }

    single() {
        this.query.single = true;
        return this;
    }

    async execute() {
        let endpoint = `/${this.table}?select=${encodeURIComponent(this.query.select)}`;
        
        if (this.query.filters.length > 0) {
            endpoint += '&' + this.query.filters.join('&');
        }
        
        if (this.query.order) {
            endpoint += `&order=${this.query.order}`;
        }
        
        if (this.query.limit) {
            endpoint += `&limit=${this.query.limit}`;
        }

        const headers = {};
        if (this.query.single) {
            headers['Accept'] = 'application/vnd.pgrst.object+json';
        }

        const data = await this.client.request(endpoint, { headers });
        return { data, error: null };
    }
}

// 创建客户端实例
const supabase = new SimpleSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 重试机制
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            console.warn(`操作失败，尝试第 ${i + 1}/${maxRetries} 次重试:`, error.message);
            
            if (i === maxRetries - 1) {
                throw error;
            }
            
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
    }
}

// API函数
export async function getGames() {
    return retryOperation(async () => {
        const { data, error } = await supabase
            .from('games')
            .select('id, name, category_tag, description, features, players, duration, is_active, created_at')
            .eq('is_active', true)
            .order('created_at', { ascending: true })
            .execute();

        if (error) {
            console.error('Error fetching games:', error);
            throw error;
        }

        return data || [];
    });
}

export async function getGameByCategoryTag(categoryTag) {
    return retryOperation(async () => {
        const { data, error } = await supabase
            .from('games')
            .select('id, name, category_tag, description, features, players, duration, is_active, created_at')
            .eq('category_tag', categoryTag)
            .eq('is_active', true)
            .single()
            .execute();

        if (error) {
            console.error('Error fetching game by category tag:', error);
            throw error;
        }

        return data;
    });
}

export async function getGameCardIds(gameId, category) {
    return retryOperation(async () => {
        const { data, error } = await supabase
            .from('cards')
            .select('id')
            .eq('game_id', gameId)
            .eq('category', category)
            .eq('is_active', true)
            .execute();

        if (error) {
            console.error('Error fetching card IDs:', error);
            throw error;
        }

        return (data || []).map(card => card.id);
    });
}

export async function getCardById(cardId) {
    return retryOperation(async () => {
        const { data, error } = await supabase
            .from('cards')
            .select('*')
            .eq('id', cardId)
            .eq('is_active', true)
            .single()
            .execute();

        if (error) {
            console.error('Error fetching card by ID:', error);
            throw error;
        }

        return data;
    });
}

console.log('✅ 简化版Supabase API 已加载'); 