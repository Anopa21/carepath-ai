import { useLang } from "@/components/LanguageProvider";
import { useT4 } from "@/lib/i18n4";

const extra: Record<"en" | "ar", Record<string, string>> = {
  en: {
    "out.title": "Outcomes & Impact",
    "out.subtitle": "Tracking whether preventive care is reaching people",
    "out.measured": "Measured outcomes",
    "out.real_badge": "Real data",
    "out.measured_notice":
      "No real measured outcome data is connected yet, so nothing is shown as a measured result.",
    "out.na": "Not available",
    "out.i1": "Completed Well-Child Visits",
    "out.i2": "Completed Adult Comprehensive Screenings",
    "out.i3": "Preventive interventions completed",
    "out.i4": "Timely attendance",
    "out.i5": "Recall completion",
    "out.i6": "Follow-up completion",
    "out.i7": "Screening coverage change",
    "out.i8": "Model performance over time",
    "out.simulated": "Simulated demonstration outcomes",
    "out.sim_badge": "Synthetic demo",
    "out.sim_notice":
      "These figures are counted from the synthetic demo cases only. They are not real outcomes and must not be used to claim impact. With real data, any group smaller than 10 people would be suppressed.",
    "out.sim_label": "Simulated",
    "out.s1": "Well-Child Visits completed",
    "out.s2": "Adult screenings completed",
    "out.s3": "Follow-up required",
    "out.s4": "Cases closed",
    "out.chart": "Case progress by status (synthetic)",
    "out.children": "Children",
    "out.adults": "Adults",
  },
  ar: {
    "out.title": "النتائج والأثر",
    "out.subtitle": "متابعة مدى وصول الرعاية الوقائية إلى الناس",
    "out.measured": "النتائج المقاسة",
    "out.real_badge": "بيانات حقيقية",
    "out.measured_notice":
      "لا توجد بيانات نتائج مقاسة حقيقية متصلة بعد، لذلك لا يُعرض أي شيء على أنه نتيجة مقاسة.",
    "out.na": "غير متوفر",
    "out.i1": "زيارات صحة الطفل المكتملة",
    "out.i2": "الفحوصات الشاملة للبالغين المكتملة",
    "out.i3": "التدخلات الوقائية المكتملة",
    "out.i4": "الحضور في الموعد المحدد",
    "out.i5": "إتمام الاستدعاء",
    "out.i6": "إتمام المتابعة",
    "out.i7": "التغير في تغطية الفحص",
    "out.i8": "أداء النموذج بمرور الوقت",
    "out.simulated": "نتائج تجريبية محاكاة",
    "out.sim_badge": "بيانات تجريبية اصطناعية",
    "out.sim_notice":
      "هذه الأرقام محسوبة من الحالات التجريبية الاصطناعية فقط. وهي ليست نتائج حقيقية ولا يجوز استخدامها للادعاء بوجود أثر. وعند استخدام بيانات حقيقية سيتم حجب أي مجموعة يقل عدد أفرادها عن 10.",
    "out.sim_label": "محاكاة",
    "out.s1": "زيارات صحة الطفل المكتملة",
    "out.s2": "الفحوصات الشاملة للبالغين المكتملة",
    "out.s3": "تتطلب متابعة",
    "out.s4": "الحالات المغلقة",
    "out.chart": "تقدم الحالات حسب الحالة (اصطناعي)",
    "out.children": "الأطفال",
    "out.adults": "البالغون",
  },
};

export function useT5() {
  const { lang } = useLang();
  const base = useT4();
  return (key: string) => extra[lang][key] ?? base(key);
}
