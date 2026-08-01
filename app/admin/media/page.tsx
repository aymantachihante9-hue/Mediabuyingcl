"use client";
import { useEffect, useRef, useState } from "react";
import { Upload, Trash2, Copy, Loader2, FileText, Music, Video, Image as Img } from "lucide-react";

const icons: Record<string, any> = { image: Img, video: Video, audio: Music, pdf: FileText };

export default function MediaPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [cat, setCat] = useState("general");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => fetch("/api/upload").then((r) => r.json()).then((d) => setAssets(Array.isArray(d) ? d : []));
  useEffect(() => { load(); }, []);

  const upload = async (f: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", f); fd.append("category", cat);
    await fetch("/api/upload", { method: "POST", body: fd });
    setUploading(false); load();
  };
  const del = async (id: string) => { if (confirm("حذف الملف؟")) { await fetch("/api/upload", { method: "DELETE", body: JSON.stringify({ id }) }); load(); } };

  return (
    <div className="space-y-5">
      <h1 className="display text-2xl font-extrabold">مكتبة الوسائط</h1>
      <div className="glass flex flex-wrap items-center gap-3 rounded-2xl p-4">
        <select value={cat} onChange={(e) => setCat(e.target.value)}
          className="rounded-xl border border-white/10 bg-navy-900 px-3 py-2.5 text-sm outline-none [&>option]:bg-navy-900">
          {["general", "logos", "creatives", "screenshots", "contracts", "testimonials-audio", "icons"].map((c) => <option key={c}>{c}</option>)}
        </select>
        <input ref={fileRef} type="file" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          className="flex items-center gap-2 rounded-xl bg-electric px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} رفع ملف
        </button>
        <span className="text-xs text-slate-600">حتى 25MB — صور، فيديو، صوت، PDF</span>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {assets.map((a) => {
          const Icon = icons[a.type] ?? FileText;
          return (
            <div key={a.id} className="glass group overflow-hidden rounded-2xl">
              {a.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.url} alt={a.name} className="h-28 w-full object-cover" />
              ) : (
                <div className="flex h-28 items-center justify-center bg-navy-900/60"><Icon className="h-8 w-8 text-slate-600" /></div>
              )}
              <div className="p-3">
                <div className="truncate text-xs font-medium">{a.name}</div>
                <div className="text-[10px] text-slate-600">{a.category}</div>
                <div className="mt-2 flex gap-1.5">
                  <button onClick={() => navigator.clipboard.writeText(a.url)} className="rounded-lg bg-white/5 p-1.5 text-slate-400 hover:text-white" title="نسخ الرابط"><Copy className="h-3.5 w-3.5" /></button>
                  <button onClick={() => del(a.id)} className="rounded-lg bg-white/5 p-1.5 text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {assets.length === 0 && <div className="glass rounded-2xl p-14 text-center text-slate-500">المكتبة فارغة — ارفع أول ملف.</div>}
    </div>
  );
}
