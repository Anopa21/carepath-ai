import { useLang } from "@/components/LanguageProvider";
import { useT8 } from "@/lib/i18n8";

const extra: Record<"en" | "ar", Record<string, string>> = {
  en: {
    "hist.title": "Case details",
    "hist.synthetic": "Synthetic demo record. Not a real person.",
    "hist.current": "Current status",
    "hist.history": "Status history",
    "hist.empty": "No status changes have been recorded for this case yet.",
    "hist.empty_note": "Changes made before the demo login was added were not recorded.",
    "hist.signin": "Sign in (sidebar) to view the status history.",
    "hist.loading": "Loading…",
    "hist.error": "Could not load the history.",
    "hist.close": "Close",
    "hist.by": "by",
  },
  ar: {
    "hist.title": "تفاصيل الحالة",
    "hist.synthetic": "سجل تجريبي اصطناعي. وليس لشخص حقيقي.",
    "hist.current": "الحالة الحالية",
    "hist.history": "سجل تغيّر الحالة",
    "hist.empty": "لم يتم تسجيل أي تغيير في حالة هذا السجل بعد.",
    "hist.empty_note": "التغييرات التي أُجريت قبل إضافة تسجيل الدخول التجريبي لم تُسجَّل.",
    "hist.signin": "سجّل الدخول (من الشريط الجانبي) لعرض سجل تغيّر الحالة.",
    "hist.loading": "جارٍ التحميل…",
    "hist.error": "تعذّر تحميل السجل.",
    "hist.close": "إغلاق",
    "hist.by": "بواسطة",
  },
};

export function useT9() {
  const { lang } = useLang();
  const base = useT8();
  return (key: string) => extra[lang][key] ?? base(key);
}
