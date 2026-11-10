"use client";

import { useState } from "react";
import { useT7 } from "@/lib/i18n7";

type Audience = "caregiver" | "adult";
type Purpose = "invitation" | "reminder" | "follow_up";
type Lang = "en" | "ar";

const TEMPLATES: Record<Audience, Record<Purpose, Record<Lang, string>>> = {
  caregiver: {
    invitation: {
      en: "Dear parent/caregiver, your child is due for a Well-Child Visit. This is a routine check to support healthy growth and development. If you would like to book a visit, please contact your health centre. You are free to decline or to choose a time that suits you.",
      ar: "عزيزي ولي الأمر، حان موعد زيارة صحة الطفل الوقائية لطفلكم. وهي فحص روتيني لدعم نموه وتطوره الصحي. إذا رغبتم في حجز موعد، يرجى التواصل مع مركزكم الصحي. يمكنكم الاعتذار أو اختيار الوقت المناسب لكم.",
    },
    reminder: {
      en: "Dear parent/caregiver, this is a friendly reminder about your child's upcoming Well-Child Visit on [date]. If this time no longer suits you, please let us know and we will help you find another.",
      ar: "عزيزي ولي الأمر، نذكّركم بموعد زيارة صحة الطفل الوقائية القادمة بتاريخ [التاريخ]. إذا لم يعد الموعد مناسبًا، يرجى إبلاغنا لمساعدتكم في اختيار موعد آخر.",
    },
    follow_up: {
      en: "Dear parent/caregiver, thank you for attending your child's visit. A follow-up is suggested to continue supporting your child's health. You may contact your health centre whenever it suits you.",
      ar: "عزيزي ولي الأمر، نشكركم على حضور زيارة طفلكم. يُنصح بمتابعة لاحقة لمواصلة دعم صحته. يمكنكم التواصل مع مركزكم الصحي متى كان ذلك مناسبًا لكم.",
    },
  },
  adult: {
    invitation: {
      en: "Dear [Name], you are eligible for a Comprehensive Health Screening. It is a preventive check that helps detect health concerns early. Booking is optional and you may decline at any time.",
      ar: "عزيزي/عزيزتي [الاسم]، أنتم مؤهلون للفحص الصحي الشامل. وهو فحص وقائي يساعد على الكشف المبكر عن أي مشكلات صحية. الحجز اختياري ويمكنكم الاعتذار في أي وقت.",
    },
    reminder: {
      en: "Dear [Name], this is a reminder of your screening appointment on [date]. If you need to change it, please contact your health centre.",
      ar: "عزيزي/عزيزتي [الاسم]، نذكّركم بموعد الفحص الصحي بتاريخ [التاريخ]. إذا رغبتم في تغيير الموعد، يرجى التواصل مع مركزكم الصحي.",
    },
    follow_up: {
      en: "Dear [Name], thank you for completing your screening. A follow-up is recommended to review your results with a healthcare professional. Please contact your health centre to arrange this when it suits you.",
      ar: "عزيزي/عزيزتي [الاسم]، نشكركم على إتمام الفحص. يُنصح بموعد متابعة لمراجعة النتائج مع مختص صحي. يرجى التواصل مع مركزكم الصحي لترتيب ذلك في الوقت المناسب لكم.",
    },
  },
};

const LANGS: { value: Lang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ar", label: "العربية" },
];

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-full px-4 py-2 text-sm font-medium ring-1 transition ${
            value === o.value
              ? "bg-[#0b2545] text-white ring-[#0b2545]"
              : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function Engagement() {
  const t = useT7();
  const [audience, setAudience] = useState<Audience>("caregiver");
  const [purpose, setPurpose] = useState<Purpose>("invitation");
  const [msgLang, setMsgLang] = useState<Lang>("en");

  const audiences = [
    { value: "caregiver" as Audience, label: t("eng.aud.caregiver") },
    { value: "adult" as Audience, label: t("eng.aud.adult") },
  ];
  const purposes = [
    { value: "invitation" as Purpose, label: t("eng.type.invitation") },
    { value: "reminder" as Purpose, label: t("eng.type.reminder") },
    { value: "follow_up" as Purpose, label: t("eng.type.follow_up") },
  ];

  const text = TEMPLATES[audience][purpose][msgLang];

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold text-[#0b2545]">{t("eng.title")}</h1>
        <p className="mt-1 text-slate-600">{t("eng.subtitle")}</p>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span className="font-semibold">{t("eng.demo_label")}</span>
          {t("eng.demo_text")}
        </div>

        <div className="mt-6 space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">
              {t("eng.audience")}
            </p>
            <Segmented options={audiences} value={audience} onChange={setAudience} />
          </div>
          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">
              {t("eng.type")}
            </p>
            <Segmented options={purposes} value={purpose} onChange={setPurpose} />
          </div>
          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">
              {t("eng.msg_lang")}
            </p>
            <Segmented options={LANGS} value={msgLang} onChange={setMsgLang} />
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-slate-500">{t("eng.preview")}</p>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
              {t("eng.not_sent")}
            </span>
          </div>
          <div
            dir={msgLang === "ar" ? "rtl" : "ltr"}
            lang={msgLang}
            className={`mt-4 rounded-2xl bg-teal-50 p-5 text-slate-800 ring-1 ring-teal-100 ${
              msgLang === "ar" ? "text-lg leading-loose" : "leading-relaxed"
            }`}
          >
            {text}
          </div>
          <p className="mt-3 text-xs text-slate-500">{t("eng.footnote")}</p>
        </div>
      </div>
    </main>
  );
}

