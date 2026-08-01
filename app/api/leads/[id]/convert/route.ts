import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// Convert lead → client
export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin("leads");
  const lead = await prisma.lead.findUnique({ where: { id: params.id } });
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const client = await prisma.client.upsert({
    where: { leadId: lead.id },
    update: {},
    create: {
      leadId: lead.id,
      businessName: lead.brandName,
      contactName: lead.fullName,
      phone: lead.phone,
      email: lead.email,
      storeUrl: lead.storeUrl,
      targetCountry: lead.targetCountry,
      monthlyBudget: lead.monthlyBudget,
    },
  });

  await prisma.lead.update({ where: { id: lead.id }, data: { status: "WON" } });
  await prisma.activity.create({
    data: { type: "client_converted", message: `تحويل ${lead.brandName} إلى عميل`, clientId: client.id, actorId: admin.id },
  });

  return NextResponse.json(client);
}
