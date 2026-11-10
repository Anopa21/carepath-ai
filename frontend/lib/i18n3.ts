import { useLang } from "@/components/LanguageProvider";
import { useT2 } from "@/lib/i18n2";

const extra: Record<"en" | "ar", Record<string, string>> = {
  en: {
    "fair.title": "Fairness & Safety Centre",
    "fair.subtitle": "Model evaluation, limitations and safeguards",
    "fair.important": "Important: ",
    "fair.important_text":
      "Having this page does not mean fairness has been achieved. Fairness must be assessed with real evaluation results, real subgroup data and review by people with clinical and community expertise.",
    "fair.model_version": "Model version",
    "fair.eval_date": "Evaluation date",
    "fair.eval_dataset": "Evaluation dataset",
    "fair.na": "Not available",
    "fair.metrics": "Model evaluation metrics",
    "fair.precision": "Precision",
    "fair.precision_n": "Of the people flagged, how many truly needed attention",
    "fair.recall": "Recall",
    "fair.recall_n": "Of the people who needed attention, how many were flagged",
    "fair.f1": "F1 score",
    "fair.f1_n": "Balance of precision and recall",
    "fair.roc": "ROC-AUC",
    "fair.roc_n": "Ability to separate flagged from not flagged",
    "fair.pr": "PR-AUC",
    "fair.pr_n": "Precision-recall performance, useful when the outcome is uncommon",
    "fair.calib": "Calibration",
    "fair.calib_n": "Whether predicted risks match observed rates",
    "fair.fpfn": "False-positive and false-negative analysis",
    "fair.fpfn_text":
      "A false positive flags someone who did not need attention. A false negative misses someone who did. Both carry real costs and will be reported once a model has been evaluated.",
    "fair.subgroup": "Subgroup performance",
    "fair.subgroup_text":
      "Results by sex, age group and other characteristics will be shown only where sample sizes are large enough. Any group with fewer than 10 people will be suppressed to protect privacy and avoid unreliable estimates.",
    "fair.missing": "Missing data",
    "fair.missing_text":
      "Missing-value rates will come from the Data & Models centre once a verified dataset is registered.",
    "fair.uncertainty": "Uncertainty warnings",
    "fair.u1": "A risk flag is a prompt for a conversation, not a diagnosis.",
    "fair.u2": "Every flag should be reviewed by a qualified health professional.",
    "fair.u3": "People can always decline preventive care or outreach.",
    "fair.limits": "Current limitations",
    "fair.l1": "No trained model is connected, so no model performance can be reported.",
    "fair.l2": "All case records in this demo are synthetic and do not represent real people.",
    "fair.l3": "Flags come from simple demonstration rules, not from a validated clinical model.",
    "fair.l4": "No verified Abu Dhabi population dataset has been connected yet.",
    "fair.l5": "Subgroup results cannot be shown until real evaluation results exist.",
  },
  ar: {
    "fair.title": "مركز العدالة والسلامة",
    "fair.subtitle": "تقييم النماذج والقيود والضمانات",
    "fair.important": "مهم: ",
    "fair.important_text":
      "وجود هذه الصفحة لا يعني أن العدالة قد تحققت. يجب تقييم العدالة بنتائج تقييم حقيقية وبيانات حقيقية للمجموعات الفرعية ومراجعة من أصحاب الخبرة السريرية والمجتمعية.",
    "fair.model_version": "إصدار النموذج",
    "fair.eval_date": "تاريخ التقييم",
    "fair.eval_dataset": "مجموعة بيانات التقييم",
    "fair.na": "غير متوفر",
    "fair.metrics": "مقاييس تقييم النموذج",
    "fair.precision": "الدقة (Precision)",
    "fair.precision_n": "من بين من تمت الإشارة إليهم، كم منهم كانوا يحتاجون فعلًا إلى اهتمام",
    "fair.recall": "الاستدعاء (Recall)",
    "fair.recall_n": "من بين من كانوا يحتاجون إلى اهتمام، كم منهم تمت الإشارة إليهم",
    "fair.f1": "مقياس F1",
    "fair.f1_n": "توازن بين الدقة والاستدعاء",
    "fair.roc": "ROC-AUC",
    "fair.roc_n": "القدرة على التمييز بين من تمت الإشارة إليهم ومن لم تتم",
    "fair.pr": "PR-AUC",
    "fair.pr_n": "أداء الدقة والاستدعاء، ومفيد عندما تكون النتيجة غير شائعة",
    "fair.calib": "المعايرة",
    "fair.calib_n": "مدى تطابق المخاطر المتوقعة مع المعدلات المرصودة",
    "fair.fpfn": "تحليل الإيجابيات الكاذبة والسلبيات الكاذبة",
    "fair.fpfn_text":
      "الإيجابية الكاذبة تعني الإشارة إلى شخص لم يكن بحاجة إلى اهتمام. أما السلبية الكاذبة فتعني إغفال شخص كان بحاجة إليه. لكل منهما تكلفة حقيقية، وسيتم الإبلاغ عنهما بعد تقييم النموذج.",
    "fair.subgroup": "الأداء حسب المجموعات الفرعية",
    "fair.subgroup_text":
      "ستُعرض النتائج حسب الجنس والفئة العمرية وخصائص أخرى فقط عندما تكون أحجام العينات كافية. وستُحجب أي مجموعة يقل عدد أفرادها عن 10 لحماية الخصوصية وتجنب التقديرات غير الموثوقة.",
    "fair.missing": "البيانات المفقودة",
    "fair.missing_text":
      "ستأتي معدلات القيم المفقودة من مركز البيانات والنماذج بعد تسجيل مجموعة بيانات موثّقة.",
    "fair.uncertainty": "تحذيرات عدم اليقين",
    "fair.u1": "تنبيه الخطر دعوة لإجراء محادثة وليس تشخيصًا.",
    "fair.u2": "ينبغي أن يراجع كل تنبيه أخصائي رعاية صحية مؤهل.",
    "fair.u3": "يحق للأشخاص دائمًا رفض الرعاية الوقائية أو التواصل.",
    "fair.limits": "القيود الحالية",
    "fair.l1": "لا يوجد نموذج مدرَّب متصل، لذلك لا يمكن الإبلاغ عن أداء أي نموذج.",
    "fair.l2": "جميع سجلات الحالات في هذا العرض التجريبي اصطناعية ولا تمثل أشخاصًا حقيقيين.",
    "fair.l3": "التنبيهات مبنية على قواعد تجريبية بسيطة وليست على نموذج سريري موثّق.",
    "fair.l4": "لم يتم ربط مجموعة بيانات موثّقة لسكان أبوظبي بعد.",
    "fair.l5": "لا يمكن عرض نتائج المجموعات الفرعية قبل توفر نتائج تقييم حقيقية.",
  },
};

export function useT3() {
  const { lang } = useLang();
  const base = useT2();
  return (key: string) => extra[lang][key] ?? base(key);
}
