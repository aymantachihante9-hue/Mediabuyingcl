import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMad(n: number) {
  return new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 0 }).format(n) + " درهم";
}

export function waLink(phone: string, text?: string) {
  const p = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${p}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function detectSource(referer?: string | null, utm?: string | null): string {
  const s = (utm || referer || "").toLowerCase();
  if (s.includes("facebook") || s.includes("fb")) return "facebook";
  if (s.includes("tiktok")) return "tiktok";
  if (s.includes("instagram") || s.includes("ig")) return "instagram";
  if (s.includes("google")) return "organic";
  return "direct";
}
