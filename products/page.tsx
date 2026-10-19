import { Package, ShoppingBag } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

type Product = {
  id: string;
  name: string;
  sku: string | null;
  price: number | string;
  stock: number;
  status: string;
};

export default async function ProductsPage() {
  await requireUser();
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("products")
    .select("id, name, sku, price, stock, status")
    .eq("status", "在售")
    .order("created_at", { ascending: false });
  const products = (data ?? []) as Product[];

  return (
    <section className="container dashboard section">
      <div className="section-heading module-heading">
        <div>
          <span>IRIS PRODUCTS</span>
          <h1><ShoppingBag size={31} /> 产品阅览</h1>
          <p>登录用户可以查看产品信息，商品维护仍由管理员负责。</p>
        </div>
        <span className="count-badge">{products.length} 件产品</span>
      </div>
      {error && <div className="notice">产品暂时无法加载，请稍后再试。</div>}
      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-card-head">
              <div><h2>{product.name}</h2><small>SKU：{product.sku || "暂无"}</small></div>
              <Package size={24} />
            </div>
            <strong className="product-card-price">¥ {Number(product.price ?? 0).toFixed(2)}</strong>
            <div className="product-card-meta">
              <span>库存：{product.stock}</span>
              <span className={`status ${product.status === "在售" ? "live" : "draft"}`}>{product.status}</span>
            </div>
          </article>
        ))}
      </div>
      {!error && !products.length && <div className="empty">目前还没有可展示的产品。</div>}
    </section>
  );
}
