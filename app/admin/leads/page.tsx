"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Phone, Mail, MessageCircle, Archive, UserCheck, Search, Loader2, AlertTriangle, ChevronDown,
} from "lucide-react";
import { waLink } from "@/lib/utils";

const STATUS: Record<string, { label: string; cls: string }> = {
  NEW: { label: "جديد", cls: "bg-electric/15 text-electric-400" },
  CONTACTED: { label: "تم التواصل", cls: "bg-violet-500/15 text-violet-400" },
  MEETING_BOOKED: { label: "اجتماع محجوز", cls: "bg-gold/15 text-gold-300" },
  WON: { label: "عميل ✅", cls: "bg-green-500/15 text-green-400" },
  LOST: { label: "خسر", cls: "bg-red-500/15 text-red-400" },
  ARCHIVED: { label: "مؤرشف", cls: "bg-white/5 text-slate-500" },
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = () =>
    fetch("/api/leads").then((r) => r.json()).then((d) => { setLeads(Array.isArray(d) ? d : []); setLoading(false); });
  useEffect(() => { load(); }, []);

  const update = async (id: string, data: any) => {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, ...data } : l)));
    await fetch(`/api/leads/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  };

  const convert = async (id: string) => {
    await fetch(`/api/leads/${id}/convert`, { method: "POST" });
    load();
  };

  const filtered = useMemo(
    () =>
      leads.filter(
        (l) =>
          (!filter || l.status === filter) &&
          (!q || [l.fullName, l.brandName, l.phone, l.email].join(" ").toLowerCase().includes(q.toLowerCase()))
      ),
    [leads, q, filter]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="display text-2xl font-extrabold">العملاء المحتملون</h1>
        <div className="flex flex-wrap gap-2">
          <div className="glass flex items-center gap-2 rounded-xl px-3 py-2">
            <Search className="h-4 w-4 text-slate-500" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث..."
              className="w-40 bg-transparent text-sm outline-none placeholder:text-slate-600" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            className="glass rounded-xl bg-transparent px-3 py-2 text-sm outline-none [&>option]:bg-navy-900">
            <option value="">كل الحالات</option>
            {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="glass h-16 animate-pulse rounded-2xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-2xl p-14 text-center text-slate-500">
          لا يوجد عملاء محتملون بعد. أول استمارة من الموقع غادي تبان هنا فوراً.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((l) => (
            <div key={l.id} className="glass rounded-2xl shadow-card">
              <button onClick={() => setOpenId(openId === l.id ? null : l.id)}
                className="flex w-full flex-wrap items-center gap-3 p-4 text-right">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-electric to-violet-600 font-bold">
                  {l.fullName?.[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 font-bold">
                    {l.fullName}
                    {l.isDuplicate && (
                      <span title="مكرر" className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-400">
                        <AlertTriangle className="h-3 w-3" /> مكرر
                      </span>
                    )}
                  </div>
                  <div className="truncate text-sm text-slate-500">{l.brandName} · {l.targetCountry} · {l.monthlyBudget}</div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS[l.status]?.cls}`}>
                  {STATUS[l.status]?.label}
                </span>
                <span className="hidden text-xs text-slate-600 md:block">
                  {new Date(l.createdAt).toLocaleDateString("ar-MA")}
                </span>
                <ChevronDown className={`h-4 w-4 text-slate-500 transition ${openId === l.id ? "rotate-180" : ""}`} />
              </button>

              {openId === l.id && (
                <div className="border-t border-white/5 p-4">
                  <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      ["الهاتف", l.phone], ["البريد", l.email], ["المتجر", l.storeUrl ?? "—"],
                      ["الميزانية اليومية", l.dailyAdBudget], ["عدد المنتجات", l.productsCount],
                      ["المنصة", l.platform], ["المصدر", l.source],
                    ].map(([k, v]) => (
                      <div key={k as string}><dt className="inline text-slate-500">{k}: </dt><dd className="inline text-slate-200" dir="auto">{v}</dd></div>
                    ))}
                  </dl>
                  <p className="mt-3 rounded-xl bg-navy-900/60 p-3 text-sm text-slate-300">
                    <span className="text-slate-500">المشكل الحالي: </span>{l.currentProblem}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <a href={`tel:${l.phone}`} className="btn-quick bg-electric/15 text-electric-400"><Phone className="h-4 w-4" /> اتصال</a>
                    <a href={waLink(l.phone, `سلام ${l.fullName}، معك فريق Earn Partner بخصوص طلبك 👋`)} target="_blank"
                      className="btn-quick bg-green-500/15 text-green-400"><MessageCircle className="h-4 w-4" /> واتساب</a>
                    <a href={`mailto:${l.email}`} className="btn-quick bg-violet-500/15 text-violet-400"><Mail className="h-4 w-4" /> إيميل</a>
                    <span className="mx-2 hidden w-px bg-white/10 sm:block" />
                    {["NEW", "CONTACTED", "MEETING_BOOKED", "LOST"].map((s) => (
                      <button key={s} onClick={() => update(l.id, { status: s })}
                        className={`btn-quick ${l.status === s ? STATUS[s].cls : "bg-white/5 text-slate-400 hover:text-slate-200"}`}>
                        {STATUS[s].label}
                      </button>
                    ))}
                    <button onClick={() => convert(l.id)} className="btn-quick bg-green-600 text-white hover:bg-green-500">
                      <UserCheck className="h-4 w-4" /> تحويل لعميل
                    </button>
                    <button onClick={() => update(l.id, { status: "ARCHIVED" })} className="btn-quick bg-white/5 text-slate-500">
                      <Archive className="h-4 w-4" /> أرشفة
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <style jsx global>{`
        .btn-quick { display: inline-flex; align-items: center; gap: 6px; border-radius: 12px; padding: 8px 12px; font-size: 13px; font-weight: 600; transition: opacity .15s; }
        .btn-quick:hover { opacity: .85; }
      `}</style>
    </div>
  );
}
