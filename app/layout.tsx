import type { Metadata } from "next";
import "./globals.css";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SETTINGS } from "@/lib/default-content";

export async function generateMetadata(): Promise<Metadata> {
  let seo = DEFAULT_SETTINGS.seo;
  try {
    const row = await prisma.setting.findUnique({ where: { key: "seo" } });
    if (row) seo = row.value as any;
  } catch {}
  return {
    title: seo.title,
    description: seo.description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : [],
      locale: "ar_MA",
      type: "website",
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800;900&family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-slate-900 dark:bg-navy-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
