# Iris 管理后台

一个可部署的中文管理后台起点，包含：

- 邮箱注册、登录与退出
- GitHub OAuth 登录
- 普通用户 / 管理员角色权限
- 受保护的个人工作台和 `/admin` 后台
- 用户角色管理
- 公告创建、展示与删除
- Supabase PostgreSQL 与行级安全策略（RLS）
- Vercel / GitHub 自动部署支持

## 1. 安装并启动

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

打开 <http://localhost:3000>。

## 2. 创建 Supabase 数据库

1. 在 [Supabase](https://supabase.com) 新建项目。
2. 打开 **SQL Editor**，复制并运行 `supabase/schema.sql`。
3. 在 **Project Settings → API** 找到项目 URL、anon key 和 service_role key。
4. 填写 `.env.local`。`SUPABASE_SERVICE_ROLE_KEY` 只能保存在服务端，禁止提交到 GitHub。

要启用客户、商品、订单、员工、项目和统计模块，再在 SQL Editor 中复制运行 `supabase/business-schema.sql`。这个增量脚本可以重复运行。

## 3. 设置第一个管理员

先通过网页注册一个账户，然后在 Supabase SQL Editor 运行：

```sql
update public.profiles set role = 'admin' where email = '你的邮箱@example.com';
```

退出并重新登录后即可访问 `/admin`。

## 4. 开启 GitHub 登录

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**。
2. Homepage URL 本地填写 `http://localhost:3000`。
3. Authorization callback URL 填写 Supabase 控制台 **Authentication → Providers → GitHub** 中显示的 callback URL，格式通常为：
   `https://你的项目.supabase.co/auth/v1/callback`
4. 将 GitHub 生成的 Client ID 和 Client Secret 填入 Supabase 的 GitHub Provider 并启用。
5. Supabase **Authentication → URL Configuration**：Site URL 本地使用 `http://localhost:3000`，并将 `http://localhost:3000/auth/callback` 加入 Redirect URLs。

## 5. 推送 GitHub 并部署 Vercel

```bash
git init
git add .
git commit -m "Initial admin dashboard"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库.git
git push -u origin main
```

在 [Vercel](https://vercel.com) 导入这个 GitHub 仓库，并添加 `.env.local` 中的三个环境变量。部署后，把正式域名及 `https://你的域名/auth/callback` 加入 Supabase Redirect URLs。以后每次推送 `main` 分支都会自动部署。

## 安全说明

- 页面权限在服务端验证，数据库同时启用 RLS。
- `service_role` 只在管理员服务端操作中使用，不会发往浏览器。
- 管理员不能在后台取消自己的管理员权限，避免误锁定。
- 正式上线前建议开启邮件验证，并在 Supabase 设置密码强度和登录频率限制。

## 业务模块

管理员登录后，在 `/dashboard` 或 `/admin` 可以进入：

- `/admin/customers` 客户管理
- `/admin/products` 商品管理
- `/admin/orders` 订单管理
- `/admin/employees` 员工管理
- `/admin/projects` 项目进度
- `/admin/analytics` 数据统计图表
