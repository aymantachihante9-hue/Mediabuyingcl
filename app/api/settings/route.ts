import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { DEFAULT_SETTINGS } from "@/lib/default-content";

export async function GET() {
  const rows = await prisma.setting.findMany();
  const settings: Record<string, any> = { ...DEFAULT_SETTINGS };
  rows.forEach((r: any) => (settings[r.key] = r.value));
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  await requireAdmin("settings");
  const body = await req.json(); // { key: value, ... }
  await prisma.$transaction(
    Object.entries(body).map(([key, value]) =>
      prisma.setting.upsert({ where: { key }, update: { value: value as any }, create: { key, value: value as any } })
    )
  );
  return NextResponse.json({ ok: true });
}
