import { useLang } from "@/components/LanguageProvider";
import { useT } from "@/lib/i18n";

const extra: Record<"en" | "ar", Record<string, string>> = {
  en: {
    "dash.title": "Population Dashboard",
    "dash.subtitle": "Overview of preventive-care cases",
    "dash.notice":
      "Charts below use synthetic demo cases only. They are not Abu Dhabi population statistics.",
    "dash.chart_status": "Cases by status",
    "dash.chart_flag": "Elevated risk vs unmet preventive care",
    "dash.child_pop": "Total child population",
    "dash.adult_pop": "Total adult population",
    "dash.coverage": "Screening and vaccination coverage",
    "dash.no_dataset": "No verified dataset connected yet.",
  },
  ar: {
    "dash.title": "لوحة بيانات السكان",
    "dash.subtitle": "نظرة عامة على حالات الرعاية الوقائية",
    "dash.notice":
      "تستخدم المخططات أدناه حالات تجريبية اصطناعية فقط. وهي ليست إحصاءات عن سكان أبوظبي.",
    "dash.chart_status": "الحالات حسب الحالة",
    "dash.chart_flag": "خطر مرتفع مقابل رعاية وقائية غير مكتملة",
    "dash.child_pop": "إجمالي عدد الأطفال",
    "dash.adult_pop": "إجمالي عدد البالغين",
    "dash.coverage": "تغطية الفحص والتطعيم",
    "dash.no_dataset": "لا توجد مجموعة بيانات موثّقة متصلة بعد.",
  },
};

export function useT2() {
  const { lang } = useLang();
  const base = useT();
  return (key: string) => extra[lang][key] ?? base(key);
}
