import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  await requireAdmin();
  const items = await prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: 30 });
  const unread = await prisma.notification.count({ where: { read: false } });
  return NextResponse.json({ items, unread });
}

export async function PATCH(req: NextRequest) {
  await requireAdmin();
  const { id, all } = await req.json();
  if (all) await prisma.notification.updateMany({ data: { read: true } });
  else await prisma.notification.update({ where: { id }, data: { read: true } });
  return NextResponse.json({ ok: true });
}
