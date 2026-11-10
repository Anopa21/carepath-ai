"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { useLang } from "@/components/LanguageProvider";

const API = "http://127.0.0.1:8000";

type CaseRow = {
  id: number;
  person_ref: string;
  population_group: string;
  flag_type: string;
  flag_reason: string;
  flag_reason_ar?: string | null;
  pathway: string;
  priority: string;
  status: string;
  follow_up_date: string;
};

type ModelStatus = {
  adult_model_connected: boolean;
};

const priorityStyle: Record<string, string> = {
  high: "bg-red-50 text-red-700",
  medium: "bg-amber-50 text-amber-700",
  routine: "bg-slate-100 text-slate-600",
};

export default function AdultPathway() {
  const t = useT();
  const { lang } = useLang();
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [model, setModel] = useState<ModelStatus | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API}/cases`)
      .then((r) => r.json())
      .then((d) =>
        setCases(d.cases.filter((c: CaseRow) => c.population_group === "adult"))
      )
      .catch(() => setError(true));

    fetch(`${API}/model-status`)
      .then((r) => r.json())
      .then(setModel)
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold text-[#0b2545]">{t("page.adult.title")}</h1>
        <p className="mt-1 text-slate-600">{t("page.adult.subtitle")}</p>

        <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
          {t("notice.synthetic")}
        </div>

        {model && (
          <div
            className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
              model.adult_model_connected
                ? "border-teal-200 bg-teal-50 text-teal-800"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            <span className="font-semibold">{t("model.label")}</span>
            {model.adult_model_connected ? t("model.connected") : t("model.not_connected")}{" "}
            {t("adult.demo_rules")}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {t("error.api")}
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {cases.map((c) => (
            <div key={c.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-[#0b2545]" dir="ltr">
                  {c.person_ref}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    priorityStyle[c.priority] ?? "bg-slate-100 text-slate-600"
                  }`}
                >
                  {t("col.priority")}: {t(`priority.${c.priority}`)}
                </span>
              </div>

              <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">
                {t("field.flag_type")}
              </p>
              <p>{t(`flag.${c.flag_type}`)}</p>

              <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">
                {t("field.reason")}
              </p>
              <p className="text-sm text-slate-700">{lang === "ar" && c.flag_reason_ar ? c.flag_reason_ar : c.flag_reason}</p>

              <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">
                {t("field.risk_score")}
              </p>
              <p className="text-sm font-medium text-slate-400">{t("adult.risk_na")}</p>

              <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">
                {t("field.pathway")}
              </p>
              <p>{t(`pathway.${c.pathway}`)}</p>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span>
                  {t("col.status")}:{" "}
                  <span className="font-medium text-teal-700">{t(`status.${c.status}`)}</span>
                </span>
                <span>
                  {t("col.followup")}: <span dir="ltr">{c.follow_up_date}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

