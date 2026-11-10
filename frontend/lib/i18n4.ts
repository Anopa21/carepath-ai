import { useLang } from "@/components/LanguageProvider";
import { useT3 } from "@/lib/i18n3";

const extra: Record<"en" | "ar", Record<string, string>> = {
  en: {
    "data.title": "Data & Models Centre",
    "data.subtitle": "Dataset registry, model versions and integration status",
    "data.notice":
      "No verified dataset or trained model is registered yet. Values are shown as \"Not available\" rather than estimated.",
    "data.population": "Population",
    "data.model": "Model",
    "data.logic": "Current logic",
    "data.status": "Integration status",
    "data.not_connected": "Not connected",
    "data.child_name": "Child pipeline",
    "data.child_pop": "Children",
    "data.child_model": "No child-specific predictive model",
    "data.child_logic": "Rule-based demonstration logic only",
    "data.child_note":
      "Adult models must never be applied to children. Adolescent survey data must not be presented as representing infants or toddlers.",
    "data.adult_name": "Adult pipeline",
    "data.adult_pop": "Adults",
    "data.adult_model": "Adult risk model (developed separately in Python / Google Colab)",
    "data.adult_logic": "Waiting for model connection",
    "data.adult_note":
      "Model outputs will be shown only after the real model is connected and evaluated.",
    "data.integration": "Model integration",
    "data.api_status": "API status: ",
    "data.integration_text":
      "The adult model is being developed separately. It can be connected in one of two ways without changing this website:",
    "data.way_api": "API: ",
    "data.way_api_text":
      "the model runs as its own service and this platform sends it a request.",
    "data.way_file": "Exported artefact: ",
    "data.way_file_text":
      "the model is saved as a file (for example a joblib file) and loaded by the backend.",
    "data.model_version": "Model version",
    "data.eval_date": "Evaluation date",
    "data.train_dataset": "Training dataset",
    "data.na": "Not available",
    "data.registry": "Dataset registry",
    "data.empty": "No verified datasets registered yet.",
    "data.registry_note":
      "Each dataset will be listed with its publisher, source link, licence or access conditions, and a verified record count before it is used in any chart or model.",
    "data.col.name": "Dataset name",
    "data.col.publisher": "Publisher",
    "data.col.coverage": "Coverage",
    "data.col.population": "Population",
    "data.col.year": "Year",
    "data.col.format": "Format",
    "data.col.link": "Source link",
    "data.col.licence": "Licence",
    "data.col.records": "Records",
    "data.col.missing": "Missing values",
  },
  ar: {
    "data.title": "مركز البيانات والنماذج",
    "data.subtitle": "سجل مجموعات البيانات وإصدارات النماذج وحالة الربط",
    "data.notice":
      "لم يتم تسجيل أي مجموعة بيانات موثّقة أو نموذج مدرَّب بعد. تُعرض القيم على أنها \"غير متوفرة\" بدلًا من تقديرها.",
    "data.population": "الفئة السكانية",
    "data.model": "النموذج",
    "data.logic": "المنطق الحالي",
    "data.status": "حالة الربط",
    "data.not_connected": "غير متصل",
    "data.child_name": "مسار بيانات الأطفال",
    "data.child_pop": "الأطفال",
    "data.child_model": "لا يوجد نموذج تنبؤي خاص بالأطفال",
    "data.child_logic": "منطق تجريبي قائم على القواعد فقط",
    "data.child_note":
      "يجب ألا تُطبَّق نماذج البالغين على الأطفال إطلاقًا. ولا يجوز تقديم بيانات مسوح المراهقين على أنها تمثل الرضّع أو الأطفال الصغار.",
    "data.adult_name": "مسار بيانات البالغين",
    "data.adult_pop": "البالغون",
    "data.adult_model": "نموذج خطر البالغين (يجري تطويره بشكل منفصل باستخدام Python / Google Colab)",
    "data.adult_logic": "بانتظار ربط النموذج",
    "data.adult_note":
      "لن تُعرض مخرجات النموذج إلا بعد ربط النموذج الحقيقي وتقييمه.",
    "data.integration": "ربط النموذج",
    "data.api_status": "حالة الواجهة البرمجية: ",
    "data.integration_text":
      "يجري تطوير نموذج البالغين بشكل منفصل. ويمكن ربطه بإحدى طريقتين دون تغيير هذا الموقع:",
    "data.way_api": "واجهة برمجية: ",
    "data.way_api_text":
      "يعمل النموذج كخدمة مستقلة وترسل إليه هذه المنصة طلبًا.",
    "data.way_file": "ملف نموذج مُصدَّر: ",
    "data.way_file_text":
      "يُحفظ النموذج كملف (مثل ملف joblib) ويحمّله الخادم الخلفي.",
    "data.model_version": "إصدار النموذج",
    "data.eval_date": "تاريخ التقييم",
    "data.train_dataset": "مجموعة بيانات التدريب",
    "data.na": "غير متوفر",
    "data.registry": "سجل مجموعات البيانات",
    "data.empty": "لا توجد مجموعات بيانات موثّقة مسجّلة بعد.",
    "data.registry_note":
      "ستُدرج كل مجموعة بيانات مع الجهة الناشرة ورابط المصدر وشروط الترخيص أو الاستخدام وعدد سجلات موثّق قبل استخدامها في أي مخطط أو نموذج.",
    "data.col.name": "اسم مجموعة البيانات",
    "data.col.publisher": "الجهة الناشرة",
    "data.col.coverage": "التغطية",
    "data.col.population": "الفئة السكانية",
    "data.col.year": "السنة",
    "data.col.format": "الصيغة",
    "data.col.link": "رابط المصدر",
    "data.col.licence": "الترخيص",
    "data.col.records": "عدد السجلات",
    "data.col.missing": "القيم المفقودة",
  },
};

export function useT4() {
  const { lang } = useLang();
  const base = useT3();
  return (key: string) => extra[lang][key] ?? base(key);
}
