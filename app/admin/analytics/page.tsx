import Link from "next/link";
import { ArrowLeft, BarChart3, Box, CircleDollarSign, ClipboardList, Users } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AnalyticsPage() {
  await requireAdmin();
  const admin = createAdminClient();
  const [{ data: customers }, { data: products }, { data: orders }, { data: employees }, { data: projects }] = await Promise.all([
    admin.from("customers").select("id, status"),
    admin.from("products").select("id, stock"),
    admin.from("orders").select("id, total, status"),
    admin.from("employees").select("id, status"),
    admin.from("projects").select("id, progress, status"),
  ]);
  const orderRows = orders ?? [];
  const revenue = orderRows.filter((order) => order.status !== "已取消").reduce((sum, order) => sum + Number(order.total ?? 0), 0);
  const averageProgress = projects?.length ? Math.round(projects.reduce((sum, project) => sum + Number(project.progress ?? 0), 0) / projects.length) : 0;
  const orderStatus = ["待付款", "处理中", "已发货", "已完成", "已取消"].map((status) => ({ status, count: orderRows.filter((order) => order.status === status).length }));
  const maxOrderCount = Math.max(1, ...orderStatus.map((item) => item.count));

  return (
    <section className="container dashboard section">
      <Link href="/admin" className="back-link"><ArrowLeft size={16} /> 返回管理总览</Link>
      <div className="section-heading"><div><span>IRIS BUSINESS</span><h1><BarChart3 size={31} /> 数据统计图表</h1><p>从客户、商品、订单、员工与项目数据中查看业务概况。</p></div></div>
      <div className="stats">
        <article><Users /><span>客户总数</span><strong>{customers?.length ?? 0}</strong></article>
        <article><Box /><span>商品库存</span><strong>{products?.reduce((sum, product) => sum + Number(product.stock ?? 0), 0) ?? 0}</strong></article>
        <article><ClipboardList /><span>订单总数</span><strong>{orderRows.length}</strong></article>
      </div>
      <div className="analytics-grid">
        <div className="panel chart-panel"><div className="panel-title"><div><h2>订单状态分布</h2><p>不同状态下的订单数量</p></div></div><div className="bar-chart">{orderStatus.map((item) => <div className="bar-row" key={item.status}><span>{item.status}</span><div className="bar-track"><i style={{ width: `${(item.count / maxOrderCount) * 100}%` }} /></div><strong>{item.count}</strong></div>)}</div></div>
        <div className="panel chart-panel"><div className="panel-title"><div><h2>经营摘要</h2><p>当前业务数据快照</p></div></div><div className="summary-list"><div><CircleDollarSign /><span>有效订单金额</span><strong>¥ {revenue.toFixed(2)}</strong></div><div><BarChart3 /><span>项目平均进度</span><strong>{averageProgress}%</strong></div><div><Users /><span>在职员工</span><strong>{employees?.filter((employee) => employee.status === "在职").length ?? 0}</strong></div></div></div>
      </div>
      <div className="panel project-chart"><div className="panel-title"><div><h2>项目进度</h2><p>所有项目当前完成比例</p></div></div>{projects?.length ? <div className="project-bars">{projects.map((project) => <div className="project-bar" key={project.id}><div><span>{project.status}</span><strong>项目 {String(project.id).slice(0, 8)}</strong></div><div className="progress"><span style={{ width: `${Number(project.progress ?? 0)}%` }} /></div><b>{project.progress}%</b></div>)}</div> : <div className="empty">还没有项目数据。</div>}</div>
    </section>
  );
}
