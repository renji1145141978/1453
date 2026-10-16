"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isBusinessModule } from "@/lib/business";

export async function createBusinessRecord(formData: FormData) {
  await requireAdmin();
  const module = String(formData.get("module"));
  if (!isBusinessModule(module)) redirect("/admin?message=无效的业务模块");
  const admin = createAdminClient();
  let error;

  if (module === "customers") {
    ({ error } = await admin.from("customers").insert({ name: String(formData.get("name")), company: String(formData.get("company") || ""), email: String(formData.get("email") || ""), phone: String(formData.get("phone") || ""), status: String(formData.get("status") || "潜在客户") }));
  } else if (module === "products") {
    ({ error } = await admin.from("products").insert({ name: String(formData.get("name")), sku: String(formData.get("sku") || "") || null, price: Number(formData.get("price") || 0), stock: Number(formData.get("stock") || 0), status: String(formData.get("status") || "在售") }));
  } else if (module === "orders") {
    ({ error } = await admin.from("orders").insert({ order_no: String(formData.get("order_no")), customer_id: String(formData.get("customer_id") || "") || null, total: Number(formData.get("total") || 0), status: String(formData.get("status") || "待付款") }));
  } else if (module === "employees") {
    ({ error } = await admin.from("employees").insert({ name: String(formData.get("name")), department: String(formData.get("department") || ""), title: String(formData.get("title") || ""), email: String(formData.get("email") || ""), status: String(formData.get("status") || "在职") }));
  } else {
    ({ error } = await admin.from("projects").insert({ name: String(formData.get("name")), owner: String(formData.get("owner") || ""), progress: Number(formData.get("progress") || 0), status: String(formData.get("status") || "进行中"), due_date: String(formData.get("due_date") || "") || null }));
  }

  if (error) redirect(`/admin/${module}?message=${encodeURIComponent(error.message)}`);
  revalidatePath(`/admin/${module}`);
  revalidatePath("/admin");
}

export async function deleteBusinessRecord(formData: FormData) {
  await requireAdmin();
  const module = String(formData.get("module"));
  const id = String(formData.get("id"));
  if (!isBusinessModule(module) || !id) redirect("/admin");
  const admin = createAdminClient();
  await admin.from(module).delete().eq("id", id);
  revalidatePath(`/admin/${module}`);
  revalidatePath("/admin");
}
