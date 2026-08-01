import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// Update one section: data, visibility, or order — with version history
export async function PATCH(req: NextRequest, { params }: { params: { key: string } }) {
  const admin = await requireAdmin("content");
  const body = await req.json();

  const current = await prisma.siteSection.findUnique({ where: { key: params.key } });
  if (current && body.data) {
    await prisma.contentVersion.create({
      data: { sectionKey: params.key, data: current.data as any, savedBy: admin.name },
    });
  }

  const section = await prisma.siteSection.upsert({
    where: { key: params.key },
    update: {
      ...(body.data !== undefined && { data: body.data }),
      ...(body.visible !== undefined && { visible: body.visible }),
      ...(body.order !== undefined && { order: body.order }),
      ...(body.label !== undefined && { label: body.label }),
    },
    create: {
      key: params.key,
      label: body.label ?? params.key,
      data: body.data ?? {},
      order: body.order ?? 99,
      visible: body.visible ?? true,
    },
  });

  await prisma.activity.create({
    data: { type: "content_updated", message: `تحديث قسم: ${section.label}`, actorId: admin.id },
  });

  return NextResponse.json(section);
}

// Version history for the section
export async function GET(_: NextRequest, { params }: { params: { key: string } }) {
  await requireAdmin("content");
  const versions = await prisma.contentVersion.findMany({
    where: { sectionKey: params.key },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json(versions);
}
