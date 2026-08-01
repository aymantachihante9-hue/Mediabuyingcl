import { prisma } from "./prisma";

export async function notifyAdmin(input: {
  type: string;
  title: string;
  body?: string;
  link?: string;
}) {
  // 1) In-app notification (always)
  await prisma.notification.create({ data: input });

  // 2) Email via Resend (optional)
  if (process.env.RESEND_API_KEY && process.env.ADMIN_NOTIFY_EMAIL) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Earn Partner <notifications@earnpartner.ma>",
          to: process.env.ADMIN_NOTIFY_EMAIL,
          subject: input.title,
          text: input.body ?? input.title,
        }),
      });
    } catch (e) {
      console.error("email notify failed", e);
    }
  }

  // 3) Telegram (optional)
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    try {
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: `🔔 ${input.title}\n${input.body ?? ""}`,
        }),
      });
    } catch (e) {
      console.error("telegram notify failed", e);
    }
  }
}

export async function pushToGoogleSheets(lead: Record<string, unknown>) {
  // Use a Google Apps Script Web App URL (simplest, no OAuth).
  if (!process.env.GOOGLE_SHEETS_WEBHOOK_URL) return;
  try {
    await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
  } catch (e) {
    console.error("sheets push failed", e);
  }
}
