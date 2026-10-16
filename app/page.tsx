import Link from "next/link";
import { ArrowRight, Database, Github, LockKeyhole, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, title, content, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <>
      <section className="hero container">
        <div className="eyebrow"><ShieldCheck size={16} /> 安全、清晰、可以继续扩展</div>
        <h1>你的业务，<br /><em>从这里开始管理。</em></h1>
        <p>一个真正可运行的管理后台起点：用户登录、GitHub OAuth、角色权限、数据库与内容管理都已规划好。</p>
        <div className="hero-actions">
          <Link href="/login" className="button">开始使用 <ArrowRight size={17} /></Link>
          <a href="https://github.com" className="button ghost"><Github size={17} /> GitHub</a>
        </div>
      </section>

      <section className="feature-grid container">
        <article><LockKeyhole /><h3>身份认证</h3><p>邮箱密码和 GitHub 登录，服务端安全校验会话。</p></article>
        <article><ShieldCheck /><h3>角色权限</h3><p>普通用户与管理员分权，后台路由双重保护。</p></article>
        <article><Database /><h3>真实数据库</h3><p>Supabase PostgreSQL，加上行级安全策略。</p></article>
      </section>

      {announcements?.length ? (
        <section className="container section">
          <div className="section-heading"><div><span>最新动态</span><h2>公告</h2></div></div>
          <div className="announcement-grid">
            {announcements.map((item) => (
              <article className="announcement" key={item.id}>
                <time>{new Date(item.created_at).toLocaleDateString("zh-CN")}</time>
                <h3>{item.title}</h3><p>{item.content}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
