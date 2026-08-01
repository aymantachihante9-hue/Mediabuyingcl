import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Pin } from "lucide-react";

export const dynamic = "force-dynamic";

const badge: Record<string, string> = {
  PAID: "bg-green-500/15 text-green-400", PENDING: "bg-gold/15 text-gold-300", OVERDUE: "bg-red-500/15 text-red-400",
};

export default async function ClientsPage() {
  await requireAdmin("clients");
  const clients = await prisma.client.findMany({
    where: { archived: false },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    include: { assignedTo: { select: { name: true } } },
  });

  return (
    <div className="space-y-5">
      <h1 className="display text-2xl font-extrabold">العملاء</h1>
      {clients.length === 0 && (
        <div className="glass rounded-2xl p-14 text-center text-slate-500">
          لا يوجد عملاء بعد — حوّل أول عميل محتمل من صفحة العملاء المحتملين.
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {clients.map((c: any) => (
          <Link key={c.id} href={`/admin/clients/${c.id}`} className="glass rounded-2xl p-5 shadow-card transition hover:border-electric/40">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold">{c.businessName} {c.pinned && <Pin className="h-3.5 w-3.5 text-gold" />}</div>
                <div className="text-sm text-slate-500">{c.contactName}</div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${badge[c.paymentStatus]}`}>{c.paymentStatus}</span>
            </div>
            <dl className="mt-4 space-y-1 text-sm text-slate-400">
              <div>📦 الباقة: {c.packageName ?? "—"}</div>
              <div>🌍 {c.targetCountry ?? "—"} · 💰 {c.monthlyBudget ?? "—"}</div>
              <div>🧭 Onboarding: {c.onboardingStatus}</div>
              {c.performanceScore != null && <div>⚡ الأداء: {c.performanceScore}/100</div>}
            </dl>
          </Link>
        ))}
      </div>
    </div>
  );
}
