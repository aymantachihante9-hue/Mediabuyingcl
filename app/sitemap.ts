import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://earnpartner.ma";
  return [
    { url: base, lastModified: new Date(), priority: 1 },
    { url: `${base}/thank-you`, lastModified: new Date(), priority: 0.3 },
  ];
}
