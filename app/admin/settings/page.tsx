"use client";
import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";

const GROUPS: { key: string; label: string }[] = [
  { key: "company", label: "الشركة" },
  { key: "seo", label: "SEO والميتاداتا" },
  { key: "contact", label: "التواصل والواتساب" },
  { key: "theme", label: "الألوان والمظهر" },
  { key: "locale", label: "اللغة والتوقيت" },
  { key: "analytics", label: "معرفات التتبع (Pixels / GA4)" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, any> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetch("/api/settings").then((r) => r.json()).then(setSettings); }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/settings", { method: "PATCH", body: JSON.stringify(settings) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  if (!settings) return <div className="glass h-64 animate-pulse rounded-2xl" />;

  return (
    <div className="max-w-3xl space-y-5">
      <h1 className="display text-2xl font-extrabold">الإعدادات</h1>
      {GROUPS.map((g) => (
        <div key={g.key} className="glass rounded-2xl p-5 shadow-card">
          <h2 className="mb-4 font-bold">{g.label}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(settings[g.key] ?? {}).map(([k, v]) => (
              <label key={k} className={typeof v === "string" && v.length > 60 ? "sm:col-span-2" : ""}>
                <span className="mb-1 block text-xs text-slate-500">{k}</span>
                <input value={v as string} dir="auto"
                  onChange={(e) => setSettings((s) => ({ ...s!, [g.key]: { ...s![g.key], [k]: e.target.value } }))}
                  className="w-full rounded-xl border border-white/10 bg-navy-900 px-3 py-2.5 text-sm outline-none focus:border-electric" />
              </label>
            ))}
          </div>
        </div>
      ))}
      <button onClick={save} disabled={saving}
        className="flex items-center gap-2 rounded-2xl bg-electric px-6 py-3 font-bold text-white hover:bg-electric-600 disabled:opacity-60">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {saved ? "تم الحفظ ✓" : "حفظ كل الإعدادات"}
      </button>
    </div>
  );
}
