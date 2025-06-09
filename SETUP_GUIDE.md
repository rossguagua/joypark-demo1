# 酒宝公园项目设置指南

## 当前状态
项目已经进行了以下修复：
1. ✅ 修复了Logo图片路径问题 (`images/logo.png`)
2. ✅ 改进了游戏封面图片映射函数，支持category_tag到文件名的映射
3. ✅ 优化了Supabase配置文件，增加了清晰的错误提示
4. ✅ 添加了fallback测试数据，即使数据库连接失败也能测试界面
5. ✅ 增强了错误处理和图片加载容错机制
6. ✅ 创建了图片加载测试页面 (`test-images.html`)

## 快速开始测试

### 立即测试（无需配置数据库）
1. 打开终端，进入项目目录
2. 运行：`npm run dev`
3. 在浏览器中访问：http://localhost:3000
4. 项目会自动使用fallback测试数据，你可以立即看到界面效果

### 测试图片加载
访问：http://localhost:3000/test-images.html
这个页面会测试所有图片是否能正确加载

## 需要配置的Supabase信息

### 第一步：配置Supabase连接
在 `src/lib/supabase.ts` 文件中，将以下占位符替换为你的实际Supabase项目信息：

```typescript
// 找到这两行并替换
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_PROJECT_URL'        
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'   

// 替换为（示例）：
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xxx.supabase.co'        
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'   
```

### 第二步：设置数据库行级安全策略（RLS）
在Supabase后台执行以下SQL命令：

```sql
-- 为games表创建公共读取策略
CREATE POLICY "Enable read access for all users" ON "public"."games"
FOR SELECT USING (true);

-- 为cards表创建公共读取策略
CREATE POLICY "Enable read access for all users" ON "public"."cards"
FOR SELECT USING (true);
```

### 第三步：验证数据库表结构
确保你的数据库中有以下表和字段：

#### games表
```sql
CREATE TABLE games (
    id text PRIMARY KEY,
    name text NOT NULL,
    category_tag text NOT NULL,
    description text,
    features text[],
    players text,
    duration text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);
```

#### cards表
```sql
CREATE TABLE cards (
    id text PRIMARY KEY,
    game_id text REFERENCES games(id),
    category text NOT NULL,
    content text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);
```

## 图片文件组织

### Logo文件
- 主Logo: `images/logo.png` ✅

### 游戏封面图片
所有游戏封面图片都存放在 `images/covers/` 目录下：
- `battle-royale.png` ✅
- `party-psychology.png` ✅
- `poker.png` ✅
- `love-battle.png` ✅
- `moon-night.png` ✅
- `man-di-piao-ling.png` ✅
- `kiss-marks.png` ✅
- `wisdom.png` ✅

### Category Tag 映射
项目中已配置了以下category_tag到图片文件的映射：
```javascript
const coverMapping = {
    'ice-breaker-box': 'battle-royale.png',
    'party-psychology': 'party-psychology.png',
    'poker': 'poker.png',
    'love-battle': 'love-battle.png',
    'moon-night': 'moon-night.png',
    'man-di-piao-ling': 'man-di-piao-ling.png',
    'kiss-marks': 'kiss-marks.png',
    'wisdom': 'wisdom.png'
};
```

## 开发和测试流程

### 1. 启动开发服务器
```bash
npm run dev
```

### 2. 测试页面
- 主页：http://localhost:3000
- 图片测试页：http://localhost:3000/test-images.html
- 游戏页面：http://localhost:3000/drinking-game.html

### 3. 功能测试清单
- [ ] Logo是否正确显示
- [ ] 游戏卡片背景图片是否加载
- [ ] 主游戏（聊天破冰盲盒）是否使用渐变背景
- [ ] 点击游戏卡片是否弹出预览模态框
- [ ] 模态框中的信息是否正确显示
- [ ] "即将推出"游戏是否正确标记
- [ ] 数据库连接失败时是否显示fallback数据

## 常见问题排查

### 问题1：数据库连接失败
**现象**：页面顶部显示黄色警告条 "数据库连接失败，正在使用测试数据"
**解决方案**：
- 检查Supabase URL和Key是否正确
- 确认网络连接正常
- 检查RLS策略是否设置正确

### 问题2：图片无法显示
**现象**：游戏卡片显示为渐变背景而不是图片
**解决方案**：
- 打开 http://localhost:3000/test-images.html 查看具体哪些图片加载失败
- 检查图片文件是否存在于正确路径
- 检查图片文件名是否与category_tag匹配

### 问题3：游戏列表为空
**现象**：页面一直显示 "正在加载游戏..."
**解决方案**：
- 检查浏览器控制台的错误信息
- 确认Supabase配置是否正确
- 检查数据库中是否有数据且is_active为true

### 问题4：依赖安装问题
**现象**：npm run dev 失败
**解决方案**：
```bash
# 清理并重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 如果仍有问题，尝试
npm audit fix
```

## 下一步开发建议

1. **完善数据库数据**：在Supabase中添加完整的游戏和卡片数据
2. **移除fallback数据**：当数据库配置完成后，可以移除测试数据
3. **添加更多游戏**：根据现有的图片资源添加对应的游戏数据
4. **优化图片加载**：考虑添加图片预加载或懒加载机制
5. **移动端优化**：测试并优化移动设备上的显示效果 