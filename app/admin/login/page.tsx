"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2, Lock } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError("بيانات الدخول غير صحيحة");
    else router.push("/admin");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-950 px-4" dir="rtl">
      <form onSubmit={submit} className="glass w-full max-w-sm rounded-3xl p-8 text-slate-100 shadow-card">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-electric/15">
            <Lock className="h-5 w-5 text-electric" />
          </div>
          <div>
            <h1 className="display text-xl font-extrabold">لوحة التحكم</h1>
            <p className="text-sm text-slate-500">Earn Partner Admin</p>
          </div>
        </div>
        <label className="mb-4 block">
          <span className="mb-1.5 block text-sm text-slate-400">البريد الإلكتروني</span>
          <input type="email" dir="ltr" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-navy-900 px-4 py-3 outline-none focus:border-electric" />
        </label>
        <label className="mb-5 block">
          <span className="mb-1.5 block text-sm text-slate-400">كلمة المرور</span>
          <input type="password" dir="ltr" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-navy-900 px-4 py-3 outline-none focus:border-electric" />
        </label>
        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
        <button disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-electric py-3 font-bold text-white hover:bg-electric-600 disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} دخول
        </button>
      </form>
    </main>
  );
}
