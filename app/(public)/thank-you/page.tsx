import { CheckCircle2, MessageCircle, CalendarPlus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SETTINGS } from "@/lib/default-content";
import { waLink } from "@/lib/utils";

export const metadata = { title: "شكراً — Earn Partner", robots: { index: false } };

export default async function ThankYouPage() {
  let contact = DEFAULT_SETTINGS.contact;
  try {
    const row = await prisma.setting.findUnique({ where: { key: "contact" } });
    if (row) contact = row.value as any;
  } catch {}

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-950 px-4 text-slate-100">
      <div className="glass w-full max-w-lg rounded-3xl p-8 text-center shadow-card md:p-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/15">
          <CheckCircle2 className="h-10 w-10 text-green-400" />
        </div>
        <h1 className="display text-3xl font-extrabold">توصلنا بطلبك ✅</h1>
        <p className="mt-4 leading-relaxed text-slate-400">
          شكراً على ثقتك. فريقنا غادي يتواصل معاك <strong className="text-slate-200">خلال أقل من 24 ساعة</strong> باش
          نحددو موعد الاستشارة المجانية.
        </p>

        <div className="mt-8 space-y-3 text-right">
          <div className="rounded-2xl bg-navy-900/60 p-4 text-sm text-slate-300">
            <div className="font-bold text-slate-200">الخطوات الجاية:</div>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-slate-400">
              <li>مكالمة تعارف قصيرة (15 دقيقة)</li>
              <li>تحليل مجاني للمتجر والحسابات الإعلانية</li>
              <li>خطة عمل واضحة بالأرقام</li>
            </ol>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <a
            href={waLink(contact.whatsapp, "سلام، عمرت الفورم فالموقع وبغيت نسرع الموعد 🚀")}
            target="_blank"
            className="flex items-center justify-center gap-2 rounded-2xl bg-green-600 py-3.5 font-bold text-white transition hover:bg-green-500"
          >
            <MessageCircle className="h-5 w-5" /> تواصل معنا مباشرة على واتساب
          </a>
          <Link
            href="/"
            className="glass flex items-center justify-center gap-2 rounded-2xl py-3.5 font-semibold text-slate-300 hover:bg-white/10"
          >
            الرجوع للموقع <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
