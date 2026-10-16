import { BarChart3, Briefcase, Megaphone, Package, ShieldCheck, ShoppingCart, Trash2, Users, UsersRound } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { changeRole, createAnnouncement, deleteAnnouncement } from "./actions";
import Link from "next/link";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  await requireAdmin();
  const admin = createAdminClient();
  const [{ data: profiles }, { data: announcements }] = await Promise.all([
    admin.from("profiles").select("id, email, display_name, role, created_at").order("created_at", { ascending: false }),
    admin.from("announcements").select("id, title, content, published, created_at").order("created_at", { ascending: false }),
  ]);
  const { message } = await searchParams;
  const admins = profiles?.filter((p) => p.role === "admin").length ?? 0;

  return (
    <section className="container dashboard section">
      {message && <div className="notice">{message}</div>}
      <div className="section-heading"><div><span>ADMIN CONSOLE</span><h1>管理后台</h1><p>用户权限与网站内容集中管理。</p></div><div className="admin-badge"><ShieldCheck size={17} /> 已通过管理员验证</div></div>
      <div className="stats compact">
        <article><UsersRound /><span>用户总数</span><strong>{profiles?.length ?? 0}</strong></article>
        <article><ShieldCheck /><span>管理员</span><strong>{admins}</strong></article>
        <article><Megaphone /><span>公告数量</span><strong>{announcements?.length ?? 0}</strong></article>
      </div>

      <div className="module-cards">
        <Link href="/admin/customers" className="module-card"><Users /><div><strong>客户管理</strong><span>客户档案与跟进状态</span></div><b>→</b></Link>
        <Link href="/admin/products" className="module-card"><Package /><div><strong>商品管理</strong><span>价格、SKU 与库存</span></div><b>→</b></Link>
        <Link href="/admin/orders" className="module-card"><ShoppingCart /><div><strong>订单管理</strong><span>订单金额与履约状态</span></div><b>→</b></Link>
        <Link href="/admin/employees" className="module-card"><Briefcase /><div><strong>员工管理</strong><span>部门、职位与状态</span></div><b>→</b></Link>
        <Link href="/admin/projects" className="module-card"><BarChart3 /><div><strong>项目进度</strong><span>负责人、进度与截止日期</span></div><b>→</b></Link>
        <Link href="/admin/analytics" className="module-card highlight"><BarChart3 /><div><strong>数据统计图表</strong><span>业务概况与趋势快照</span></div><b>→</b></Link>
      </div>

      <div className="admin-grid">
        <div className="panel wide">
          <div className="panel-title"><div><h2>用户与权限</h2><p>调整用户的系统角色</p></div></div>
          <div className="table-wrap"><table><thead><tr><th>用户</th><th>加入日期</th><th>角色</th><th>操作</th></tr></thead><tbody>
            {profiles?.map((profile) => (
              <tr key={profile.id}><td><strong>{profile.display_name || "未设置名称"}</strong><small>{profile.email}</small></td><td>{new Date(profile.created_at).toLocaleDateString("zh-CN")}</td><td><span className={`role ${profile.role}`}>{profile.role === "admin" ? "管理员" : "用户"}</span></td><td>
                <form action={changeRole} className="inline-form"><input type="hidden" name="userId" value={profile.id} /><select name="role" defaultValue={profile.role}><option value="user">普通用户</option><option value="admin">管理员</option></select><button>保存</button></form>
              </td></tr>
            ))}
          </tbody></table></div>
        </div>

        <div className="panel compose">
          <div className="panel-title"><div><h2>发布公告</h2><p>发布后显示在网站首页</p></div></div>
          <form action={createAnnouncement} className="form-stack">
            <label>标题<input name="title" required placeholder="公告标题" /></label>
            <label>正文<textarea name="content" required rows={5} placeholder="写下公告内容…" /></label>
            <label className="check"><input name="published" type="checkbox" defaultChecked /> 立即公开</label>
            <button className="button">发布公告</button>
          </form>
        </div>
      </div>

      <div className="panel announcement-list">
        <div className="panel-title"><div><h2>公告管理</h2><p>已创建的全部公告</p></div></div>
        {announcements?.length ? announcements.map((item) => (
          <article key={item.id}><div><span className={`status ${item.published ? "live" : "draft"}`}>{item.published ? "已发布" : "草稿"}</span><h3>{item.title}</h3><p>{item.content}</p></div><form action={deleteAnnouncement}><input type="hidden" name="id" value={item.id} /><button className="icon-button" title="删除"><Trash2 size={17} /></button></form></article>
        )) : <div className="empty">还没有公告，右侧表单可以创建第一条。</div>}
      </div>
    </section>
  );
}
