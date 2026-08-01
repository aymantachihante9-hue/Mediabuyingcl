"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { leadSchema, type LeadInput } from "@/lib/validators";
import { Section, SectionHead } from "./Section";

const budgets = ["أقل من 5,000 درهم", "5,000 – 15,000 درهم", "15,000 – 30,000 درهم", "أكثر من 30,000 درهم"];
const dailyBudgets = ["100 – 300 درهم", "300 – 600 درهم", "600 – 1,000 درهم", "أكثر من 1,000 درهم"];
const platforms = ["Shopify", "YouCan", "WooCommerce", "Landing Page", "أخرى / لا يوجد متجر بعد"];

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-300">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-400">{error}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-navy-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-electric focus:ring-2 focus:ring-electric/30";

export default function LeadForm({ data }: { data?: any }) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({ resolver: zodResolver(leadSchema) });

  const onSubmit = async (values: LeadInput) => {
    setServerError("");
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      router.push("/thank-you");
    } else {
      const j = await res.json().catch(() => ({}));
      setServerError(j.error ?? "وقع خطأ، حاول مرة أخرى");
    }
  };

  return (
    <Section id="contact" className="border-t border-white/5">
      <SectionHead title={data?.title} subtitle={data?.subtitle} />
      {data?.urgency && (
        <p className="mx-auto -mt-8 mb-10 w-fit rounded-full border border-gold/30 bg-gold/10 px-5 py-2 text-sm font-semibold text-gold-300">
          🔥 {data.urgency}
        </p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="glass mx-auto max-w-3xl space-y-5 rounded-3xl p-6 shadow-card md:p-10"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="الاسم الكامل *" error={errors.fullName?.message}>
            <input {...register("fullName")} className={inputCls} placeholder="مثال: أيمن العلوي" />
          </Field>
          <Field label="رقم الهاتف *" error={errors.phone?.message}>
            <input {...register("phone")} dir="ltr" className={inputCls} placeholder="+212 6XX XXX XXX" />
          </Field>
          <Field label="البريد الإلكتروني *" error={errors.email?.message}>
            <input {...register("email")} dir="ltr" type="email" className={inputCls} placeholder="you@brand.com" />
          </Field>
          <Field label="اسم البراند *" error={errors.brandName?.message}>
            <input {...register("brandName")} className={inputCls} placeholder="اسم متجرك أو علامتك" />
          </Field>
          <Field label="رابط المتجر" error={errors.storeUrl?.message}>
            <input {...register("storeUrl")} dir="ltr" className={inputCls} placeholder="https://..." />
          </Field>
          <Field label="عدد المنتجات *" error={errors.productsCount?.message}>
            <input {...register("productsCount")} className={inputCls} placeholder="مثال: 3" />
          </Field>
          <Field label="الميزانية الشهرية *" error={errors.monthlyBudget?.message}>
            <select {...register("monthlyBudget")} className={inputCls} defaultValue="">
              <option value="" disabled>اختر...</option>
              {budgets.map((b) => <option key={b}>{b}</option>)}
            </select>
          </Field>
          <Field label="الميزانية الإعلانية اليومية *" error={errors.dailyAdBudget?.message}>
            <select {...register("dailyAdBudget")} className={inputCls} defaultValue="">
              <option value="" disabled>اختر...</option>
              {dailyBudgets.map((b) => <option key={b}>{b}</option>)}
            </select>
          </Field>
          <Field label="الدولة المستهدفة *" error={errors.targetCountry?.message}>
            <input {...register("targetCountry")} className={inputCls} placeholder="مثال: المغرب / السعودية" />
          </Field>
          <Field label="منصة المتجر *" error={errors.platform?.message}>
            <select {...register("platform")} className={inputCls} defaultValue="">
              <option value="" disabled>اختر...</option>
              {platforms.map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
        </div>

        <Field label="شنو المشكل الحالي اللي كتواجهه؟ *" error={errors.currentProblem?.message}>
          <textarea {...register("currentProblem")} rows={3} className={inputCls} placeholder="مثال: التكلفة طالعة والطلبيات غير مستقرة..." />
        </Field>
        <Field label="ملاحظات إضافية">
          <textarea {...register("notes")} rows={2} className={inputCls} />
        </Field>

        {/* honeypot — invisible to humans */}
        <input {...register("company")} tabIndex={-1} autoComplete="off" className="absolute -left-[9999px]" aria-hidden />

        {serverError && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-electric to-violet-600 py-4 text-lg font-bold text-white shadow-glow transition hover:scale-[1.01] disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          {isSubmitting ? "جاري الإرسال..." : "أرسل الطلب واحجز استشارتك المجانية"}
        </button>
        <p className="text-center text-xs text-slate-500">بياناتك محمية ولن تتم مشاركتها مع أي طرف ثالث.</p>
      </form>
    </Section>
  );
}
