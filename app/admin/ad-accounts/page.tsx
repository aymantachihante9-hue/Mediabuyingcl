import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdAccountsPage() {
  await requireAdmin("ad-accounts");
  const accounts = await prisma.adAccount.findMany({ include: { client: { select: { businessName: true } }, campaigns: { select: { id: true, status: true } } } });
  return (
    <div className="space-y-5">
      <h1 className="display text-2xl font-extrabold">الحسابات الإعلانية</h1>
      {accounts.length === 0 && <div className="glass rounded-2xl p-14 text-center text-slate-500">لا توجد حسابات إعلانية بعد.</div>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {accounts.map((a: any) => (
          <div key={a.id} className="glass rounded-2xl p-5 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold">{a.accountName}</div>
                <div dir="ltr" className="text-xs text-slate-500">{a.accountId}</div>
              </div>
              <span className="rounded-full bg-electric/15 px-2.5 py-1 text-xs text-electric-400">{a.platform}</span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-400">
              <div>💰 الإنفاق: {a.spend.toLocaleString("fr-MA")}</div>
              <div>🎯 CPA: {a.cpa?.toFixed(0) ?? "—"}</div>
              <div>📈 ROAS: {a.roas?.toFixed(2) ?? "—"}x</div>
              <div>👆 CTR: {a.ctr?.toFixed(2) ?? "—"}%</div>
              <div>🚀 حملات نشطة: {a.campaigns.filter((c: any) => c.status === "active").length}</div>
              <div>🕐 آخر مزامنة: {a.lastSyncAt ? new Date(a.lastSyncAt).toLocaleDateString("ar-MA") : "—"}</div>
            </dl>
            {a.client && <div className="mt-3 text-xs text-slate-600">العميل: {a.client.businessName}</div>}
            {a.notes && <p className="mt-2 rounded-xl bg-navy-900/60 p-2.5 text-xs text-slate-500">{a.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
