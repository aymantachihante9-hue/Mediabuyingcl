"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { waLink } from "@/lib/utils";

const links = [
  { href: "#services", label: "الخدمات" },
  { href: "#results", label: "النتائج" },
  { href: "#pricing", label: "الباقات" },
  { href: "#faq", label: "الأسئلة" },
];

export default function Navbar({ data }: { data?: any }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-navy-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="display text-xl font-extrabold">
          Earn<span className="text-electric">Partner</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-white">{l.label}</a>
          ))}
        </nav>
        <div className="hidden md:block">
          <a
            href="#contact"
            className="rounded-xl bg-electric px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-electric-600"
          >
            احجز استشارة
          </a>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="القائمة">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-white/5 px-4 py-4 md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-3 text-slate-200">
              {l.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="mt-2 block rounded-xl bg-electric px-5 py-3 text-center font-semibold">
            احجز استشارة الآن
          </a>
        </nav>
      )}
    </header>
  );
}
