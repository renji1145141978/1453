import Link from "next/link";
import { ArrowUpRight, BarChart3, Bell, Briefcase, Package, ShoppingCart, Shield, UserRound, Users } from "lucide-react";
import { requireUser } from "@/lib/auth";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const { user, supabase } = await requireUser();
  const { data: profile } = await supabase.from("profiles").select("display_name, role, created_at").eq("id", user.id).single();
  const { message } = await searchParams;

  return (
    <section className="container dashboard section">
      {message && <div className="notice">{message}</div>}
      <div className="section-heading">
        <div><span>个人工作台</span><h1>你好，{profile?.display_name || user.email}</h1></div>
        {profile?.role === "admin" && <Link href="/admin" className="button">打开管理后台 <ArrowUpRight size={17} /></Link>}
      </div>
      <div className="stats">
        <article><UserRound /><span>当前账户</span><strong>{user.email}</strong></article>
        <article><Shield /><span>账户角色</span><strong>{profile?.role === "admin" ? "管理员" : "普通用户"}</strong></article>
        <article><Bell /><span>账户状态</span><strong>正常</strong></article>
      </div>
      <div className="module-cards customer-modules">
        <Link href="/products" className="module-card highlight"><Package /><div><strong>产品阅览</strong><span>查看在售产品、价格与库存</span></div><b>→</b></Link>
      </div>
      {profile?.role === "admin" && <div className="module-cards workbench-modules">
        <Link href="/admin/customers" className="module-card"><Users /><div><strong>客户管理</strong><span>客户档案与跟进</span></div><b>→</b></Link>
        <Link href="/admin/products" className="module-card"><Package /><div><strong>商品管理</strong><span>价格与库存</span></div><b>→</b></Link>
        <Link href="/admin/orders" className="module-card"><ShoppingCart /><div><strong>订单管理</strong><span>订单与履约</span></div><b>→</b></Link>
        <Link href="/admin/employees" className="module-card"><Briefcase /><div><strong>员工管理</strong><span>团队信息</span></div><b>→</b></Link>
        <Link href="/admin/projects" className="module-card"><BarChart3 /><div><strong>项目进度</strong><span>项目追踪</span></div><b>→</b></Link>
        <Link href="/admin/analytics" className="module-card highlight"><BarChart3 /><div><strong>数据统计图表</strong><span>业务数据概览</span></div><b>→</b></Link>
      </div>}
      <div className="panel welcome-panel">
        <div><span className="tag">下一步</span><h2>你的工作台已经准备好了</h2><p>可以在这里继续添加订单、文章、项目或其他业务模块。</p></div>
        <div className="orb" />
      </div>
    </section>
  );
}
