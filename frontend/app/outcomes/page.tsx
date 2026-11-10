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
import { useT5 } from "@/lib/i18n5";

const API = "http://127.0.0.1:8000";

const STATUS_ORDER = [
  "identified",
  "awaiting_engagement",
  "appointment_recommended",
  "appointment_scheduled",
  "visit_completed",
  "follow_up_required",
  "closed",
];

type CaseRow = {
  id: number;
  population_group: string;
  status: string;
};

const MEASURED = ["i1", "i2", "i3", "i4", "i5", "i6", "i7", "i8"];

export default function Outcomes() {
  const t = useT5();
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API}/cases`)
      .then((r) => r.json())
      .then((d) => setCases(d.cases))
      .catch(() => setError(true));
  }, []);

  const count = (group: string, status: string) =>
    cases.filter((c) => c.population_group === group && c.status === status).length;

  const chartData = STATUS_ORDER.map((s) => ({
    name: t(`status.${s}`),
    [t("out.children")]: count("child", s),
    [t("out.adults")]: count("adult", s),
  }));

  const simulated = [
    { key: "out.s1", value: count("child", "visit_completed") },
    { key: "out.s2", value: count("adult", "visit_completed") },
    { key: "out.s3", value: cases.filter((c) => c.status === "follow_up_required").length },
    { key: "out.s4", value: cases.filter((c) => c.status === "closed").length },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold text-[#0b2545]">{t("out.title")}</h1>
        <p className="mt-1 text-slate-600">{t("out.subtitle")}</p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {t("error.api")}
          </div>
        )}

        <section className="mt-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-[#0b2545]">{t("out.measured")}</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {t("out.real_badge")}
            </span>
          </div>
          <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            {t("out.measured_notice")}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {MEASURED.map((i) => (
              <div key={i} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-500">{t(`out.${i}`)}</p>
                <p className="mt-2 text-lg font-semibold text-slate-400">{t("out.na")}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-[#0b2545]">{t("out.simulated")}</h2>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              {t("out.sim_badge")}
            </span>
          </div>
          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {t("out.sim_notice")}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {simulated.map((s) => (
              <div key={s.key} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-500">{t(s.key)}</p>
                <p className="mt-2 text-3xl font-semibold text-[#0b2545]">{s.value}</p>
                <p className="mt-1 text-[11px] text-amber-700">{t("out.sim_label")}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="font-semibold text-[#0b2545]">{t("out.chart")}</h3>
            <div className="mt-4 h-80" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} fontSize={11} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend verticalAlign="top" />
                  <Bar dataKey={t("out.children")} fill="#0b2545" radius={[6, 6, 0, 0]} />
                  <Bar dataKey={t("out.adults")} fill="#14b8a6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

