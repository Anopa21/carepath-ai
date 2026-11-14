import { useLang } from "@/components/LanguageProvider";
import { useT14 } from "@/lib/i18n14";

const extra: Record<"en" | "ar", Record<string, string>> = {
  en: {
    "supp.suppressed": "Suppressed",
    "supp.reason": "Fewer than 10 people. Hidden to protect privacy.",
    "supp.demo": "Demo count: would be suppressed (fewer than 10)",
  },
  ar: {
    "supp.suppressed": "محجوب",
    "supp.reason": "أقل من 10 أشخاص. حُجب لحماية الخصوصية.",
    "supp.demo": "عدد تجريبي: كان سيُحجب (أقل من 10)",
  },
};

export function useT15() {
  const { lang } = useLang();
  const base = useT14();
  return (key: string) => extra[lang][key] ?? base(key);
}
