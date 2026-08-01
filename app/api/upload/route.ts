import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// Uploads to Supabase Storage bucket "media" and records in MediaAsset
export async function POST(req: NextRequest) {
  await requireAdmin();
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const category = (form.get("category") as string) || "general";
  if (!file) return NextResponse.json({ error: "لا يوجد ملف" }, { status: 400 });
  if (file.size > 25 * 1024 * 1024) return NextResponse.json({ error: "الحد الأقصى 25MB" }, { status: 400 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
  const type = file.type.startsWith("image") ? "image"
    : file.type.startsWith("video") ? "video"
    : file.type.startsWith("audio") ? "audio"
    : file.type === "application/pdf" ? "pdf" : "file";

  const asset = await prisma.mediaAsset.create({
    data: { name: file.name, url: pub.publicUrl, type, category, sizeBytes: file.size },
  });
  return NextResponse.json(asset);
}

export async function GET() {
  await requireAdmin();
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(assets);
}

export async function DELETE(req: NextRequest) {
  await requireAdmin();
  const { id } = await req.json();
  await prisma.mediaAsset.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
