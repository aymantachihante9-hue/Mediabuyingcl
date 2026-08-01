import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { notifyAdmin, pushToGoogleSheets } from "@/lib/notify";
import { detectSource } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth";

// PUBLIC — lead form submission (the only thing a client ever does)
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!rateLimit(`lead:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "طلبات كثيرة، حاول بعد دقيقة" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "بيانات غير صحيحة", fields: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  // Honeypot triggered → pretend success, save nothing
  if (body?.company) return NextResponse.json({ ok: true });

  const d = parsed.data;
  const source = detectSource(req.headers.get("referer"), body?.utm_source);

  // Duplicate detection: same phone or email in last 30 days
  const dup = await prisma.lead.findFirst({
    where: {
      OR: [{ phone: d.phone }, { email: d.email }],
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 3600 * 1000) },
    },
    select: { id: true },
  });

  const lead = await prisma.lead.create({
    data: {
      fullName: d.fullName,
      phone: d.phone,
      email: d.email,
      brandName: d.brandName,
      storeUrl: d.storeUrl || null,
      monthlyBudget: d.monthlyBudget,
      dailyAdBudget: d.dailyAdBudget,
      productsCount: d.productsCount,
      targetCountry: d.targetCountry,
      platform: d.platform,
      currentProblem: d.currentProblem,
      notes: d.notes || null,
      status: "NEW",
      source,
      sourcePage: req.headers.get("referer") ?? null,
      isDuplicate: !!dup,
    },
  });

  // Automations (fire together, never block the visitor)
  await Promise.allSettled([
    prisma.activity.create({
      data: { type: "lead_submitted", message: `عميل محتمل جديد: ${d.fullName} — ${d.brandName}` },
    }),
    notifyAdmin({
      type: "new_lead",
      title: `🎯 عميل محتمل جديد: ${d.brandName}`,
      body: `${d.fullName} — ${d.phone} — ميزانية شهرية: ${d.monthlyBudget}`,
      link: `/admin/leads?focus=${lead.id}`,
    }),
    pushToGoogleSheets({ ...d, source, createdAt: new Date().toISOString() }),
    prisma.task.create({
      data: { title: `متابعة: ${d.brandName} (${d.fullName})`, priority: "high", status: "TODO" },
    }),
  ]);

  return NextResponse.json({ ok: true, id: lead.id });
}

// ADMIN — list leads
export async function GET(req: NextRequest) {
  await requireAdmin("leads");
  const status = req.nextUrl.searchParams.get("status") ?? undefined;
  const leads = await prisma.lead.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { createdAt: "desc" },
    include: { assignedTo: { select: { name: true } } },
    take: 200,
  });
  return NextResponse.json(leads);
}
