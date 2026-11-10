import { useLang } from "@/components/LanguageProvider";
import { useT5 } from "@/lib/i18n5";

const extra: Record<"en" | "ar", Record<string, string>> = {
  en: {
    "com.title": "Community Insights",
    "com.subtitle": "Population-level patterns and data quality",
    "com.privacy_label": "Privacy and accuracy: ",
    "com.privacy_text":
      "No neighbourhood statistics are shown because none are verified. With real data, any group smaller than 10 people would be suppressed so individuals cannot be identified.",
    "com.na": "Not available",
    "com.c1": "Health indicators by geographic area",
    "com.c1_text":
      "No verified geographic data is connected. A map or area breakdown is shown only when valid geographic data exists.",
    "com.c2": "Preventive-care coverage",
    "com.c2_text":
      "Coverage rates need verified eligibility and visit-history data, which is not connected yet.",
    "com.c3": "Screening trends",
    "com.c3_text": "Trends over time need real screening records across several periods.",
    "com.c4": "Data quality indicators",
    "com.c4_text":
      "Completeness and missing-value rates will appear once a verified dataset is registered in the Data & Models centre.",
    "com.compare": "Child and adult comparison",
    "com.badge": "Synthetic demo",
    "com.compare_note":
      "Counts come from the synthetic demo cases only. They are not Abu Dhabi population statistics.",
    "com.chart_flag": "Flag type by population group",
    "com.chart_priority": "Priority by population group",
    "com.children": "Children",
    "com.adults": "Adults",
  },
  ar: {
    "com.title": "رؤى المجتمع",
    "com.subtitle": "الأنماط على مستوى السكان وجودة البيانات",
    "com.privacy_label": "الخصوصية والدقة: ",
    "com.privacy_text":
      "لا تُعرض أي إحصاءات للأحياء لأنه لا توجد إحصاءات موثّقة. وعند استخدام بيانات حقيقية سيتم حجب أي مجموعة يقل عدد أفرادها عن 10 حتى لا يمكن التعرف على الأفراد.",
    "com.na": "غير متوفر",
    "com.c1": "المؤشرات الصحية حسب المنطقة الجغرافية",
    "com.c1_text":
      "لا توجد بيانات جغرافية موثّقة متصلة. تُعرض الخريطة أو التوزيع حسب المنطقة فقط عند توفر بيانات جغرافية صالحة.",
    "com.c2": "تغطية الرعاية الوقائية",
    "com.c2_text":
      "تتطلب معدلات التغطية بيانات موثّقة عن الأهلية وسجل الزيارات، وهي غير متصلة بعد.",
    "com.c3": "اتجاهات الفحص",
    "com.c3_text": "تتطلب الاتجاهات عبر الزمن سجلات فحص حقيقية تغطي عدة فترات.",
    "com.c4": "مؤشرات جودة البيانات",
    "com.c4_text":
      "ستظهر معدلات الاكتمال والقيم المفقودة بعد تسجيل مجموعة بيانات موثّقة في مركز البيانات والنماذج.",
    "com.compare": "مقارنة بين الأطفال والبالغين",
    "com.badge": "بيانات تجريبية اصطناعية",
    "com.compare_note":
      "الأعداد مأخوذة من الحالات التجريبية الاصطناعية فقط. وهي ليست إحصاءات عن سكان أبوظبي.",
    "com.chart_flag": "نوع التنبيه حسب الفئة السكانية",
    "com.chart_priority": "الأولوية حسب الفئة السكانية",
    "com.children": "الأطفال",
    "com.adults": "البالغون",
  },
};

export function useT6() {
  const { lang } = useLang();
  const base = useT5();
  return (key: string) => extra[lang][key] ?? base(key);
}
