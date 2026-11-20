import { useLang } from "@/components/LanguageProvider";
import { useT20 } from "@/lib/i18n20";

const extra: Record<"en" | "ar", Record<string, string>> = {
  en: {
    "live.not_hosted": "Not hosted in this live demo",
    "live.screening": "In this live demo the research models run on the project team's computer, so this form cannot return a result here. See the demo video for the Screening Check in action.",
  },
  ar: {
    "live.not_hosted": "غير مستضافة في هذا العرض المباشر",
    "live.screening": "في هذا العرض المباشر تعمل النماذج البحثية على جهاز فريق المشروع، لذلك لا يمكن لهذا النموذج إرجاع نتيجة هنا. شاهد فيديو العرض لرؤية الفحص الأولي أثناء العمل.",
  },
};

export function useT21() {
  const { lang } = useLang();
  const base = useT20();
  return (key: string) => extra[lang][key] ?? base(key);
}
