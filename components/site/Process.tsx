"use client";
import { motion } from "framer-motion";
import { Section, SectionHead } from "./Section";

export default function Process({ data }: { data?: any }) {
  const steps: any[] = data?.steps ?? [];
  return (
    <Section className="border-t border-white/5">
      <SectionHead title={data?.title} />
      <ol className="relative mx-auto max-w-3xl">
        <div aria-hidden className="absolute right-5 top-0 h-full w-px bg-gradient-to-b from-electric via-violet-500 to-transparent" />
        {steps.map((s, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="relative flex gap-6 pb-10 pr-1"
          >
            <div className="glass relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-electric-400">
              {i + 1}
            </div>
            <div className="pt-1">
              <h3 className="display text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-slate-400">{s.text}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
