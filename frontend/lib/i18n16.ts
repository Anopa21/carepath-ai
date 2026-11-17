import { useLang } from "@/components/LanguageProvider";
import { useT15 } from "@/lib/i18n15";

const extra: Record<"en" | "ar", Record<string, string>> = {
  en: {
    "fm.tab.adult": "Adult model (18–80)",
    "fm.tab.adolescent": "Adolescent model (12–17)",
    "fm.banner":
      "These are experimental research prototypes trained on US NHANES data. They run as separate services and are not yet used on the cases in this app, so no model score is shown for any case.",
    "fm.version": "Model version",
    "fm.eval_data": "Evaluation data",
    "fm.eval_method": "Evaluation method",
    "fm.eval_date": "Evaluation date",
    "fm.target": "What it predicts",
    "fm.rule": "Decision rule",
    "fm.records": "Records evaluated",
    "fm.positives": "Positive cases",
    "fm.small": "The number of positive cases is small, so these estimates are uncertain.",
    "fm.metrics": "Reported performance",
    "fm.roc_hint": "A ROC-AUC of 0.5 means no better than chance.",
    "fm.calib_value": "Not calibrated",
    "fm.calib_note": "The developers state the score is not established as a calibrated risk probability.",
    "fm.cm_tn": "Correctly not flagged",
    "fm.cm_fp": "Flagged by mistake (false positives)",
    "fm.cm_fn": "Missed (false negatives)",
    "fm.cm_tp": "Correctly flagged",
    "fm.read_fp": "Of every 100 people without the outcome, about {x} were flagged by mistake.",
    "fm.read_fn": "Of every 100 people with the outcome, about {x} were missed.",
    "fm.subgroup_na":
      "No results by sex, age group or ethnicity were supplied, so fairness across groups cannot be assessed. Any group with fewer than 10 people would be suppressed.",
    "fm.missing_na":
      "Rates of missing values were not supplied. The pipeline fills gaps with typical values (median or most frequent), which can hide missing data.",
    "fm.lim_dev": "Limitations stated by the model developers",
    "fm.lim_ours": "Additional notes for this app",
    "fm.note_us":
      "Trained and tested only on US NHANES 2021–2023 data. Performance in Abu Dhabi or other populations has not been established.",
    "fm.note_inputs":
      "The adult model takes race/ethnicity and income-to-poverty ratio as inputs, using US categories. Whether using them is appropriate here has not been assessed, and they must not be substituted or invented.",
    "fm.note_demo_adult":
      "The demo cases in this app do not contain all the inputs the adult model needs, so no model score is shown for them.",
    "fm.note_demo_adolescent":
      "The adolescent model is for ages 12–17 only. The demo child cases are younger, so it is never applied to them.",
    "fm.method_adult": "Test set, as reported by the developers.",
    "fm.method_adolescent":
      "Internal repeated cross-validation (5 folds, 5 repeats). Not an independent test. Metrics were carried over from an earlier evaluation.",
    "fm.target_adult":
      "Elevated HbA1c (6.5% or higher) among adults with no reported previous diabetes diagnosis. A research flag, not a diagnosis.",
    "fm.target_adolescent":
      "Elevated HbA1c (5.7% or higher) among adolescents with no reported previous diabetes diagnosis. A screening-range label, not a diabetes diagnosis.",
    "fm.rule_adult": "Flag when the score is {x} or higher (a research threshold).",
    "fm.rule_adolescent": "Software default class decision. No clinically selected threshold exists.",
  },
  ar: {
    "fm.tab.adult": "نموذج البالغين (18–80)",
    "fm.tab.adolescent": "نموذج المراهقين (12–17)",
    "fm.banner":
      "هذه نماذج بحثية تجريبية جرى تدريبها على بيانات NHANES الأمريكية. وهي تعمل كخدمات منفصلة ولم تُستخدم بعد على الحالات في هذا التطبيق، لذلك لا تُعرض أي درجة من النموذج لأي حالة.",
    "fm.version": "إصدار النموذج",
    "fm.eval_data": "بيانات التقييم",
    "fm.eval_method": "طريقة التقييم",
    "fm.eval_date": "تاريخ التقييم",
    "fm.target": "ما الذي يتنبأ به",
    "fm.rule": "قاعدة القرار",
    "fm.records": "عدد السجلات المقيَّمة",
    "fm.positives": "الحالات الإيجابية",
    "fm.small": "عدد الحالات الإيجابية صغير، لذلك فإن هذه التقديرات غير مؤكدة.",
    "fm.metrics": "الأداء المُبلَّغ عنه",
    "fm.roc_hint": "قيمة ROC-AUC البالغة 0.5 تعني أداءً لا يفوق المصادفة.",
    "fm.calib_value": "غير معايَر",
    "fm.calib_note": "يذكر المطورون أن الدرجة غير مثبتة بوصفها احتمال خطر معايَرًا.",
    "fm.cm_tn": "لم تتم الإشارة إليهم وكان ذلك صحيحًا",
    "fm.cm_fp": "أُشير إليهم خطأً (إيجابيات كاذبة)",
    "fm.cm_fn": "فاتهم النموذج (سلبيات كاذبة)",
    "fm.cm_tp": "أُشير إليهم وكان ذلك صحيحًا",
    "fm.read_fp": "من بين كل 100 شخص ليس لديهم النتيجة، أُشير إلى نحو {x} منهم خطأً.",
    "fm.read_fn": "من بين كل 100 شخص لديهم النتيجة، فاتَ النموذج نحو {x} منهم.",
    "fm.subgroup_na":
      "لم تُقدَّم نتائج حسب الجنس أو الفئة العمرية أو الأصل الإثني، لذلك لا يمكن تقييم العدالة بين المجموعات. وستُحجب أي مجموعة يقل عدد أفرادها عن 10.",
    "fm.missing_na":
      "لم تُقدَّم معدلات القيم المفقودة. ويملأ خط المعالجة الفراغات بقيم شائعة (الوسيط أو الأكثر تكرارًا)، وهذا قد يُخفي نقص البيانات.",
    "fm.lim_dev": "القيود التي ذكرها مطورو النموذج",
    "fm.lim_ours": "ملاحظات إضافية لهذا التطبيق",
    "fm.note_us":
      "جرى التدريب والاختبار على بيانات NHANES الأمريكية للفترة 2021–2023 فقط. ولم يُثبَت الأداء في أبوظبي أو غيرها من المجتمعات.",
    "fm.note_inputs":
      "يستخدم نموذج البالغين العِرق/الأصل الإثني ونسبة الدخل إلى خط الفقر مدخلاتٍ، وفق فئات أمريكية. ولم يُقيَّم مدى ملاءمة استخدامها هنا، ويجب ألا تُستبدل أو تُختلق.",
    "fm.note_demo_adult":
      "الحالات التجريبية في هذا التطبيق لا تحتوي على جميع المدخلات التي يحتاجها نموذج البالغين، لذلك لا تُعرض لها أي درجة من النموذج.",
    "fm.note_demo_adolescent":
      "نموذج المراهقين مخصص للأعمار 12–17 فقط. والحالات التجريبية للأطفال أصغر سنًا، لذلك لا يُطبَّق عليها إطلاقًا.",
    "fm.method_adult": "مجموعة اختبار، كما أبلغ المطورون.",
    "fm.method_adolescent":
      "تحقق متقاطع داخلي متكرر (5 طيّات، 5 تكرارات). وليس اختبارًا مستقلًا. وقد نُقلت المقاييس من تقييم سابق.",
    "fm.target_adult":
      "ارتفاع HbA1c (6.5% أو أعلى) لدى البالغين الذين لم يُبلغوا عن تشخيص سابق بالسكري. إشارة بحثية وليست تشخيصًا.",
    "fm.target_adolescent":
      "ارتفاع HbA1c (5.7% أو أعلى) لدى المراهقين الذين لم يُبلغوا عن تشخيص سابق بالسكري. تصنيف ضمن نطاق الفحص وليس تشخيصًا بالسكري.",
    "fm.rule_adult": "تُوضع إشارة عندما تبلغ الدرجة {x} أو أكثر (عتبة بحثية).",
    "fm.rule_adolescent": "قرار الفئة الافتراضي في البرمجيات. ولا توجد عتبة مختارة سريريًا.",
  },
};

export function useT16() {
  const { lang } = useLang();
  const base = useT15();
  return (key: string) => extra[lang][key] ?? base(key);
}
