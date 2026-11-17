import { useLang } from "@/components/LanguageProvider";
import { useT16 } from "@/lib/i18n16";

const extra: Record<"en" | "ar", Record<string, string>> = {
  en: {
    "fm.note_cohort_adolescent":
      "In the wider group of adolescents with an HbA1c measurement, 50 had HbA1c between 5.7% and below 6.5%, and none were at or above 6.5%. After the modelling eligibility criteria were applied, 47 of the 704 eligible participants were classified as elevated (the figure shown on this page). The two numbers describe different groups. This was explained by the model developers.",
  },
  ar: {
    "fm.note_cohort_adolescent":
      "في المجموعة الأوسع من المراهقين الذين تتوفر لديهم قياسات HbA1c، كان لدى 50 مشاركًا مستوى HbA1c بين 5.7% وأقل من 6.5%، ولم يكن أي منهم عند 6.5% أو أعلى. وبعد تطبيق معايير الأهلية الخاصة بالنمذجة، صُنِّف 47 من أصل 704 مشاركين مؤهلين على أن لديهم ارتفاعًا (وهو الرقم المعروض في هذه الصفحة). والرقمان يصفان مجموعتين مختلفتين. وقد أوضح ذلك مطورو النموذج.",
  },
};

export function useT17() {
  const { lang } = useLang();
  const base = useT16();
  return (key: string) => extra[lang][key] ?? base(key);
}
