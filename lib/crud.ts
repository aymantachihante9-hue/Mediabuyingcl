import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type Model = "testimonial" | "pricingPackage" | "faq" | "serviceCard" | "caseStudy";

// Shared CRUD for orderable/visible CMS collections.
// GET is public (site rendering), mutations require admin.
export function makeCrud(model: Model) {
  const db = () => (prisma as any)[model];

  return {
    async GET() {
      const items = await db().findMany({ orderBy: { order: "asc" } });
      return NextResponse.json(items);
    },

    async POST(req: NextRequest) {
      await requireAdmin("content");
      const body = await req.json();
      const count = await db().count();
      const item = await db().create({ data: { ...body, order: body.order ?? count } });
      return NextResponse.json(item);
    },

    async PATCH(req: NextRequest) {
      await requireAdmin("content");
      const { id, reorder, ...data } = await req.json();

      // Bulk reorder: [{id, order}, ...]
      if (Array.isArray(reorder)) {
        await prisma.$transaction(
          reorder.map((r: { id: string; order: number }) =>
            db().update({ where: { id: r.id }, data: { order: r.order } })
          )
        );
        return NextResponse.json({ ok: true });
      }

      const item = await db().update({ where: { id }, data });
      return NextResponse.json(item);
    },

    async DELETE(req: NextRequest) {
      await requireAdmin("content");
      const { id } = await req.json();
      await db().delete({ where: { id } });
      return NextResponse.json({ ok: true });
    },
  };
}
