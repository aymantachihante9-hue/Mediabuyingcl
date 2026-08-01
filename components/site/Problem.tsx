"use client";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Section, SectionHead } from "./Section";
import { CheckCircle2 } from "lucide-react";

export default function Problem({ data }: { data?: any }) {
  const d = data ?? {};
  return (
    <Section className="border-t border-white/5">
      <SectionHead title={d.title} subtitle={d.subtitle} />
      <div className="grid gap-6 md:grid-cols-3">
        {(d.problems ?? []).map((p: any, i: number) => {
          const Icon = (Icons as any)[p.icon] ?? Icons.AlertTriangle;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6 shadow-card"
            >
              <div className="mb-4 inline-flex rounded-xl bg-red-500/10 p-3 text-red-400">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="display text-lg font-bold">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-slate-400">{p.text}</p>
            </motion.div>
          );
        })}
      </div>
      {d.solutionTitle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 rounded-3xl border border-electric/30 bg-gradient-to-l from-electric/10 to-violet-600/10 p-8 md:p-10"
        >
          <div className="flex items-start gap-4">
            <CheckCircle2 className="mt-1 h-8 w-8 shrink-0 text-electric" />
            <div>
              <h3 className="display text-2xl font-extrabold">{d.solutionTitle}</h3>
              <p className="mt-3 text-lg leading-relaxed text-slate-300">{d.solutionText}</p>
            </div>
          </div>
        </motion.div>
      )}
    </Section>
  );
}
