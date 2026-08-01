import { z } from "zod";

export const leadSchema = z.object({
  fullName: z.string().min(3, "الاسم الكامل مطلوب"),
  phone: z
    .string()
    .regex(/^(\+?212|0)[5-7][0-9]{8}$|^\+?[0-9]{8,15}$/, "رقم الهاتف غير صحيح"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  brandName: z.string().min(2, "اسم البراند مطلوب"),
  storeUrl: z.string().url("رابط غير صحيح").or(z.literal("")).optional(),
  monthlyBudget: z.string().min(1, "اختر الميزانية الشهرية"),
  dailyAdBudget: z.string().min(1, "اختر الميزانية اليومية"),
  productsCount: z.string().min(1, "عدد المنتجات مطلوب"),
  targetCountry: z.string().min(2, "الدولة المستهدفة مطلوبة"),
  platform: z.string().min(1, "اختر المنصة"),
  currentProblem: z.string().min(5, "صف المشكل الحالي باختصار"),
  notes: z.string().optional(),
  // honeypot anti-spam — must stay empty
  company: z.string().max(0).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
