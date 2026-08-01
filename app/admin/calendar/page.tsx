import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";
const typeColor: Record<string, string> = {
  call: "bg-electric/15 text-electric-400", meeting: "bg-violet-500/15 text-violet-400",
  deadline: "bg-red-500/15 text-red-400", review: "bg-gold/15 text-gold-300", publishing: "bg-green-500/15 text-green-400",
};

export default async function CalendarPage() {
  await requireAdmin("calendar");
  const events = await prisma.calendarEvent.findMany({
    where: { startsAt: { gte: new Date(Date.now() - 24 * 3600 * 1000) } },
    orderBy: { startsAt: "asc" },
    include: { client: { select: { businessName: true } } },
    take: 60,
  });
  return (
    <div className="space-y-5">
      <h1 className="display text-2xl font-extrabold">التقويم</h1>
      {events.length === 0 && <div className="glass rounded-2xl p-14 text-center text-slate-500">لا توجد مواعيد قادمة.</div>}
      <div className="space-y-2">
        {events.map((e: any) => (
          <div key={e.id} className="glass flex items-center gap-4 rounded-2xl p-4">
            <div className="glass flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl">
              <span className="text-lg font-extrabold">{format(e.startsAt, "dd")}</span>
              <span className="text-[10px] text-slate-500">{format(e.startsAt, "MM/yyyy")}</span>
            </div>
            <div className="flex-1">
              <div className="font-bold">{e.title}</div>
              <div className="text-sm text-slate-500">
                {format(e.startsAt, "HH:mm")} {e.client && `· ${e.client.businessName}`} {e.notes && `· ${e.notes}`}
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${typeColor[e.type] ?? "bg-white/5 text-slate-400"}`}>{e.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
