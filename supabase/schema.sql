-- 在 Supabase SQL Editor 中运行此文件。
create type public.user_role as enum ('user', 'admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  content text not null,
  published boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'user_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.announcements enable row level security;

create policy "users can read own profile" on public.profiles
for select to authenticated using ((select auth.uid()) = id);

create policy "anyone can read published announcements" on public.announcements
for select using (published = true);

-- 注册第一个账户后，用该账户邮箱执行下面这句，将其设为管理员：
-- update public.profiles set role = 'admin' where email = '你的邮箱@example.com';
