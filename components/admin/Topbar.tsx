"use client";
import { useEffect, useState } from "react";
import { Bell, Search, LogOut, ExternalLink } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Topbar({ userName }: { userName: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<{ items: any[]; unread: number }>({ items: [], unread: 0 });

  const load = () => fetch("/api/notifications").then((r) => r.json()).then(setNotifs).catch(() => {});
  useEffect(() => {
    load();
    const t = setInterval(load, 30_000); // near-real-time polling
    return () => clearInterval(t);
  }, []);

  const markAll = async () => {
    await fetch("/api/notifications", { method: "PATCH", body: JSON.stringify({ all: true }) });
    load();
  };

  const logout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/5 bg-navy-950/80 px-4 backdrop-blur-xl lg:pr-64">
      <div className="glass hidden flex-1 items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-500 md:flex md:max-w-md">
        <Search className="h-4 w-4" /> بحث سريع...
      </div>
      <div className="mr-auto flex items-center gap-3">
        <Link href="/" target="_blank" className="glass hidden items-center gap-1.5 rounded-xl px-3 py-2 text-xs text-slate-400 hover:text-white sm:flex">
          <ExternalLink className="h-3.5 w-3.5" /> عرض الموقع
        </Link>
        <div className="relative">
          <button onClick={() => setOpen(!open)} className="glass relative rounded-xl p-2.5 text-slate-300 hover:text-white">
            <Bell className="h-4 w-4" />
            {notifs.unread > 0 && (
              <span className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {notifs.unread}
              </span>
            )}
          </button>
          {open && (
            <div className="absolute left-0 mt-2 w-80 rounded-2xl border border-white/10 bg-navy-900 p-2 shadow-card">
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-sm font-bold text-slate-200">الإشعارات</span>
                <button onClick={markAll} className="text-xs text-electric hover:underline">قراءة الكل</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifs.items.length === 0 && <p className="p-4 text-center text-sm text-slate-500">لا توجد إشعارات</p>}
                {notifs.items.map((n) => (
                  <Link key={n.id} href={n.link ?? "#"} onClick={() => setOpen(false)}
                    className={`block rounded-xl px-3 py-2.5 text-sm hover:bg-white/5 ${n.read ? "text-slate-500" : "text-slate-200"}`}>
                    <div className="font-medium">{n.title}</div>
                    {n.body && <div className="mt-0.5 text-xs text-slate-500">{n.body}</div>}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <span className="hidden text-sm text-slate-400 sm:block">{userName}</span>
        <button onClick={logout} className="glass rounded-xl p-2.5 text-slate-400 hover:text-red-400" title="خروج">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
