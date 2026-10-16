import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iris 管理后台",
  description: "带 GitHub 登录和权限管理的现代管理后台",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="zh-CN">
      <body>
        <header className="site-header">
          <Link href="/" className="brand"><span>I</span> Iris</Link>
          <nav>
            <Link href="/">首页</Link>
            {user ? (
              <>
                <Link href="/dashboard">工作台</Link>
                <Link href="/admin">管理后台</Link>
                <form action={logout}><button className="nav-button">退出</button></form>
              </>
            ) : <Link href="/login" className="button small">登录</Link>}
          </nav>
        </header>
        <main>{children}</main>
        <footer>Iris 管理后台 · Next.js + Supabase</footer>
      </body>
    </html>
  );
}
