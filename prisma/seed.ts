import { PrismaClient } from "@prisma/client";
import {
  DEFAULT_SECTIONS, DEFAULT_SERVICES, DEFAULT_PRICING, DEFAULT_FAQ,
  DEFAULT_CASE_STUDIES, DEFAULT_TESTIMONIALS, DEFAULT_SETTINGS,
} from "../lib/default-content";

const prisma = new PrismaClient();

async function main() {
  // Sections
  for (const s of DEFAULT_SECTIONS) {
    await prisma.siteSection.upsert({
      where: { key: s.key },
      update: {},
      create: { key: s.key, label: s.label, visible: s.visible, order: s.order, data: s.data },
    });
  }
  // Collections
  if ((await prisma.serviceCard.count()) === 0)
    await prisma.serviceCard.createMany({ data: DEFAULT_SERVICES });
  if ((await prisma.pricingPackage.count()) === 0)
    await prisma.pricingPackage.createMany({ data: DEFAULT_PRICING.map((p) => ({ ...p, badge: p.badge ?? undefined })) });
  if ((await prisma.faq.count()) === 0) await prisma.faq.createMany({ data: DEFAULT_FAQ });
  if ((await prisma.caseStudy.count()) === 0) await prisma.caseStudy.createMany({ data: DEFAULT_CASE_STUDIES });
  if ((await prisma.testimonial.count()) === 0) await prisma.testimonial.createMany({ data: DEFAULT_TESTIMONIALS });
  // Settings
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await prisma.setting.upsert({ where: { key }, update: {}, create: { key, value } });
  }
  // Demo metrics for the last 30 days so the dashboard charts render
  const today = new Date();
  for (let i = 30; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
    const orders = 40 + Math.floor(Math.random() * 80);
    const spend = 1500 + Math.random() * 2000;
    const revenue = spend * (2 + Math.random() * 3);
    await prisma.dailyMetric.upsert({
      where: { date: d },
      update: {},
      create: {
        date: d,
        leads: Math.floor(Math.random() * 8),
        orders,
        spend: Math.round(spend),
        revenue: Math.round(revenue),
        roas: +(revenue / spend).toFixed(2),
        cpa: +(spend / orders).toFixed(1),
        ctr: +(1 + Math.random() * 2).toFixed(2),
      },
    });
  }
  console.log("✅ Seed complete");
}

main().finally(() => prisma.$disconnect());
