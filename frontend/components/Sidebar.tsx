"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Baby,
  BarChart3,
  Database,
  HeartPulse,
  LayoutDashboard,
  Menu,
  MessageSquare,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { useLang } from "./LanguageProvider";
import AuthBox from "./AuthBox";

const items = [
  { en: "Preventive Care", ar: "الرعاية الوقائية", href: "/", icon: HeartPulse },
  { en: "Population Dashboard", ar: "لوحة بيانات السكان", href: "/dashboard", icon: LayoutDashboard },
  { en: "Child Pathway", ar: "مسار صحة الطفل", href: "/child", icon: Baby },
  { en: "Adult Pathway", ar: "مسار فحص البالغين", href: "/adult", icon: Stethoscope },
  { en: "Engagement", ar: "التواصل", href: "/engagement", icon: MessageSquare },
  { en: "Community Insights", ar: "رؤى المجتمع", href: "/community", icon: Users },
  { en: "Fairness & Safety", ar: "العدالة والسلامة", href: "/fairness", icon: ShieldCheck },
  { en: "Outcomes", ar: "النتائج", href: "/outcomes", icon: BarChart3 },
  { en: "Data & Models", ar: "البيانات والنماذج", href: "/data", icon: Database },
];

const FOOTER = {
  en: "Demo environment. All case records are synthetic. No real patients.",
  ar: "بيئة تجريبية. جميع سجلات الحالات اصطناعية. لا يوجد مرضى حقيقيون.",
};

function NavContent() {
  const pathname = usePathname();
  const { lang, setLang } = useLang();

  return (
    <>
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400/20">
          <HeartPulse className="h-5 w-5 text-teal-300" />
        </div>
        <span className="text-lg font-semibold">CarePath AI</span>
      </div>

      <div className="mb-6 flex rounded-xl bg-white/10 p-1 text-sm">
        {(["en", "ar"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`flex-1 rounded-lg py-1.5 ${
              lang === l ? "bg-teal-400/30 text-teal-100" : "text-slate-300"
            }`}
          >
            {l === "en" ? "English" : "العربية"}
          </button>
        ))}
      </div>

      <AuthBox />

      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${
                active ? "bg-teal-400/20 text-teal-200" : "text-slate-200 hover:bg-white/10"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item[lang]}
            </Link>
          );
        })}
      </nav>

      <p className="mt-auto pt-6 text-[11px] leading-relaxed text-slate-400">{FOOTER[lang]}</p>
    </>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { lang } = useLang();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between bg-[#0b2545] px-4 py-3 text-white md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-400/20">
            <HeartPulse className="h-4 w-4 text-teal-300" />
          </div>
          <span className="font-semibold">CarePath AI</span>
        </div>
        <button
          aria-label={lang === "ar" ? "القائمة" : "Menu"}
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 hover:bg-white/10"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 start-0 flex w-72 max-w-[85%] flex-col overflow-y-auto bg-[#0b2545] p-5 text-white">
            <button
              aria-label={lang === "ar" ? "إغلاق" : "Close"}
              onClick={() => setOpen(false)}
              className="mb-2 self-end rounded-lg p-2 hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
            <NavContent />
          </aside>
        </div>
      )}

      <aside className="hidden w-64 shrink-0 flex-col bg-[#0b2545] p-5 text-white md:flex">
        <NavContent />
      </aside>
    </>
  );
}

