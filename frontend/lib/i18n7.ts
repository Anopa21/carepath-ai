import { useLang } from "@/components/LanguageProvider";
import { useT6 } from "@/lib/i18n6";

const extra: Record<"en" | "ar", Record<string, string>> = {
  en: {
    "eng.title": "Personalised Engagement",
    "eng.subtitle": "Preview bilingual preventive-care messages",
    "eng.demo_label": "Demo preview only. ",
    "eng.demo_text":
      "No messages are sent from this page. A real messaging integration would require authorisation, recorded consent and respect for each person's communication preferences and right to decline.",
    "eng.audience": "Audience",
    "eng.aud.caregiver": "Parent / caregiver",
    "eng.aud.adult": "Adult",
    "eng.type": "Message type",
    "eng.type.invitation": "Screening invitation",
    "eng.type.reminder": "Appointment reminder",
    "eng.type.follow_up": "Follow-up reminder",
    "eng.msg_lang": "Message language",
    "eng.preview": "Message preview",
    "eng.not_sent": "Not sent",
    "eng.footnote":
      "Placeholders such as [Name] and [date] would be filled in from the case record. Arabic wording should be reviewed by a native Arabic-speaking health communicator before any real use.",
  },
  ar: {
    "eng.title": "التواصل المخصّص",
    "eng.subtitle": "معاينة رسائل الرعاية الوقائية بلغتين",
    "eng.demo_label": "معاينة تجريبية فقط. ",
    "eng.demo_text":
      "لا يتم إرسال أي رسائل من هذه الصفحة. ويتطلب أي ربط حقيقي بخدمة المراسلة ترخيصًا وموافقة مسجّلة واحترام تفضيلات التواصل لكل شخص وحقه في الرفض.",
    "eng.audience": "الفئة المستهدفة",
    "eng.aud.caregiver": "ولي الأمر / مقدّم الرعاية",
    "eng.aud.adult": "بالغ",
    "eng.type": "نوع الرسالة",
    "eng.type.invitation": "دعوة للفحص",
    "eng.type.reminder": "تذكير بالموعد",
    "eng.type.follow_up": "تذكير بالمتابعة",
    "eng.msg_lang": "لغة الرسالة",
    "eng.preview": "معاينة الرسالة",
    "eng.not_sent": "لم تُرسل",
    "eng.footnote":
      "سيتم تعبئة الحقول مثل [الاسم] و[التاريخ] من سجل الحالة. ويجب أن يراجع صياغة العربية متخصص في التواصل الصحي من الناطقين بالعربية قبل أي استخدام حقيقي.",
  },
};

export function useT7() {
  const { lang } = useLang();
  const base = useT6();
  return (key: string) => extra[lang][key] ?? base(key);
}
