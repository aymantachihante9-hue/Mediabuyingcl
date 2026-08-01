"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Section, SectionHead } from "./Section";

export default function Faq({ data, items }: { data?: any; items: any[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" className="border-t border-white/5">
      <SectionHead title={data?.title} />
      <div className="mx-auto max-w-3xl space-y-3">
        {items.map((f, i) => (
          <div key={f.id ?? i} className="glass overflow-hidden rounded-2xl">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="flex w-full items-center justify-between gap-4 p-5 text-right font-semibold"
            >
              {f.question}
              <ChevronDown className={`h-5 w-5 shrink-0 text-slate-500 transition ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && (
              <div className="border-t border-white/5 p-5 pt-4 leading-relaxed text-slate-400">{f.answer}</div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
