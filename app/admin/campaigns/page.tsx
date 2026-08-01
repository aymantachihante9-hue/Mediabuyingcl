import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TrendingUp, TrendingDown } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CampaignsPage({ searchParams }: { searchParams: { q?: string; status?: string } }) {
  await requireAdmin("campaigns");
  const campaigns = await prisma.campaign.findMany({
    where: {
      ...(searchParams.status ? { status: searchParams.status } : {}),
      ...(searchParams.q ? { name: { contains: searchParams.q, mode: "insensitive" } } : {}),
    },
    orderBy: { updatedAt: "desc" },
    include: { client: { select: { businessName: true } } },
  });

  return (
    <div className="space-y-5">
      <h1 className="display text-2xl font-extrabold">الحملات</h1>
      <form className="flex flex-wrap gap-2">
        <input name="q" defaultValue={searchParams.q} placeholder="بحث بالاسم..."
          className="glass rounded-xl bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-600" />
        <select name="status" defaultValue={searchParams.status ?? ""} className="glass rounded-xl bg-transparent px-3 py-2 text-sm outline-none [&>option]:bg-navy-900">
          <option value="">كل الحالات</option>
          <option value="active">نشطة</option><option value="paused">متوقفة</option>
          <option value="learning">تعلم</option><option value="ended">منتهية</option>
        </select>
        <button className="rounded-xl bg-electric px-4 py-2 text-sm font-bold text-white">تصفية</button>
      </form>
      {campaigns.length === 0 ? (
        <div className="glass rounded-2xl p-14 text-center text-slate-500">لا توجد حملات — أضفها من قاعدة البيانات أو عبر مزامنة API الإعلانات.</div>
      ) : (
        <div className="glass overflow-x-auto rounded-2xl shadow-card">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="text-right text-xs text-slate-500">
              <tr className="border-b border-white/5">
                {["الحملة", "المنصة", "الهدف", "الحالة", "الميزانية", "الإنفاق", "النتائج", "CPA", "ROAS", "CTR", "الاتجاه"].map((h: any) => <th key={h} className="p-3">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {campaigns.map((c: any) => (
                <tr key={c.id} className="hover:bg-white/[.02]">
                  <td className="p-3 font-medium">{c.name}<div className="text-xs text-slate-600">{c.client?.businessName}</div></td>
                  <td className="p-3">{c.platform}</td>
                  <td className="p-3">{c.objective}</td>
                  <td className="p-3"><span className={`rounded-full px-2.5 py-1 text-xs ${c.status === "active" ? "bg-green-500/15 text-green-400" : "bg-white/5 text-slate-400"}`}>{c.status}</span></td>
                  <td className="p-3">{c.budget.toLocaleString("fr-MA")} د.م</td>
                  <td className="p-3">{c.spend.toLocaleString("fr-MA")} د.م</td>
                  <td className="p-3">{c.results}</td>
                  <td className="p-3">{c.cpa?.toFixed(0) ?? "—"}</td>
                  <td className="p-3 font-bold">{c.roas ? c.roas.toFixed(2) + "x" : "—"}</td>
                  <td className="p-3">{c.ctr ? c.ctr.toFixed(2) + "%" : "—"}</td>
                  <td className="p-3">{(c.roas ?? 0) >= 2 ? <TrendingUp className="h-4 w-4 text-green-400" /> : <TrendingDown className="h-4 w-4 text-red-400" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
