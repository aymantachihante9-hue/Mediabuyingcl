import { redirect } from "next/navigation";
import { createSupabaseServer } from "./supabase";
import { prisma } from "./prisma";
type Role = "OWNER" | "ADMIN" | "MEDIA_BUYER" | "DESIGNER" | "COPYWRITER" | "ANALYST";

// Role → allowed admin areas. OWNER/ADMIN see everything.
const ACCESS: Record<Role, string[] | "all"> = {
  OWNER: "all",
  ADMIN: "all",
  MEDIA_BUYER: ["dashboard", "leads", "clients", "campaigns", "ad-accounts", "pixels", "tasks", "calendar", "reports"],
  DESIGNER: ["dashboard", "media", "content", "tasks", "calendar"],
  COPYWRITER: ["dashboard", "content", "tasks", "calendar"],
  ANALYST: ["dashboard", "reports", "campaigns", "pixels", "ad-accounts"],
};

export async function requireAdmin(area?: string) {
  const supabase = createSupabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/admin/login");

  const member = await prisma.teamMember.findUnique({ where: { supabaseId: data.user.id } });
  if (!member || !member.active) redirect("/admin/login");

  if (area) {
    const allowed = ACCESS[member.role as Role];
    if (allowed !== "all" && !allowed.includes(area)) redirect("/admin");
  }
  return member;
}
