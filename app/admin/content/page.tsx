"use client";
import { useEffect, useState } from "react";
import { Eye, EyeOff, ChevronUp, ChevronDown, Save, Loader2, PenSquare, X, ImagePlus } from "lucide-react";

// Recursive editor: renders inputs for every string field in a section's JSON,
// including nested objects and arrays (stats, steps, CTAs, social links...).
function FieldEditor({
  value,
  path,
  onChange,
}: {
  value: any;
  path: string[];
  onChange: (path: string[], v: any) => void;
}) {
  if (typeof value === "string") {
    const key = path[path.length - 1];
    const isImage = /image|avatar|logo|og/i.test(key) || /Url$/.test(key);
    const long = value.length > 60 || /subtitle|text|about|answer/i.test(key);
    return (
      <label className="block">
        <span className="mb-1 flex items-center gap-1.5 text-xs text-slate-500">
          {isImage && <ImagePlus className="h-3 w-3" />} {key}
        </span>
        {long ? (
          <textarea rows={2} value={value} onChange={(e) => onChange(path, e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-navy-900 px-3 py-2 text-sm outline-none focus:border-electric" />
        ) : (
          <input value={value} onChange={(e) => onChange(path, e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-navy-900 px-3 py-2 text-sm outline-none focus:border-electric" />
        )}
      </label>
    );
  }
  if (Array.isArray(value)) {
    return (
      <div className="space-y-3">
        {value.map((item, i) => (
          <div key={i} className="rounded-xl border border-white/5 bg-white/[.02] p-3">
            <div className="mb-2 text-xs font-bold text-slate-400">{path[path.length - 1]} #{i + 1}</div>
            <FieldEditor value={item} path={[...path, String(i)]} onChange={onChange} />
          </div>
        ))}
      </div>
    );
  }
  if (value && typeof value === "object") {
    return (
      <div className="space-y-3">
        {Object.entries(value).map(([k, v]) => (
          <FieldEditor key={k} value={v} path={[...path, k]} onChange={onChange} />
        ))}
      </div>
    );
  }
  return null;
}

function setDeep(obj: any, path: string[], v: any): any {
  if (path.length === 0) return v;
  const [head, ...rest] = path;
  if (Array.isArray(obj)) {
    const copy = [...obj];
    copy[Number(head)] = setDeep(obj[Number(head)], rest, v);
    return copy;
  }
  return { ...obj, [head]: setDeep(obj?.[head], rest, v) };
}

export default function ContentPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [draft, setDraft] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const load = () => fetch("/api/content").then((r) => r.json()).then(setSections);
  useEffect(() => { load(); }, []);

  const patch = async (key: string, body: any) => {
    await fetch(`/api/content/${key}`, { method: "PATCH", body: JSON.stringify(body) });
    load();
  };

  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    const a = sections[i], b = sections[j];
    setSections((s) => { const c = [...s]; [c[i], c[j]] = [c[j], c[i]]; return c; });
    await Promise.all([
      patch(a.key, { order: b.order, label: a.label, visible: a.visible }),
      patch(b.key, { order: a.order, label: b.label, visible: b.visible }),
    ]);
  };

  const save = async () => {
    setSaving(true);
    await patch(editing.key, { data: draft, label: editing.label, order: editing.order, visible: editing.visible });
    setSaving(false);
    setEditing(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="display text-2xl font-extrabold">محتوى الموقع</h1>
        <p className="mt-1 text-sm text-slate-500">
          عدّل أي نص أو صورة أو زر، رتّب الأقسام، وأخفِ ما تريد — التغييرات تظهر في الموقع خلال دقيقة.
        </p>
        <a href="/admin/content/collections" className="mt-3 inline-block rounded-xl bg-violet-600/20 px-4 py-2 text-sm font-semibold text-violet-400 hover:bg-violet-600/30">
          إدارة العناصر: الباقات · الآراء · الأسئلة · الخدمات · دراسات الحالة ←
        </a>
      </div>

      <div className="space-y-2">
        {sections.map((s, i) => (
          <div key={s.key} className={`glass flex items-center gap-3 rounded-2xl p-4 ${!s.visible ? "opacity-50" : ""}`}>
            <div className="flex flex-col">
              <button onClick={() => move(i, -1)} className="text-slate-500 hover:text-white" aria-label="فوق"><ChevronUp className="h-4 w-4" /></button>
              <button onClick={() => move(i, 1)} className="text-slate-500 hover:text-white" aria-label="تحت"><ChevronDown className="h-4 w-4" /></button>
            </div>
            <div className="flex-1">
              <div className="font-bold">{s.label}</div>
              <div className="text-xs text-slate-600">{s.key}</div>
            </div>
            <button onClick={() => patch(s.key, { visible: !s.visible, label: s.label, order: s.order })}
              className="glass rounded-xl p-2.5 text-slate-400 hover:text-white" title={s.visible ? "إخفاء" : "إظهار"}>
              {s.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
            <button onClick={() => { setEditing(s); setDraft(s.data); }}
              className="flex items-center gap-1.5 rounded-xl bg-electric/15 px-4 py-2.5 text-sm font-semibold text-electric-400 hover:bg-electric/25">
              <PenSquare className="h-4 w-4" /> تعديل
            </button>
          </div>
        ))}
      </div>

      {/* Editor drawer */}
      {editing && (
        <div className="fixed inset-0 z-50 flex justify-start bg-black/60" onClick={() => setEditing(null)}>
          <div dir="rtl" onClick={(e) => e.stopPropagation()}
            className="h-full w-full max-w-lg overflow-y-auto border-l border-white/10 bg-navy-900 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="display text-lg font-extrabold">تعديل: {editing.label}</h2>
              <button onClick={() => setEditing(null)} className="glass rounded-xl p-2 text-slate-400"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4">
              <FieldEditor value={draft} path={[]} onChange={(p, v) => setDraft((d: any) => setDeep(d, p, v))} />
            </div>
            <button onClick={save} disabled={saving}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-electric py-3 font-bold text-white hover:bg-electric-600 disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} حفظ التغييرات
            </button>
            <p className="mt-3 text-center text-xs text-slate-600">يتم حفظ نسخة من المحتوى القديم تلقائياً (سجل الإصدارات)</p>
          </div>
        </div>
      )}
    </div>
  );
}
