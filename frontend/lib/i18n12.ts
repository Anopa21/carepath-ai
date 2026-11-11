import { useLang } from "@/components/LanguageProvider";
import { useT11 } from "@/lib/i18n11";

const extra: Record<"en" | "ar", Record<string, string>> = {
  en: {
    "cons.title": "Communication and consent",
    "cons.synthetic": "Synthetic demo preferences.",
    "cons.status": "Consent to be contacted",
    "cons.status.not_recorded": "Not recorded",
    "cons.status.consented": "Consented",
    "cons.status.declined": "Declined",
    "cons.language": "Preferred language",
    "cons.lang.ar": "Arabic",
    "cons.lang.en": "English",
    "cons.channel": "Preferred channel",
    "cons.channel.sms": "SMS",
    "cons.channel.email": "Email",
    "cons.channel.phone": "Phone call",
    "cons.channel.none": "No contact",
    "cons.save": "Save preferences",
    "cons.saved": "Preferences saved.",
    "cons.note.declined":
      "This person has declined outreach. No reminders or invitations should be sent. Their right to decline is respected.",
    "cons.note.not_recorded":
      "Consent has not been recorded. No messages should be sent until the person's consent is recorded.",
    "cons.note.consented":
      "Consent recorded. Messages can be previewed on the demo Engagement page. Nothing is actually sent.",
    "cons.readonly": "Only the demo clinician can edit these preferences.",
    "cons.updated_by": "Last updated by",
  },
  ar: {
    "cons.title": "التواصل والموافقة",
    "cons.synthetic": "تفضيلات تجريبية اصطناعية.",
    "cons.status": "الموافقة على التواصل",
    "cons.status.not_recorded": "غير مسجّلة",
    "cons.status.consented": "موافق",
    "cons.status.declined": "رافض",
    "cons.language": "اللغة المفضلة",
    "cons.lang.ar": "العربية",
    "cons.lang.en": "الإنجليزية",
    "cons.channel": "قناة التواصل المفضلة",
    "cons.channel.sms": "رسالة نصية",
    "cons.channel.email": "بريد إلكتروني",
    "cons.channel.phone": "مكالمة هاتفية",
    "cons.channel.none": "لا تواصل",
    "cons.save": "حفظ التفضيلات",
    "cons.saved": "تم حفظ التفضيلات.",
    "cons.note.declined":
      "رفض هذا الشخص التواصل. يجب عدم إرسال أي تذكيرات أو دعوات. ويُحترم حقه في الرفض.",
    "cons.note.not_recorded":
      "لم تُسجَّل الموافقة بعد. يجب عدم إرسال أي رسائل قبل تسجيل موافقة الشخص.",
    "cons.note.consented":
      "تم تسجيل الموافقة. يمكن معاينة الرسائل في صفحة التواصل التجريبية، ولا يُرسل أي شيء فعليًا.",
    "cons.readonly": "يمكن للطبيب التجريبي فقط تعديل هذه التفضيلات.",
    "cons.updated_by": "آخر تحديث بواسطة",
  },
};

export function useT12() {
  const { lang } = useLang();
  const base = useT11();
  return (key: string) => extra[lang][key] ?? base(key);
}
