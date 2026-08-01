"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Briefcase, PenSquare, Image as ImageIcon, Radar,
  Megaphone, BarChart3, FileBarChart, KanbanSquare, CalendarDays, Wallet, Settings, Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", icon: LayoutDashboard, label: "الرئيسية" },
  { href: "/admin/leads", icon: Target, label: "العملاء المحتملون" },
  { href: "/admin/clients", icon: Briefcase, label: "العملاء" },
  { href: "/admin/content", icon: PenSquare, label: "محتوى الموقع" },
  { href: "/admin/media", icon: ImageIcon, label: "مكتبة الوسائط" },
  { href: "/admin/pixels", icon: Radar, label: "البيكسلات" },
  { href: "/admin/ad-accounts", icon: Users, label: "الحسابات الإعلانية" },
  { href: "/admin/campaigns", icon: Megaphone, label: "الحملات" },
  { href: "/admin/reports", icon: FileBarChart, label: "التقارير" },
  { href: "/admin/tasks", icon: KanbanSquare, label: "المهام" },
  { href: "/admin/calendar", icon: CalendarDays, label: "التقويم" },
  { href: "/admin/finance", icon: Wallet, label: "المالية" },
  { href: "/admin/settings", icon: Settings, label: "الإعدادات" },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="fixed inset-y-0 right-0 z-40 hidden w-60 flex-col border-l border-white/5 bg-navy-900/80 backdrop-blur-xl lg:flex">
      <div className="display px-6 py-5 text-lg font-extrabold text-white">
        Earn<span className="text-electric">Partner</span>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-6">
        {nav.map((n) => {
          const active = n.href === "/admin" ? path === "/admin" : path.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active ? "bg-electric/15 text-electric-400" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
            >
              <n.icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
              {n.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
