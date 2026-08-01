"use client";
import { motion } from "framer-motion";
import { BadgeCheck, ArrowLeft } from "lucide-react";

export default function Hero({ data }: { data?: any }) {
  const d = data ?? {};
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 md:pb-28 md:pt-24">
      {/* ambient gradients */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-electric/20 blur-3xl" />
        <div className="absolute inset-0 bg-hero-grid [background-size:28px_28px] opacity-40" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {d.badge && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-300"
          >
            <BadgeCheck className="h-4 w-4 text-gold" />
            {d.badge}
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="display text-4xl font-black leading-tight md:text-6xl"
        >
          {d.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl"
        >
          {d.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href={d.ctaPrimary?.link ?? "#contact"}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-electric to-violet-600 px-8 py-4 text-lg font-bold text-white shadow-glow transition hover:scale-[1.02] sm:w-auto"
          >
            {d.ctaPrimary?.text ?? "احجز استشارة الآن"}
            <ArrowLeft className="h-5 w-5 transition group-hover:-translate-x-1" />
          </a>
          <a
            href={d.ctaSecondary?.link ?? "#results"}
            className="glass w-full rounded-2xl px-8 py-4 text-lg font-semibold text-slate-200 transition hover:bg-white/10 sm:w-auto"
          >
            {d.ctaSecondary?.text ?? "شوف النتائج"}
          </a>
        </motion.div>

        {/* stats cards */}
        {Array.isArray(d.stats) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36 }}
            className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            {d.stats.map((s: any, i: number) => (
              <div key={i} className="glass rounded-2xl p-5 text-center shadow-card">
                <div className="display text-3xl font-extrabold gradient-text">{s.value}</div>
                <div className="mt-1 text-sm text-slate-400">{s.label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
