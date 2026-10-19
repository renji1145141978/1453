import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BarChart3, Briefcase, Package, Plus, ShoppingCart, Trash2, Users } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isBusinessModule, moduleMeta, type BusinessModule } from "@/lib/business";
import { createBusinessRecord, deleteBusinessRecord } from "../modules/actions";

type Row = Record<string, unknown>;

const icons = { customers: Users, products: Package, orders: ShoppingCart, employees: Briefcase, projects: BarChart3 };

function text(value: unknown) {
  return value === null || value === undefined || value === "" ? "—" : String(value);
}

function statusOptions(module: BusinessModule) {
  if (module === "customers") return ["潜在客户", "跟进中", "已成交", "已流失"];
  if (module === "products") return ["在售", "缺货", "下架"];
  if (module === "orders") return ["待付款", "处理中", "已发货", "已完成", "已取消"];
  if (module === "employees") return ["在职", "休假", "离职"];
  return ["未开始", "进行中", "已暂停", "已完成"];
}

function CreateForm({ module, customers }: { module: BusinessModule; customers: Row[] }) {
  const options = statusOptions(module);
  return (
    <form action={createBusinessRecord} className="form-stack module-form">
      <input type="hidden" name="module" value={module} />
      {module === "customers" && <>
        <label>姓名<input name="name" required placeholder="客户姓名" /></label>
        <label>公司<input name="company" placeholder="公司名称" /></label>
        <label>邮箱<input name="email" type="email" placeholder="name@example.com" /></label>
        <label>电话<input name="phone" placeholder="联系电话" /></label>
      </>}
      {module === "products" && <>
        <label>商品名称<input name="name" required placeholder="例如：专业咨询服务" /></label>
        <label>SKU<input name="sku" placeholder="唯一编码（可选）" /></label>
        <div className="two-fields"><label>价格<input name="price" type="number" min="0" step="0.01" defaultValue="0" /></label><label>库存<input name="stock" type="number" min="0" defaultValue="0" /></label></div>
      </>}
      {module === "orders" && <>
        <label>订单号<input name="order_no" required placeholder="例如：IRIS-2026-001" /></label>
        <label>客户<select name="customer_id"><option value="">暂不关联客户</option>{customers.map((customer) => <option key={String(customer.id)} value={String(customer.id)}>{text(customer.name)}{customer.company ? ` · ${text(customer.company)}` : ""}</option>)}</select></label>
        <label>订单金额<input name="total" type="number" min="0" step="0.01" defaultValue="0" /></label>
      </>}
      {module === "employees" && <>
        <label>姓名<input name="name" required placeholder="员工姓名" /></label>
        <label>部门<input name="department" placeholder="例如：市场部" /></label>
        <label>职位<input name="title" placeholder="例如：项目经理" /></label>
        <label>邮箱<input name="email" type="email" placeholder="name@iris.com" /></label>
      </>}
      {module === "projects" && <>
        <label>项目名称<input name="name" required placeholder="项目名称" /></label>
        <label>负责人<input name="owner" placeholder="负责人姓名" /></label>
        <div className="two-fields"><label>进度（%）<input name="progress" type="number" min="0" max="100" defaultValue="0" /></label><label>截止日期<input name="due_date" type="date" /></label></div>
      </>}
      <label>状态<select name="status" defaultValue={options[0]}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>
      <button className="button" type="submit"><Plus size={17} /> 新增{moduleMeta[module].singular}</button>
    </form>
  );
}

