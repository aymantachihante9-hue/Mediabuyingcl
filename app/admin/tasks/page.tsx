"use client";
import { useEffect, useState } from "react";
import { Plus, ChevronRight, ChevronLeft, Trash2 } from "lucide-react";

const COLS = [
  { key: "TODO", label: "للقيام به", color: "border-slate-500" },
  { key: "IN_PROGRESS", label: "قيد التنفيذ", color: "border-electric" },
  { key: "WAITING", label: "في الانتظار", color: "border-gold" },
  { key: "DONE", label: "منجز", color: "border-green-500" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const load = () => fetch("/api/tasks").then((r) => r.json()).then((d) => setTasks(Array.isArray(d) ? d : []));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!title.trim()) return;
    await fetch("/api/tasks", { method: "POST", body: JSON.stringify({ title }) });
    setTitle(""); load();
  };
  const moveTask = async (t: any, dir: -1 | 1) => {
    const i = COLS.findIndex((c) => c.key === t.status) + dir;
    if (i < 0 || i >= COLS.length) return;
    await fetch("/api/tasks", { method: "PATCH", body: JSON.stringify({ id: t.id, status: COLS[i].key }) });
    load();
  };
  const del = async (id: string) => { await fetch("/api/tasks", { method: "DELETE", body: JSON.stringify({ id }) }); load(); };

  return (
    <div className="space-y-5">
      <h1 className="display text-2xl font-extrabold">المهام</h1>
      <div className="glass flex gap-2 rounded-2xl p-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="مهمة جديدة..." className="flex-1 bg-transparent px-2 outline-none placeholder:text-slate-600" />
        <button onClick={add} className="flex items-center gap-1.5 rounded-xl bg-electric px-4 py-2 text-sm font-bold text-white"><Plus className="h-4 w-4" /> إضافة</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLS.map((c) => (
          <div key={c.key} className={`glass rounded-2xl border-t-2 p-3 ${c.color}`}>
            <h2 className="mb-3 px-1 text-sm font-bold text-slate-300">{c.label} <span className="text-slate-600">({tasks.filter((t) => t.status === c.key).length})</span></h2>
            <div className="space-y-2">
              {tasks.filter((t) => t.status === c.key).map((t) => (
                <div key={t.id} className="rounded-xl bg-navy-900/70 p-3 text-sm">
                  <div className="font-medium text-slate-200">{t.title}</div>
                  {t.priority === "high" && <span className="mt-1 inline-block rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] text-red-400">أولوية عالية</span>}
                  <div className="mt-2 flex items-center gap-1">
                    <button onClick={() => moveTask(t, 1)} className="rounded-lg bg-white/5 p-1.5 text-slate-400 hover:text-white" title="التالي"><ChevronLeft className="h-3.5 w-3.5" /></button>
                    <button onClick={() => moveTask(t, -1)} className="rounded-lg bg-white/5 p-1.5 text-slate-400 hover:text-white" title="السابق"><ChevronRight className="h-3.5 w-3.5" /></button>
                    <button onClick={() => del(t.id)} className="mr-auto rounded-lg bg-white/5 p-1.5 text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
