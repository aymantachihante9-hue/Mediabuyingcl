import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import StatCard from "@/components/admin/StatCard";
import { Wallet, Clock, AlertCircle, Repeat } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FinancePage() {
  await requireAdmin("finance");
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const [paid, pending, overdue, recurring, invoices] = await Promise.all([
    prisma.invoice.aggregate({ where: { status: "PAID", paidAt: { gte: monthStart } }, _sum: { amountMad: true } }),
    prisma.invoice.aggregate({ where: { status: "PENDING" }, _sum: { amountMad: true } }),
    prisma.invoice.count({ where: { status: "OVERDUE" } }),
    prisma.invoice.count({ where: { recurring: true } }),
    prisma.invoice.findMany({ orderBy: { createdAt: "desc" }, include: { client: { select: { businessName: true } } }, take: 50 }),
  ]);
  const badge: Record<string, string> = {
    PAID: "bg-green-500/15 text-green-400", PENDING: "bg-gold/15 text-gold-300",
    OVERDUE: "bg-red-500/15 text-red-400", CANCELLED: "bg-white/5 text-slate-500",
  };
  return (
    <div className="space-y-5">
      <h1 className="display text-2xl font-extrabold">المالية</h1>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard icon={Wallet} label="إيرادات الشهر" value={`${(paid._sum.amountMad ?? 0).toLocaleString("fr-MA")} د.م`} accent="text-green-400 bg-green-500/10" />
        <StatCard icon={Clock} label="فواتير معلقة" value={`${(pending._sum.amountMad ?? 0).toLocaleString("fr-MA")} د.م`} accent="text-gold-300 bg-gold/10" />
        <StatCard icon={AlertCircle} label="متأخرة" value={overdue} accent="text-red-400 bg-red-500/10" />
        <StatCard icon={Repeat} label="باقات متكررة" value={recurring} />
      </div>
      <div className="glass overflow-x-auto rounded-2xl shadow-card">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="text-right text-xs text-slate-500">
            <tr className="border-b border-white/5">{["الفاتورة", "العميل", "المبلغ", "الحالة", "الاستحقاق", "متكررة"].map((h: any) => <th key={h} className="p-3">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {invoices.map((inv: any) => (
              <tr key={inv.id}>
                <td className="p-3 font-medium">{inv.number}</td>
                <td className="p-3">{inv.client.businessName}</td>
                <td className="p-3">{inv.amountMad.toLocaleString("fr-MA")} د.م</td>
                <td className="p-3"><span className={`rounded-full px-2.5 py-1 text-xs ${badge[inv.status]}`}>{inv.status}</span></td>
                <td className="p-3">{format(inv.dueDate, "dd/MM/yyyy")}</td>
                <td className="p-3">{inv.recurring ? "✓" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && <p className="p-10 text-center text-sm text-slate-500">لا توجد فواتير بعد.</p>}
      </div>
    </div>
  );
}
