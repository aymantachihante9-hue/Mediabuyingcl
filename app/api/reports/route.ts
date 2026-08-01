import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { subDays } from "date-fns";

// CSV export of metrics + leads for a period (daily/weekly/monthly)
export async function GET(req: NextRequest) {
  await requireAdmin("reports");
  const period = req.nextUrl.searchParams.get("period") ?? "weekly";
  const days = period === "daily" ? 1 : period === "monthly" ? 30 : 7;
  const since = subDays(new Date(), days);

  const [metrics, leadsCount] = await Promise.all([
    prisma.dailyMetric.findMany({ where: { date: { gte: since } }, orderBy: { date: "asc" } }),
    prisma.lead.count({ where: { createdAt: { gte: since } } }),
  ]);

  const rows = [
    ["date", "leads", "orders", "spend", "revenue", "roas", "cpa", "ctr"],
    ...metrics.map((m: any) => [
      m.date.toISOString().slice(0, 10), m.leads, m.orders, m.spend, m.revenue, m.roas ?? "", m.cpa ?? "", m.ctr ?? "",
    ]),
    [],
    ["total_form_leads", leadsCount],
  ];
  const csv = rows.map((r: any) => r.join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=earnpartner-report-${period}.csv`,
    },
  });
}
