-- 业务模块增量表。先运行 schema.sql，再运行本文件。
-- 所有表都使用 IF NOT EXISTS，可重复运行。

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text,
  phone text,
  status text not null default '潜在客户',
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text unique,
  price numeric(12,2) not null default 0,
  stock integer not null default 0,
  status text not null default '在售',
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  total numeric(12,2) not null default 0,
  status text not null default '待付款',
  created_at timestamptz not null default now()
);

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  department text,
  title text,
  email text,
  status text not null default '在职',
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner text,
  progress integer not null default 0 check (progress between 0 and 100),
  status text not null default '进行中',
  due_date date,
  created_at timestamptz not null default now()
);

alter table public.customers enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.employees enable row level security;
alter table public.projects enable row level security;
