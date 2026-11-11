import { useLang } from "@/components/LanguageProvider";
import { useT9 } from "@/lib/i18n9";

const extra: Record<"en" | "ar", Record<string, string>> = {
  en: {
    "filter.search": "Search reference or reason",
    "filter.all": "All",
    "filter.showing": "Showing",
    "filter.of": "of",
    "filter.cases": "cases",
    "filter.reset": "Reset filters",
    "filter.none": "No cases match these filters.",
  },
  ar: {
    "filter.search": "ابحث بالمرجع أو السبب",
    "filter.all": "الكل",
    "filter.showing": "عرض",
    "filter.of": "من",
    "filter.cases": "حالة",
    "filter.reset": "إعادة ضبط التصفية",
    "filter.none": "لا توجد حالات تطابق هذه التصفية.",
  },
};

export function useT10() {
  const { lang } = useLang();
  const base = useT9();
  return (key: string) => extra[lang][key] ?? base(key);
}
