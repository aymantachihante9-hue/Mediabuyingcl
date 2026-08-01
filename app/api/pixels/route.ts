import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { notifyAdmin } from "@/lib/notify";

export async function GET() {
  await requireAdmin("pixels");
  const pixels = await prisma.pixel.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(pixels);
}

export async function POST(req: NextRequest) {
  await requireAdmin("pixels");
  const body = await req.json();
  const pixel = await prisma.pixel.create({ data: body });
  return NextResponse.json(pixel);
}

export async function PATCH(req: NextRequest) {
  await requireAdmin("pixels");
  const { id, testEvent, ...data } = await req.json();

  if (testEvent) {
    // Simulated test event — replace with a real CAPI/Events API call when keys are configured
    const pixel = await prisma.pixel.update({
      where: { id },
      data: { lastEventAt: new Date(), eventsTotal: { increment: 1 }, pageViews: { increment: 1 } },
    });
    return NextResponse.json({ ok: true, pixel });
  }

  const pixel = await prisma.pixel.update({ where: { id }, data });

  if (data.connected === false) {
    await notifyAdmin({
      type: "pixel_disconnected",
      title: `⚠️ بيكسل غير متصل: ${pixel.platform}`,
      body: `Pixel ID: ${pixel.pixelId}`,
      link: "/admin/pixels",
    });
  }
  return NextResponse.json(pixel);
}

export async function DELETE(req: NextRequest) {
  await requireAdmin("pixels");
  const { id } = await req.json();
  await prisma.pixel.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
