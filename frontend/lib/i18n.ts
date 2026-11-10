import { useLang } from "@/components/LanguageProvider";

const dict: Record<"en" | "ar", Record<string, string>> = {
    en: {
        "home.subtitle": "Preventive Care Management",
        "notice.synthetic": "All records are synthetic demo data, not real patients.",
        "label.synthetic": "Synthetic demo data",
        "error.api": "Could not reach the API. Is the backend running?",
        "error.update": "Could not update the status. Please try again.",

        "stat.total": "Total cases",
        "stat.children": "Children",
        "stat.adults": "Adults",
        "stat.high": "High priority",
        "stat.followup": "Follow-up required",

        "col.reference": "Reference",
        "col.group": "Group",
        "col.flag": "Flag",
        "col.reason": "Reason",
        "col.priority": "Priority",
        "col.status": "Status",
        "col.followup": "Follow-up",

        "group.child": "Child",
        "group.adult": "Adult",

        "flag.elevated_risk": "Elevated risk",
        "flag.unmet_preventive_care": "Unmet preventive care",

        "priority.high": "High",
        "priority.medium": "Medium",
        "priority.routine": "Routine",

        "status.identified": "Identified",
        "status.awaiting_engagement": "Awaiting engagement",
        "status.appointment_recommended": "Appointment recommended",
        "status.appointment_scheduled": "Appointment scheduled",
        "status.visit_completed": "Visit completed",
        "status.follow_up_required": "Follow-up required",
        "status.closed": "Closed",

        "pathway.well_child_visit": "Well-Child Visit",
        "pathway.adult_comprehensive_screening": "Adult Comprehensive Screening",

        "field.flag_type": "Flag type",
        "field.reason": "Reason",
        "field.reason_demo": "Reason (rule-based demo)",
        "field.completeness": "Data completeness",
        "field.pathway": "Recommended pathway",
        "field.caregiver": "Parent / caregiver communication",
        "field.risk_score": "Model risk score",
        "common.na": "Data not available",

        "page.child.title": "Child Health Pathway",
        "page.child.subtitle": "Well-Child Visit cases",
        "child.notice": "All records are synthetic demo data, not real children.",
        "logic.label": "Logic used: ",
        "child.logic":
            "No child-specific predictive model is connected. Flags below come from clearly labelled rule-based demonstration logic. Adult risk models are never applied to children.",
        "child.comm_soon": "Preview coming in the Engagement section",

        "page.adult.title": "Adult Screening Pathway",
        "page.adult.subtitle": "Adult Comprehensive Screening cases",
        "model.label": "Model status: ",
        "model.not_connected": "No adult model connected. Risk scores are not shown.",
        "model.connected": "Model integration configured.",
        "adult.demo_rules": "Flags below come from simple demonstration rules, not a trained model.",
        "adult.risk_na": "Not available (no model connected)",
    },
    ar: {
        "home.subtitle": "إدارة الرعاية الوقائية",
        "notice.synthetic": "جميع السجلات بيانات تجريبية اصطناعية وليست لمرضى حقيقيين.",
        "label.synthetic": "بيانات تجريبية اصطناعية",
        "error.api": "تعذّر الوصول إلى الخادم. هل الخادم الخلفي يعمل؟",
        "error.update": "تعذّر تحديث الحالة. يرجى المحاولة مرة أخرى.",

        "stat.total": "إجمالي الحالات",
        "stat.children": "الأطفال",
        "stat.adults": "البالغون",
        "stat.high": "أولوية عالية",
        "stat.followup": "تتطلب متابعة",

        "col.reference": "المرجع",
        "col.group": "الفئة",
        "col.flag": "نوع التنبيه",
        "col.reason": "السبب",
        "col.priority": "الأولوية",
        "col.status": "الحالة",
        "col.followup": "المتابعة",

        "group.child": "طفل",
        "group.adult": "بالغ",

        "flag.elevated_risk": "خطر مرتفع",
        "flag.unmet_preventive_care": "رعاية وقائية غير مكتملة",

        "priority.high": "عالية",
        "priority.medium": "متوسطة",
        "priority.routine": "روتينية",

        "status.identified": "تم التحديد",
        "status.awaiting_engagement": "بانتظار التواصل",
        "status.appointment_recommended": "موعد موصى به",
        "status.appointment_scheduled": "تم حجز الموعد",
        "status.visit_completed": "تمت الزيارة",
        "status.follow_up_required": "المتابعة مطلوبة",
        "status.closed": "مغلقة",

        "pathway.well_child_visit": "زيارة صحة الطفل الوقائية",
        "pathway.adult_comprehensive_screening": "الفحص الصحي الشامل للبالغين",

        "field.flag_type": "نوع التنبيه",
        "field.reason": "السبب",
        "field.reason_demo": "السبب (منطق تجريبي قائم على القواعد)",
        "field.completeness": "اكتمال البيانات",
        "field.pathway": "المسار الموصى به",
        "field.caregiver": "التواصل مع ولي الأمر / مقدّم الرعاية",
        "field.risk_score": "درجة الخطر من النموذج",
        "common.na": "البيانات غير متوفرة",

        "page.child.title": "مسار صحة الطفل",
        "page.child.subtitle": "حالات زيارة صحة الطفل الوقائية",
        "child.notice": "جميع السجلات بيانات تجريبية اصطناعية وليست لأطفال حقيقيين.",
        "logic.label": "المنطق المستخدم: ",
        "child.logic":
            "لا يوجد نموذج تنبؤي خاص بالأطفال متصل حاليًا. التنبيهات أدناه مبنية على قواعد تجريبية موضّحة بوضوح. ولا تُطبَّق نماذج الخطر الخاصة بالبالغين على الأطفال إطلاقًا.",
        "child.comm_soon": "المعاينة ستتوفر في قسم التواصل",

        "page.adult.title": "مسار فحص البالغين",
        "page.adult.subtitle": "حالات الفحص الصحي الشامل للبالغين",
        "model.label": "حالة النموذج: ",
        "model.not_connected": "لا يوجد نموذج للبالغين متصل حاليًا. درجات الخطر غير معروضة.",
        "model.connected": "تم إعداد ربط النموذج.",
        "adult.demo_rules": "التنبيهات أدناه مبنية على قواعد تجريبية بسيطة وليست على نموذج مدرَّب.",
        "adult.risk_na": "غير متوفرة (لا يوجد نموذج متصل)",
    },
};

export function useT() {
    const { lang } = useLang();
    return (key: string) => dict[lang][key] ?? dict.en[key] ?? key;
}