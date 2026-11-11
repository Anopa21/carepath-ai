import { useLang } from "@/components/LanguageProvider";
import { useT12 } from "@/lib/i18n12";

const extra: Record<"en" | "ar", Record<string, string>> = {
  en: {
    "eng2.case": "Preview for a specific case",
    "eng2.generic": "No case (generic demo preview)",
    "eng2.blocked_declined":
      "Preview blocked. This person has declined outreach, so no invitations or reminders should be sent. Their right to decline is respected.",
    "eng2.blocked_not_recorded":
      "Preview blocked. Consent has not been recorded for this person. No messages should be sent until consent is recorded.",
    "eng2.using": "Using this person's recorded preferences:",
    "eng2.channel": "Channel",
  },
  ar: {
    "eng2.case": "معاينة لحالة محددة",
    "eng2.generic": "بدون حالة (معاينة تجريبية عامة)",
    "eng2.blocked_declined":
      "تم حجب المعاينة. رفض هذا الشخص التواصل، لذلك يجب عدم إرسال أي دعوات أو تذكيرات. ويُحترم حقه في الرفض.",
    "eng2.blocked_not_recorded":
      "تم حجب المعاينة. لم تُسجَّل موافقة هذا الشخص. يجب عدم إرسال أي رسائل قبل تسجيل الموافقة.",
    "eng2.using": "باستخدام التفضيلات المسجّلة لهذا الشخص:",
    "eng2.channel": "القناة",
  },
};

export function useT13() {
  const { lang } = useLang();
  const base = useT12();
  return (key: string) => extra[lang][key] ?? base(key);
}
