import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatCard from "@/components/admin/StatCard";
import { TrendChart, FunnelChart } from "@/components/admin/DashboardCharts";
import {
  Target, CalendarClock, Briefcase, Activity, Wallet, Megaphone, ShoppingCart, TrendingUp, MousePointerClick, Percent, Coins,
} from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await requireAdmin("dashboard");
  const today = startOfDay(new Date());
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [totalLeads, leadsToday, totalClients, activeClients, invoices, metrics, funnel, activities] =
    await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { createdAt: { gte: today } } }),
      prisma.client.count(),
      prisma.client.count({ where: { archived: false } }),
      prisma.invoice.aggregate({ where: { status: "PAID", paidAt: { gte: monthStart } }, _sum: { amountMad: true } }),
      prisma.dailyMetric.findMany({ where: { date: { gte: subDays(today, 30) } }, orderBy: { date: "asc" } }),
      Promise.all([
        prisma.lead.count(),
        prisma.lead.count({ where: { status: { in: ["CONTACTED", "MEETING_BOOKED", "WON"] } } }),
        prisma.lead.count({ where: { status: { in: ["MEETING_BOOKED", "WON"] } } }),
        prisma.lead.count({ where: { status: "WON" } }),
      ]),
      prisma.activity.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    ]);

  const sum = (k: "orders" | "spend" | "revenue") => metrics.reduce((a: any, m: any) => a + (m[k] ?? 0), 0);
  const avg = (k: "roas" | "cpa" | "ctr") => {
    const v = metrics.map((m: any) => m[k]).filter((x: any): x is number => x != null);
    return v.length ? v.reduce((a: any, b: any) => a + b, 0) / v.length : 0;
  };
  const revenue = sum("revenue"), spend = sum("spend"), orders = sum("orders");
  const chart = metrics.map((m: any) => ({
    date: format(m.date, "dd/MM"),
    leads: m.leads, orders: m.orders, revenue: m.revenue, spend: m.spend, roas: m.roas ?? 0,
  }));

  const stats = [
    { icon: Target, label: "إجمالي العملاء المحتملين", value: totalLeads },
    { icon: CalendarClock, label: "عملاء محتملون اليوم", value: leadsToday, accent: "text-gold-300 bg-gold/10" },
    { icon: Briefcase, label: "إجمالي العملاء", value: totalClients },
    { icon: Activity, label: "عملاء نشطون", value: activeClients, accent: "text-green-400 bg-green-500/10" },
    { icon: Wallet, label: "إيرادات الشهر", value: `${(invoices._sum.amountMad ?? 0).toLocaleString("fr-MA")} د.م` },
    { icon: Megaphone, label: "الإنفاق الإعلاني (30ي)", value: `${spend.toLocaleString("fr-MA")} د.م` },
    { icon: ShoppingCart, label: "الطلبيات (30ي)", value: orders },
    { icon: TrendingUp, label: "متوسط ROAS", value: avg("roas").toFixed(2) + "x", accent: "text-violet-400 bg-violet-500/10" },
    { icon: Coins, label: "متوسط CPA", value: avg("cpa").toFixed(0) + " د.م" },
    { icon: MousePointerClick, label: "متوسط CTR", value: avg("ctr").toFixed(2) + "%" },
    { icon: Percent, label: "متوسط AOV", value: orders ? (revenue / orders).toFixed(0) + " د.م" : "—" },
  ];

  const [f1, f2, f3, f4] = funnel;

  return (
    <div className="space-y-6">
      <h1 className="display text-2xl font-extrabold">لوحة التحكم</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <TrendChart data={chart} dataKey="leads" color="#3B82F6" title="العملاء المحتملون (30 يوم)" />
        <TrendChart data={chart} dataKey="orders" color="#8B5CF6" title="الطلبيات (30 يوم)" />
        <TrendChart data={chart} dataKey="revenue" color="#D9A441" title="الإيرادات (30 يوم)" />
        <TrendChart data={chart} dataKey="spend" color="#F87171" title="الإنفاق الإعلاني (30 يوم)" />
        <TrendChart data={chart} dataKey="roas" color="#34D399" title="ROAS (30 يوم)" />
        <FunnelChart data={[
          { stage: "استمارات", value: f1 },
          { stage: "تم التواصل", value: f2 },
          { stage: "اجتماع محجوز", value: f3 },
          { stage: "عميل", value: f4 },
        ]} />
      </div>
      <div className="glass rounded-2xl p-5 shadow-card">
        <h3 className="mb-3 text-sm font-bold text-slate-300">آخر النشاطات</h3>
        {activities.length === 0 && <p className="py-6 text-center text-sm text-slate-500">لا يوجد نشاط بعد — أول استمارة غادي تبان هنا.</p>}
        <ul className="divide-y divide-white/5">
          {activities.map((a: any) => (
            <li key={a.id} className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-slate-300">{a.message}</span>
              <span className="text-xs text-slate-600">{format(a.createdAt, "dd/MM HH:mm")}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