export default async function BusinessModulePage({ params, searchParams }: { params: Promise<{ module: string }>; searchParams: Promise<{ message?: string }> }) {
  await requireAdmin();
  const { module: rawModule } = await params;
  if (!isBusinessModule(rawModule)) notFound();
  const module = rawModule as BusinessModule;
  const admin = createAdminClient();
  const { data, error } = await admin.from(module).select("*").order("created_at", { ascending: false });
  const rows = (data ?? []) as Row[];
  const customers = module === "orders" ? ((await admin.from("customers").select("id, name, company").order("name")).data ?? []) as Row[] : [];
  const { message } = await searchParams;
  const Icon = icons[module];

  return (
    <section className="container dashboard section">
      <Link href="/admin" className="back-link"><ArrowLeft size={16} /> 返回管理总览</Link>
      {message && <div className="notice">{message}</div>}
      <div className="section-heading module-heading"><div><span>IRIS BUSINESS</span><h1><Icon size={31} /> {moduleMeta[module].label}</h1><p>{moduleMeta[module].description}</p></div><span className="count-badge">{rows.length} 条记录</span></div>
      {error && <div className="notice">数据表尚未创建，请先在 Supabase 执行 <code>supabase/business-schema.sql</code>。</div>}
      <div className="admin-grid module-layout">
        <div className="panel wide">
          <div className="panel-title"><div><h2>记录列表</h2><p>最新创建的{moduleMeta[module].singular}记录</p></div></div>
          <div className="table-wrap"><table><thead><tr>
            {module === "customers" && <><th>客户</th><th>联系方式</th><th>状态</th><th>创建日期</th><th /></>}
            {module === "products" && <><th>商品</th><th>SKU</th><th>价格</th><th>库存</th><th>状态</th><th /></>}
            {module === "orders" && <><th>订单号</th><th>客户</th><th>金额</th><th>状态</th><th>日期</th><th /></>}
            {module === "employees" && <><th>员工</th><th>部门 / 职位</th><th>邮箱</th><th>状态</th><th /></>}
            {module === "projects" && <><th>项目</th><th>负责人</th><th>进度</th><th>状态</th><th>截止日期</th><th /></>}
          </tr></thead><tbody>
            {rows.map((row) => <tr key={String(row.id)}>
              {module === "customers" && <><td><strong>{text(row.name)}</strong><small>{text(row.company)}</small></td><td><small>{text(row.email)}</small><small>{text(row.phone)}</small></td><td><span className="role user">{text(row.status)}</span></td><td>{new Date(String(row.created_at)).toLocaleDateString("zh-CN")}</td></>}
              {module === "products" && <><td><strong>{text(row.name)}</strong></td><td>{text(row.sku)}</td><td>¥ {Number(row.price ?? 0).toFixed(2)}</td><td>{text(row.stock)}</td><td><span className="role user">{text(row.status)}</span></td></>}
              {module === "orders" && <><td><strong>{text(row.order_no)}</strong></td><td>{text(customers.find((customer) => customer.id === row.customer_id)?.name)}</td><td>¥ {Number(row.total ?? 0).toFixed(2)}</td><td><span className="role user">{text(row.status)}</span></td><td>{new Date(String(row.created_at)).toLocaleDateString("zh-CN")}</td></>}
              {module === "employees" && <><td><strong>{text(row.name)}</strong></td><td>{text(row.department)} / {text(row.title)}</td><td>{text(row.email)}</td><td><span className="role user">{text(row.status)}</span></td></>}
              {module === "projects" && <><td><strong>{text(row.name)}</strong></td><td>{text(row.owner)}</td><td><div className="progress"><span style={{ width: `${Number(row.progress ?? 0)}%` }} /></div><small>{text(row.progress)}%</small></td><td><span className="role user">{text(row.status)}</span></td><td>{text(row.due_date)}</td></>}
              <td><form action={deleteBusinessRecord}><input type="hidden" name="module" value={module} /><input type="hidden" name="id" value={String(row.id)} /><button className="icon-button" title="删除" type="submit"><Trash2 size={16} /></button></form></td>
            </tr>)}
          </tbody></table></div>
          {!rows.length && <div className="empty">还没有{moduleMeta[module].singular}记录，可以使用右侧表单创建第一条。</div>}
        </div>
        <div className="panel compose"><div className="panel-title"><div><h2>新增{moduleMeta[module].singular}</h2><p>填写信息后立即保存</p></div></div><CreateForm module={module} customers={customers} /></div>
      </div>
    </section>
  );
}
