import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { subDays } from "date-fns";
import { Download } from "lucide-react";

export const dynamic = "force-dynamic";

async function summary(days: number) {
  const since = subDays(new Date(), days);
  const [metrics, leads] = await Promise.all([
    prisma.dailyMetric.findMany({ where: { date: { gte: since } } }),
    prisma.lead.count({ where: { createdAt: { gte: since } } }),
  ]);
  const sum = (k: "orders" | "spend" | "revenue") => metrics.reduce((a: any, m: any) => a + m[k], 0);
  const roasArr = metrics.map((m: any) => m.roas).filter((x: any): x is number => x != null);
  return {
    leads, orders: sum("orders"), spend: sum("spend"), revenue: sum("revenue"),
    roas: roasArr.length ? roasArr.reduce((a: any, b: any) => a + b, 0) / roasArr.length : 0,
  };
}

export default async function ReportsPage() {
  await requireAdmin("reports");
  const [daily, weekly, monthly] = await Promise.all([summary(1), summary(7), summary(30)]);
  const reports = [
    { title: "التقرير اليومي", period: "daily", data: daily },
    { title: "التقرير الأسبوعي", period: "weekly", data: weekly },
    { title: "التقرير الشهري", period: "monthly", data: monthly },
  ];
  return (
    <div className="space-y-5">
      <h1 className="display text-2xl font-extrabold">التقارير</h1>
      <div className="grid gap-4 lg:grid-cols-3">
        {reports.map((r: any) => (
          <div key={r.period} className="glass rounded-2xl p-6 shadow-card">
            <h2 className="display text-lg font-bold">{r.title}</h2>
            <dl className="mt-4 space-y-2 text-sm text-slate-300">
              <div className="flex justify-between"><dt className="text-slate-500">عملاء محتملون</dt><dd className="font-bold">{r.data.leads}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">طلبيات</dt><dd className="font-bold">{r.data.orders}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">إنفاق</dt><dd className="font-bold">{r.data.spend.toLocaleString("fr-MA")} د.م</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">إيرادات</dt><dd className="font-bold">{r.data.revenue.toLocaleString("fr-MA")} د.م</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">ROAS</dt><dd className="font-bold text-electric-400">{r.data.roas.toFixed(2)}x</dd></div>
            </dl>
            <a href={`/api/reports?period=${r.period}`}
              className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-white/5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10">
              <Download className="h-4 w-4" /> تصدير CSV
            </a>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-600">CSV يُفتح مباشرة في Excel. لتصدير PDF، اطبع الصفحة (Ctrl+P → حفظ كـ PDF).</p>
    </div>
  );
}
