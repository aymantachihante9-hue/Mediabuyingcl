# Earn Partner — Agency Platform

منصة كاملة لوكالة تسويق أداء: موقع عربي عالي التحويل + لوحة تحكم شاملة.
Next.js 14 (App Router) · TypeScript · TailwindCSS · Framer Motion · Prisma · PostgreSQL · Supabase Auth & Storage · Recharts · Zod · React Hook Form.

## البنية

```
app/
  (public)/            → الموقع العام (RTL عربي)
    page.tsx           → الصفحة الرئيسية — الأقسام تُقرأ من قاعدة البيانات
    thank-you/         → صفحة الشكر
  admin/               → لوحة التحكم (محمية بالكامل)
    page.tsx           → Dashboard: 11 KPI + 6 رسوم بيانية + قمع تحويل
    leads/             → إدارة العملاء المحتملين (حالات، واتساب، تحويل لعميل)
    clients/ [id]      → ملفات العملاء: ملاحظات، خط زمني، فواتير
    content/           → محرر الموقع: ترتيب/إخفاء الأقسام + تعديل كل نص وصورة
    content/collections→ الباقات، الآراء، الأسئلة، الخدمات، دراسات الحالة (CRUD كامل)
    media/             → مكتبة الوسائط (Supabase Storage)
    pixels/            → البيكسلات: إضافة، اختبار حدث، عدادات الأحداث
    ad-accounts/ campaigns/ reports/ tasks/ calendar/ finance/ settings/
  api/                 → REST endpoints (leads, content, pixels, upload, reports...)
components/site        → أقسام الموقع  ·  components/admin → مكونات اللوحة
lib/                   → prisma, auth (RBAC), notify (email/telegram), validators, crud
prisma/schema.prisma   → 25+ جدول  ·  prisma/seed.ts → المحتوى الافتراضي + بيانات تجريبية
middleware.ts          → حماية /admin على مستوى الـ edge
```

## التشغيل

1. **التبعيات**
   ```bash
   npm install
   cp .env.example .env   # عمّر القيم
   ```

2. **قاعدة البيانات** (Supabase أو أي Postgres)
   ```bash
   npm run db:push
   npm run db:seed        # المحتوى العربي الافتراضي + بيانات الرسوم
   ```

3. **حساب الأدمن**
   - أنشئ مستخدماً في Supabase → Authentication → Users (email + password).
   - اربطه بجدول `TeamMember` (مرة واحدة):
     ```sql
     INSERT INTO "TeamMember" (id, "supabaseId", name, email, role)
     VALUES ('tm_owner', '<SUPABASE_USER_UUID>', 'Ayman', 'you@mail.com', 'OWNER');
     ```
   - أنشئ bucket عام باسم `media` في Supabase Storage (لمكتبة الوسائط).

4. **التشغيل**
   ```bash
   npm run dev            # http://localhost:3000  ·  /admin/login
   ```

## الأتمتة الجاهزة
- استمارة → Lead تلقائياً + إشعار داخل اللوحة + مهمة متابعة عالية الأولوية
- إيميل عبر Resend وتيليغرام (اختياري — عمّر المفاتيح في .env)
- Google Sheets: انشر Google Apps Script كـ Web App وضع رابطه في `GOOGLE_SHEETS_WEBHOOK_URL`
- كشف التكرار (نفس الهاتف/الإيميل خلال 30 يوم) + تتبع المصدر (facebook/tiktok/ig/organic/direct)
- إشعار عند فصل أي Pixel

## الصلاحيات (RBAC)
OWNER و ADMIN: كل شيء · MEDIA_BUYER: leads/campaigns/pixels... · DESIGNER: media/content · COPYWRITER: content · ANALYST: reports/campaigns.
التحكم في `lib/auth.ts`.

## الأمان
Middleware يحمي `/admin` بالكامل · Zod على كل المدخلات · Rate limiting على الاستمارة · Honeypot ضد السبام · رؤوس أمان في next.config · حذف ناعم (أرشفة) · سجل إصدارات للمحتوى.

## النشر
Vercel + Supabase هو الأسهل: اربط الريبو، أضف متغيرات البيئة، ثم `db:push` و `db:seed` مرة واحدة.
لتوسيع rate limiting عبر عدة سيرفرات، استبدل `lib/rate-limit.ts` بـ Upstash Redis.

## ربط الإعلانات الحقيقية (خطوة لاحقة)
جداول `AdAccount` و `Campaign` و `DailyMetric` جاهزة. أضف cron (Vercel Cron) يسحب من Meta Marketing API / TikTok API ويحدّثها — كل الرسوم والتقارير ستعمل تلقائياً.
