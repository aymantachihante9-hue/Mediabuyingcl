import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/utils";

export default function Footer({ data }: { data?: any }) {
  const d = data ?? {};
  const social = d.social ?? {};
  return (
    <footer className="border-t border-white/5 bg-navy-900/60 px-4 py-14">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
        <div>
          <div className="display text-2xl font-extrabold">
            Earn<span className="text-electric">Partner</span>
          </div>
          <p className="mt-4 leading-relaxed text-slate-400">{d.about}</p>
        </div>
        <div className="space-y-3 text-slate-300">
          <h3 className="display font-bold">تواصل معنا</h3>
          {d.phone && (
            <a href={`tel:${d.phone}`} className="flex items-center gap-2 hover:text-white">
              <Phone className="h-4 w-4 text-electric" /> <span dir="ltr">{d.phone}</span>
            </a>
          )}
          {d.whatsapp && (
            <a href={waLink(d.whatsapp)} target="_blank" className="flex items-center gap-2 hover:text-white">
              <MessageCircle className="h-4 w-4 text-green-400" /> واتساب
            </a>
          )}
          {d.email && (
            <a href={`mailto:${d.email}`} className="flex items-center gap-2 hover:text-white">
              <Mail className="h-4 w-4 text-electric" /> {d.email}
            </a>
          )}
          {d.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-electric" /> {d.location}
            </div>
          )}
        </div>
        <div>
          <h3 className="display font-bold text-slate-300">تابعنا</h3>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-400">
            {Object.entries(social)
              .filter(([, url]) => url)
              .map(([name, url]) => (
                <a key={name} href={url as string} target="_blank" className="glass rounded-full px-4 py-2 capitalize hover:text-white">
                  {name}
                </a>
              ))}
          </div>
          <div className="mt-6 flex gap-4 text-xs text-slate-500">
            <a href="/privacy" className="hover:text-slate-300">سياسة الخصوصية</a>
            <a href="/terms" className="hover:text-slate-300">شروط الاستخدام</a>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-white/5 pt-6 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} Earn Partner. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
