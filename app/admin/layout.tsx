import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { headers } from "next/headers";
import { createSupabaseServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "لوحة التحكم — Earn Partner", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Login page renders without chrome
  const path = headers().get("x-invoke-path") ?? "";
  let name = "Admin";
  try {
    const supabase = createSupabaseServer();
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      const m = await prisma.teamMember.findUnique({ where: { supabaseId: data.user.id } });
      if (m) name = m.name;
    } else {
      return <>{children}</>; // unauthenticated → only /admin/login reaches here via middleware
    }
  } catch {}

  return (
    <div dir="rtl" className="min-h-screen bg-navy-950 text-slate-100">
      <Sidebar />
      <Topbar userName={name} />
      <main className="px-4 py-6 md:px-8 lg:pr-64">{children}</main>
    </div>
  );
}
