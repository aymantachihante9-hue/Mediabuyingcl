"use client";
import { useEffect, useState } from "react";
import { Plus, Zap, Unplug, Trash2, CircleCheck, CircleAlert } from "lucide-react";

const PLATFORMS = ["FACEBOOK", "TIKTOK", "GTM", "GA4", "META_CAPI", "SNAPCHAT", "LINKEDIN"];

export default function PixelsPage() {
  const [pixels, setPixels] = useState<any[]>([]);
  const [form, setForm] = useState({ platform: "FACEBOOK", pixelId: "", label: "" });
  const load = () => fetch("/api/pixels").then((r) => r.json()).then((d) => setPixels(Array.isArray(d) ? d : []));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.pixelId) return;
    await fetch("/api/pixels", { method: "POST", body: JSON.stringify(form) });
    setForm({ platform: "FACEBOOK", pixelId: "", label: "" });
    load();
  };
  const patch = async (id: string, body: any) => { await fetch("/api/pixels", { method: "PATCH", body: JSON.stringify({ id, ...body }) }); load(); };
  const del = async (id: string) => { if (confirm("حذف البيكسل؟")) { await fetch("/api/pixels", { method: "DELETE", body: JSON.stringify({ id }) }); load(); } };

  return (
    <div className="space-y-5">
      <h1 className="display text-2xl font-extrabold">إدارة البيكسلات</h1>

      <div className="glass flex flex-wrap items-end gap-3 rounded-2xl p-4">
        <label className="text-sm"><span className="mb-1 block text-xs text-slate-500">المنصة</span>
          <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}
            className="rounded-xl border border-white/10 bg-navy-900 px-3 py-2.5 outline-none [&>option]:bg-navy-900">
            {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </label>
        <label className="flex-1 text-sm"><span className="mb-1 block text-xs text-slate-500">Pixel ID</span>
          <input dir="ltr" value={form.pixelId} onChange={(e) => setForm({ ...form, pixelId: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-navy-900 px-3 py-2.5 outline-none focus:border-electric" />
        </label>
        <label className="text-sm"><span className="mb-1 block text-xs text-slate-500">وصف</span>
          <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })}
            className="rounded-xl border border-white/10 bg-navy-900 px-3 py-2.5 outline-none focus:border-electric" />
        </label>
        <button onClick={add} className="flex items-center gap-1.5 rounded-xl bg-electric px-4 py-2.5 text-sm font-bold text-white">
          <Plus className="h-4 w-4" /> إضافة
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {pixels.map((p) => (
          <div key={p.id} className="glass rounded-2xl p-5 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold">{p.platform} {p.label && <span className="text-sm text-slate-500">— {p.label}</span>}</div>
                <div dir="ltr" className="text-sm text-slate-500">{p.pixelId}</div>
              </div>
              {p.connected ? (
                <span className="flex items-center gap-1 rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-400"><CircleCheck className="h-3.5 w-3.5" /> متصل</span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-400"><CircleAlert className="h-3.5 w-3.5" /> غير متصل</span>
              )}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              {[["Purchase", p.purchases], ["ATC", p.addToCarts], ["Checkout", p.checkouts], ["ViewContent", p.viewContents], ["Lead", p.leadsCount], ["PageView", p.pageViews]].map(([k, v]) => (
                <div key={k as string} className="rounded-xl bg-navy-900/60 p-2">
                  <div className="font-bold text-slate-200">{v as number}</div>
                  <div className="text-slate-600">{k}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-slate-600">
              آخر حدث: {p.lastEventAt ? new Date(p.lastEventAt).toLocaleString("ar-MA") : "—"} · إجمالي: {p.eventsTotal}
              {p.errorState && <span className="text-red-400"> · ⚠️ {p.errorState}</span>}
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => patch(p.id, { testEvent: true })} className="flex items-center gap-1.5 rounded-xl bg-violet-600/20 px-3 py-2 text-xs font-semibold text-violet-400"><Zap className="h-3.5 w-3.5" /> اختبار حدث</button>
              <button onClick={() => patch(p.id, { connected: !p.connected })} className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-slate-400"><Unplug className="h-3.5 w-3.5" /> {p.connected ? "فصل" : "إعادة الاتصال"}</button>
              <button onClick={() => del(p.id)} className="mr-auto rounded-xl bg-red-500/10 p-2 text-red-400"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
