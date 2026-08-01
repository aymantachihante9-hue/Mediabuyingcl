import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  await requireAdmin("tasks");
  const tasks = await prisma.task.findMany({
    orderBy: [{ status: "asc" }, { order: "asc" }],
    include: { assignedTo: { select: { name: true } } },
  });
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  await requireAdmin("tasks");
  const body = await req.json();
  const task = await prisma.task.create({ data: body });
  return NextResponse.json(task);
}

export async function PATCH(req: NextRequest) {
  await requireAdmin("tasks");
  const { id, ...data } = await req.json();
  const task = await prisma.task.update({ where: { id }, data });
  return NextResponse.json(task);
}

export async function DELETE(req: NextRequest) {
  await requireAdmin("tasks");
  const { id } = await req.json();
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
