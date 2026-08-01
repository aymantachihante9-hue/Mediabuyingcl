"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Save, Eye, EyeOff, Loader2 } from "lucide-react";

const COLLECTIONS = [
  { api: "/api/testimonials", label: "آراء العملاء", blank: { name: "", company: "", quote: "", avatarUrl: "", audioUrl: "", visible: true } },
  { api: "/api/pricing", label: "الباقات", blank: { title: "", priceMad: 0, period: "شهرياً", products: "", features: [""], ctaText: "ابدأ الآن", ctaLink: "#contact", highlighted: false, badge: "", visible: true } },
  { api: "/api/faq", label: "الأسئلة الشائعة", blank: { question: "", answer: "", visible: true } },
  { api: "/api/services", label: "الخدمات", blank: { icon: "Zap", title: "", description: "", metric: "", visible: true } },
  { api: "/api/case-studies", label: "دراسات الحالة", blank: { title: "", niche: "", before: "", after: "", metricLabel: "", imageUrl: "", visible: true } },
];

export default function CollectionsPage() {
  const [tab, setTab] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const col = COLLECTIONS[tab];

  const load = () => fetch(col.api).then((r) => r.json()).then((d) => setItems(Array.isArray(d) ? d : []));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [tab]);

  const setField = (id: string, k: string, v: any) =>
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, [k]: v } : x)));

  const save = async (item: any) => {
    setSaving(item.id ?? "new");
    if (item.id) await fetch(col.api, { method: "PATCH", body: JSON.stringify(item) });
    else await fetch(col.api, { method: "POST", body: JSON.stringify(item) });
    setSaving(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("متأكد من الحذف؟")) return;
    await fetch(col.api, { method: "DELETE", body: JSON.stringify({ id }) });
    load();
  };

  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const reorder = [...items];
    [reorder[i], reorder[j]] = [reorder[j], reorder[i]];
    setItems(reorder);
    await fetch(col.api, {
      method: "PATCH",
      body: JSON.stringify({ reorder: reorder.map((x, idx) => ({ id: x.id, order: idx })) }),
    });
  };

  return (
    <div className="space-y-5">
      <h1 className="display text-2xl font-extrabold">عناصر المحتوى</h1>
      <div className="flex flex-wrap gap-2">
        {COLLECTIONS.map((c, i) => (
          <button key={c.api} onClick={() => setTab(i)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${i === tab ? "bg-electric text-white" : "glass text-slate-400"}`}>
            {c.label}
          </button>
        ))}
      </div>

      <button onClick={() => setItems((xs) => [{ ...col.blank, _new: true, id: "" }, ...xs])}
        className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10">
        <Plus className="h-4 w-4" /> إضافة عنصر جديد
      </button>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item.id || `new-${i}`} className="glass rounded-2xl p-4">
            <div className="grid gap-3 md:grid-cols-2">
              {Object.entries(item)
                .filter(([k]) => !["id", "order", "createdAt", "visible", "_new", "highlighted"].includes(k))
                .map(([k, v]) =>
                  Array.isArray(v) ? (
                    <label key={k} className="md:col-span-2">
                      <span className="mb-1 block text-xs text-slate-500">{k} (سطر لكل ميزة)</span>
                      <textarea rows={3} value={(v as string[]).join("\n")}
                        onChange={(e) => setField(item.id, k, e.target.value.split("\n"))}
                        className="w-full rounded-xl border border-white/10 bg-navy-900 px-3 py-2 text-sm outline-none focus:border-electric" />
                    </label>
                  ) : typeof v === "boolean" ? null : (
                    <label key={k}>
                      <span className="mb-1 block text-xs text-slate-500">{k}</span>
                      <input value={v as any ?? ""} type={typeof v === "number" ? "number" : "text"}
                        onChange={(e) => setField(item.id, k, typeof v === "number" ? +e.target.value : e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-navy-900 px-3 py-2 text-sm outline-none focus:border-electric" />
                    </label>
                  )
                )}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {"highlighted" in item && (
                <button onClick={() => setField(item.id, "highlighted", !item.highlighted)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold ${item.highlighted ? "bg-gold/20 text-gold-300" : "bg-white/5 text-slate-500"}`}>
                  ⭐ الباقة المميزة
                </button>
              )}
              <button onClick={() => setField(item.id, "visible", !item.visible)}
                className="glass rounded-xl p-2 text-slate-400" title="إظهار/إخفاء">
                {item.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              {item.id && (
                <>
                  <button onClick={() => move(i, -1)} className="glass rounded-xl p-2 text-slate-400"><ChevronUp className="h-4 w-4" /></button>
                  <button onClick={() => move(i, 1)} className="glass rounded-xl p-2 text-slate-400"><ChevronDown className="h-4 w-4" /></button>
                  <button onClick={() => del(item.id)} className="glass rounded-xl p-2 text-red-400"><Trash2 className="h-4 w-4" /></button>
                </>
              )}
              <button onClick={() => save(item)} disabled={saving === (item.id ?? "new")}
                className="mr-auto flex items-center gap-1.5 rounded-xl bg-electric px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
                {saving === (item.id ?? "new") ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} حفظ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
