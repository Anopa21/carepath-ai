import { useLang } from "@/components/LanguageProvider";
import { useT10 } from "@/lib/i18n10";

const extra: Record<"en" | "ar", Record<string, string>> = {
  en: {
    "det.indicators": "Indicators (synthetic demo values)",
    "det.factors": "Main factors behind this flag (rule-based demo)",
    "det.completeness": "Data completeness",
    "det.above": "Above demo threshold",
    "det.none": "No indicator data for this case.",
    "ind.age": "Age",
    "ind.age_group": "Age group",
    "ind.sex": "Sex",
    "ind.bmi": "BMI",
    "ind.bmi_pct": "BMI-for-age",
    "ind.bp": "Blood pressure",
    "ind.hba1c": "HbA1c",
    "ind.glucose": "Fasting glucose",
    "ind.chol": "Total cholesterol",
    "ind.overdue": "Visit overdue by",
    "sex.male": "Male",
    "sex.female": "Female",
    "unit.years": "years",
    "unit.months": "months",
    "unit.percentile": "percentile",
  },
  ar: {
    "det.indicators": "المؤشرات (قيم تجريبية اصطناعية)",
    "det.factors": "العوامل الرئيسية وراء هذا التنبيه (منطق تجريبي قائم على القواعد)",
    "det.completeness": "اكتمال البيانات",
    "det.above": "أعلى من الحد التجريبي",
    "det.none": "لا توجد بيانات مؤشرات لهذه الحالة.",
    "ind.age": "العمر",
    "ind.age_group": "الفئة العمرية",
    "ind.sex": "الجنس",
    "ind.bmi": "مؤشر كتلة الجسم",
    "ind.bmi_pct": "مؤشر كتلة الجسم للعمر",
    "ind.bp": "ضغط الدم",
    "ind.hba1c": "الهيموغلوبين السكري (HbA1c)",
    "ind.glucose": "سكر الصيام",
    "ind.chol": "الكوليسترول الكلي",
    "ind.overdue": "تأخر الزيارة بمقدار",
    "sex.male": "ذكر",
    "sex.female": "أنثى",
    "unit.years": "سنة",
    "unit.months": "أشهر",
    "unit.percentile": "المئين",
  },
};

export function useT11() {
  const { lang } = useLang();
  const base = useT10();
  return (key: string) => extra[lang][key] ?? base(key);
}
