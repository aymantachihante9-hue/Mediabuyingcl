import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { waLink } from "@/lib/utils";
import { Phone, MessageCircle, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClientDetail({ params }: { params: { id: string } }) {
  await requireAdmin("clients");
  const c = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      notes: { orderBy: { createdAt: "desc" } },
      activities: { orderBy: { createdAt: "desc" }, take: 20 },
      invoices: { orderBy: { createdAt: "desc" } },
      campaigns: true,
      pixels: true,
      assignedTo: true,
    },
  });
  if (!c) notFound();

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="display text-2xl font-extrabold">{c.businessName}</h1>
            <p className="text-slate-500">{c.contactName} · {c.email}</p>
          </div>
          <div className="flex gap-2">
            <a href={`tel:${c.phone}`} className="glass rounded-xl p-2.5 text-electric-400"><Phone className="h-4 w-4" /></a>
            <a href={waLink(c.phone)} target="_blank" className="glass rounded-xl p-2.5 text-green-400"><MessageCircle className="h-4 w-4" /></a>
            <a href={`mailto:${c.email}`} className="glass rounded-xl p-2.5 text-violet-400"><Mail className="h-4 w-4" /></a>
          </div>
        </div>
        <dl className="mt-5 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["المتجر", c.storeUrl ?? "—"], ["الدولة", c.targetCountry ?? "—"], ["الميزانية", c.monthlyBudget ?? "—"],
            ["الباقة", c.packageName ?? "—"], ["Onboarding", c.onboardingStatus], ["الدفع", c.paymentStatus],
            ["العقد", c.contractDetails ?? "—"], ["المسؤول", c.assignedTo?.name ?? "—"],
          ].map(([k, v]) => (
            <div key={k as string}><dt className="inline text-slate-500">{k}: </dt><dd className="inline text-slate-200">{v}</dd></div>
          ))}
        </dl>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5 shadow-card">
          <h2 className="mb-3 font-bold">📝 الملاحظات</h2>
          {c.notes.length === 0 && <p className="text-sm text-slate-500">لا توجد ملاحظات.</p>}
          <ul className="space-y-2">
            {c.notes.map((n: any) => (
              <li key={n.id} className="rounded-xl bg-navy-900/60 p-3 text-sm">
                <span className="ml-2 rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-slate-500">{n.category}</span>
                {n.content}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-5 shadow-card">
          <h2 className="mb-3 font-bold">🕓 الخط الزمني</h2>
          {c.activities.length === 0 && <p className="text-sm text-slate-500">لا يوجد نشاط.</p>}
          <ul className="space-y-2 text-sm">
            {c.activities.map((a: any) => (
              <li key={a.id} className="flex justify-between gap-3">
                <span className="text-slate-300">{a.message}</span>
                <span className="shrink-0 text-xs text-slate-600">{format(a.createdAt, "dd/MM HH:mm")}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-5 shadow-card lg:col-span-2">
          <h2 className="mb-3 font-bold">💳 الفواتير</h2>
          {c.invoices.length === 0 ? <p className="text-sm text-slate-500">لا توجد فواتير.</p> : (
            <table className="w-full text-sm">
              <thead className="text-right text-xs text-slate-500"><tr><th className="py-2">رقم</th><th>المبلغ</th><th>الحالة</th><th>الاستحقاق</th></tr></thead>
              <tbody className="divide-y divide-white/5">
                {c.invoices.map((inv: any) => (
                  <tr key={inv.id}>
                    <td className="py-2">{inv.number}</td>
                    <td>{inv.amountMad.toLocaleString("fr-MA")} د.م</td>
                    <td>{inv.status}</td>
                    <td>{format(inv.dueDate, "dd/MM/yyyy")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
