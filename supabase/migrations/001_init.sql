-- 创建 users 表
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text unique,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 启用 RLS
alter table users enable row level security;

-- 允许所有人读取 users 表
create policy "Allow read for all" on users
  for select
  using (true); 