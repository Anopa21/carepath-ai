"use client";

import { useEffect, useState } from "react";
import { useT13 } from "@/lib/i18n13";
import { useLang } from "@/components/LanguageProvider";
import CaseHistoryPanel from "@/components/CaseHistoryPanel";
import IndicatorChips from "@/components/IndicatorChips";

const API = "http://127.0.0.1:8000";

type CaseRow = {
  id: number;
  person_ref: string;
  population_group: string;
  flag_type: string;
  flag_reason: string;
  flag_reason_ar?: string | null;
  details_json?: string | null;
  pathway: string;
  priority: string;
  status: string;
  follow_up_date: string;
};

const priorityStyle: Record<string, string> = {
  high: "bg-red-50 text-red-700",
  medium: "bg-amber-50 text-amber-700",
  routine: "bg-slate-100 text-slate-600",
};

export default function ChildPathway() {
  const t = useT13();
  const { lang } = useLang();
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<CaseRow | null>(null);

  useEffect(() => {
    fetch(`${API}/cases`)
      .then((r) => r.json())
      .then((d) => setCases(d.cases.filter((c: CaseRow) => c.population_group === "child")))
      .catch(() => setError(true));
  }, []);

  const label = "mt-3 text-xs uppercase tracking-wide text-slate-500";

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold text-[#0b2545]">{t("page.child.title")}</h1>
        <p className="mt-1 text-slate-600">{t("page.child.subtitle")}</p>

        <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
          {t("child.notice")}
        </div>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span className="font-semibold">{t("logic.label")}</span>
          {t("child.logic")}
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {t("error.api")}
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {cases.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelected(c)}
              className="cursor-pointer rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:ring-teal-300"
            >
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

              <p className={label}>{t("field.flag_type")}</p>
              <p>{t(`flag.${c.flag_type}`)}</p>

              <p className={label}>{t("field.reason_demo")}</p>
              <p className="text-sm text-slate-700">
                {lang === "ar" && c.flag_reason_ar ? c.flag_reason_ar : c.flag_reason}
              </p>

              <p className={label}>{t("det.indicators")}</p>
              <div className="mt-1">
                <IndicatorChips detailsJson={c.details_json} />
              </div>

              <p className={label}>{t("field.pathway")}</p>
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
              <p className="mt-3 text-xs text-teal-700 underline decoration-dotted underline-offset-4">
                {t("hist.title")}
              </p>
            </div>
          ))}
        </div>
      </div>
      {selected && <CaseHistoryPanel c={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}
