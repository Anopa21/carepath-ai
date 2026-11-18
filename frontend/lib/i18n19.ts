import { useLang } from "@/components/LanguageProvider";
import { useT18 } from "@/lib/i18n18";

const extra: Record<"en" | "ar", Record<string, string>> = {
  en: {
    "dm.api_line": "This app does not call the model services, so no risk score is produced or shown for any case.",
  },
  ar: {
    "dm.api_line": "لا يستدعي هذا التطبيق خدمات النماذج، لذلك لا تُنتَج ولا تُعرض أي درجة خطر لأي حالة.",
  },
};

export function useT19() {
  const { lang } = useLang();
  const base = useT18();
  return (key: string) => extra[lang][key] ?? base(key);
}
