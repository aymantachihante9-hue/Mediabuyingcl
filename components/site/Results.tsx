"use client";
import { motion } from "framer-motion";
import { ArrowUpLeft } from "lucide-react";
import { Section, SectionHead } from "./Section";

export default function Results({ data, items }: { data?: any; items: any[] }) {
  return (
    <Section id="results" className="border-t border-white/5">
      <SectionHead title={data?.title} subtitle={data?.subtitle} />
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((c, i) => (
          <motion.article
            key={c.id ?? i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass overflow-hidden rounded-2xl shadow-card"
          >
            {c.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.imageUrl} alt={c.title} className="h-40 w-full object-cover" />
            )}
            <div className="p-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{c.niche}</div>
              <h3 className="display mt-1 text-lg font-bold">{c.title}</h3>
              <div className="mt-5 flex items-center justify-between rounded-xl bg-navy-900/60 p-4">
                <div className="text-center">
                  <div className="text-xs text-slate-500">قبل</div>
                  <div className="mt-1 font-bold text-slate-300">{c.before}</div>
                </div>
                <ArrowUpLeft className="h-6 w-6 text-electric" />
                <div className="text-center">
                  <div className="text-xs text-slate-500">بعد</div>
                  <div className="mt-1 font-bold text-gold-300">{c.after}</div>
                </div>
              </div>
              <div className="mt-3 text-center text-xs text-slate-500">{c.metricLabel}</div>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
