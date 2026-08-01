import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await requireAdmin("leads");
  const body = await req.json();
  const allowed = ["status", "notes", "assignedToId"];
  const data = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));
  const lead = await prisma.lead.update({ where: { id: params.id }, data });

  if (body.status) {
    await prisma.activity.create({
      data: { type: "lead_status", message: `تغيير حالة ${lead.fullName} إلى ${body.status}` },
    });
  }
  return NextResponse.json(lead);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await requireAdmin("leads");
  const lead = await prisma.lead.update({ where: { id: params.id }, data: { status: "ARCHIVED" } });
  return NextResponse.json(lead);
}
