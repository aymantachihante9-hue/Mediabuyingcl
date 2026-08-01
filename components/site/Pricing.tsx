"use client";
import { motion } from "framer-motion";
import { Check, Flame } from "lucide-react";
import { Section, SectionHead } from "./Section";

export default function Pricing({ data, items }: { data?: any; items: any[] }) {
  return (
    <Section id="pricing" className="border-t border-white/5">
      <SectionHead title={data?.title} subtitle={data?.subtitle} />
      <div className="grid items-stretch gap-6 md:grid-cols-3">
        {items.map((p, i) => (
          <motion.div
            key={p.id ?? i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`relative flex flex-col rounded-3xl p-7 shadow-card ${
              p.highlighted
                ? "border-2 border-electric bg-gradient-to-b from-electric/10 to-violet-600/10"
                : "glass"
            }`}
          >
            {p.badge && (
              <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy-950">
                <Flame className="h-3.5 w-3.5" /> {p.badge}
              </span>
            )}
            <h3 className="display text-xl font-extrabold">{p.title}</h3>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="display text-4xl font-black">{p.priceMad?.toLocaleString("fr-MA")}</span>
              <span className="text-slate-400">درهم / {p.period}</span>
            </div>
            <div className="mt-1 text-sm text-slate-500">{p.products}</div>
            <ul className="mt-6 flex-1 space-y-3">
              {(Array.isArray(p.features) ? p.features : []).map((f: string, j: number) => (
                <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-electric-400" /> {f}
                </li>
              ))}
            </ul>
            <a
              href={p.ctaLink ?? "#contact"}
              className={`mt-8 rounded-2xl py-3.5 text-center font-bold transition ${
                p.highlighted
                  ? "bg-gradient-to-l from-electric to-violet-600 text-white shadow-glow hover:scale-[1.02]"
                  : "glass hover:bg-white/10"
              }`}
            >
              {p.ctaText}
            </a>
          </motion.div>
        ))}
      </div>
      {data?.note && (
        <p className="mt-8 text-center text-sm font-medium text-gold-300">⚡ {data.note}</p>
      )}
    </Section>
  );
}
