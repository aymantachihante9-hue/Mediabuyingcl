"use client";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Section, SectionHead } from "./Section";

export default function Services({ data, items }: { data?: any; items: any[] }) {
  return (
    <Section id="services" className="border-t border-white/5">
      <SectionHead title={data?.title} subtitle={data?.subtitle} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s, i) => {
          const Icon = (Icons as any)[s.icon] ?? Icons.Zap;
          return (
            <motion.div
              key={s.id ?? i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.06 }}
              className="glass group rounded-2xl p-6 shadow-card transition hover:border-electric/40"
            >
              <div className="mb-4 inline-flex rounded-xl bg-electric/10 p-3 text-electric-400 transition group-hover:bg-electric/20">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="display text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.description}</p>
              {s.metric && (
                <span className="mt-4 inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-300">
                  {s.metric}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
