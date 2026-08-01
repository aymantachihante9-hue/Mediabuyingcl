"use client";
import { motion } from "framer-motion";
import { Quote, Play } from "lucide-react";
import { Section, SectionHead } from "./Section";

export default function Testimonials({ data, items }: { data?: any; items: any[] }) {
  return (
    <Section className="border-t border-white/5">
      <SectionHead title={data?.title} subtitle={data?.subtitle} />
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((t, i) => (
          <motion.figure
            key={t.id ?? i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass flex flex-col rounded-2xl p-6 shadow-card"
          >
            <Quote className="h-7 w-7 text-electric/50" />
            <blockquote className="mt-4 flex-1 leading-relaxed text-slate-300">{t.quote}</blockquote>
            {t.audioUrl && (
              <audio controls className="mt-4 w-full" preload="none">
                <source src={t.audioUrl} />
              </audio>
            )}
            <figcaption className="mt-5 flex items-center gap-3 border-t border-white/5 pt-4">
              {t.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.avatarUrl} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-electric to-violet-600 font-bold">
                  {t.name?.[0]}
                </div>
              )}
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-slate-500">{t.company}</div>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </Section>
  );
}
