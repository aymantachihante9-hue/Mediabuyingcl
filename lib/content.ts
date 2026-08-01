import { prisma } from "./prisma";
import { DEFAULT_SECTIONS } from "./default-content";

export type Section = {
  key: string;
  label: string;
  visible: boolean;
  order: number;
  data: Record<string, any>;
};

// Returns all visible sections ordered, falling back to defaults
// so the site renders even before the DB is seeded.
export async function getSiteContent(): Promise<Section[]> {
  try {
    const sections = await prisma.siteSection.findMany({ orderBy: { order: "asc" } });
    if (sections.length === 0) return DEFAULT_SECTIONS;
    return sections.map((s: any) => ({
      key: s.key,
      label: s.label,
      visible: s.visible,
      order: s.order,
      data: s.data as Record<string, any>,
    }));
  } catch {
    return DEFAULT_SECTIONS;
  }
}

export async function getSection(key: string): Promise<Section | undefined> {
  const all = await getSiteContent();
  return all.find((s) => s.key === key);
}
