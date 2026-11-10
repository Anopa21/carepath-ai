"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useT6 } from "@/lib/i18n6";

const API = "http://127.0.0.1:8000";

type CaseRow = {
  id: number;
  population_group: string;
  flag_type: string;
  priority: string;
};

const NA_CARDS = ["c1", "c2", "c3", "c4"];

export default function Community() {
  const t = useT6();
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API}/cases`)
      .then((r) => r.json())
      .then((d) => setCases(d.cases))
      .catch(() => setError(true));
  }, []);

  const count = (group: string, key: "flag_type" | "priority", value: string) =>
    cases.filter((c) => c.population_group === group && c[key] === value).length;

  const childLabel = t("com.children");
  const adultLabel = t("com.adults");

  const flagData = ["elevated_risk", "unmet_preventive_care"].map((f) => ({
    name: t(`flag.${f}`),
    [childLabel]: count("child", "flag_type", f),
    [adultLabel]: count("adult", "flag_type", f),
  }));

  const priorityData = ["high", "medium", "routine"].map((p) => ({
    name: t(`priority.${p}`),
    [childLabel]: count("child", "priority", p),
    [adultLabel]: count("adult", "priority", p),
  }));

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold text-[#0b2545]">{t("com.title")}</h1>
        <p className="mt-1 text-slate-600">{t("com.subtitle")}</p>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span className="font-semibold">{t("com.privacy_label")}</span>
          {t("com.privacy_text")}
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {t("error.api")}
          </div>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {NA_CARDS.map((c) => (
            <div key={c} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="font-semibold text-[#0b2545]">{t(`com.${c}`)}</h2>
              <p className="mt-3 text-lg font-semibold text-slate-400">{t("com.na")}</p>
              <p className="mt-2 text-sm text-slate-600">{t(`com.${c}_text`)}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-3">
          <h2 className="text-xl font-semibold text-[#0b2545]">{t("com.compare")}</h2>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            {t("com.badge")}
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-600">{t("com.compare_note")}</p>

        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="font-semibold text-[#0b2545]">{t("com.chart_flag")}</h3>
            <div className="mt-4 h-72" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={flagData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend verticalAlign="top" />
                  <Bar dataKey={childLabel} fill="#0b2545" radius={[6, 6, 0, 0]} />
                  <Bar dataKey={adultLabel} fill="#14b8a6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="font-semibold text-[#0b2545]">{t("com.chart_priority")}</h3>
            <div className="mt-4 h-72" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend verticalAlign="top" />
                  <Bar dataKey={childLabel} fill="#0b2545" radius={[6, 6, 0, 0]} />
                  <Bar dataKey={adultLabel} fill="#14b8a6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

