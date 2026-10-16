"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function changeRole(formData: FormData) {
  const { user } = await requireAdmin();
  const userId = String(formData.get("userId"));
  const role = String(formData.get("role"));
  if (!['user', 'admin'].includes(role)) throw new Error("无效角色");
  if (userId === user.id && role !== "admin") redirect("/admin?message=不能取消自己的管理员权限");

  const admin = createAdminClient();
  const { error } = await admin.from("profiles").update({ role }).eq("id", userId);
  if (error) redirect(`/admin?message=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin");
}

export async function createAnnouncement(formData: FormData) {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("announcements").insert({
    title: String(formData.get("title")),
    content: String(formData.get("content")),
    published: formData.get("published") === "on",
    created_by: user.id,
  });
  if (error) redirect(`/admin?message=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin"); revalidatePath("/");
}

export async function deleteAnnouncement(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("announcements").delete().eq("id", String(formData.get("id")));
  revalidatePath("/admin"); revalidatePath("/");
}
