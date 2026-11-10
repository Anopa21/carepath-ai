"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useT2 } from "@/lib/i18n2";

const API = "http://127.0.0.1:8000";
const NAVY = "#0b2545";
const TEAL = "#14b8a6";

type CaseRow = {
  id: number;
  population_group: string;
  flag_type: string;
  priority: string;
  status: string;
};

function countBy(rows: CaseRow[], key: keyof CaseRow) {
  const map: Record<string, number> = {};
  rows.forEach((r) => {
    const k = String(r[key]);
    map[k] = (map[k] || 0) + 1;
  });
  return Object.entries(map).map(([k, value]) => ({ key: k, value }));
}

export default function Dashboard() {
  const t = useT2();
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API}/cases`)
      .then((r) => r.json())
      .then((d) => setCases(d.cases))
      .catch(() => setError(true));
  }, []);

  const byStatus = countBy(cases, "status").map((d) => ({
    name: t(`status.${d.key}`),
    value: d.value,
  }));
  const byFlag = countBy(cases, "flag_type").map((d) => ({
    name: t(`flag.${d.key}`),
    value: d.value,
  }));
  const pieColors = [NAVY, TEAL, "#94a3b8"];

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold text-[#0b2545]">{t("dash.title")}</h1>
        <p className="mt-1 text-slate-600">{t("dash.subtitle")}</p>

        <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
          {t("dash.notice")}
        </div>
        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {t("error.api")}
          </div>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="font-semibold text-[#0b2545]">{t("dash.chart_status")}</h2>
            <div className="mt-4 h-72" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byStatus} margin={{ bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} fontSize={11} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill={TEAL} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="font-semibold text-[#0b2545]">{t("dash.chart_flag")}</h2>
            <div className="mt-4 h-72" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byFlag} dataKey="value" nameKey="name" outerRadius={90} label>
                    {byFlag.map((_, i) => (
                      <Cell key={i} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-600">
              {byFlag.map((f, i) => (
                <span key={f.name} className="flex items-center gap-1">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ background: pieColors[i % pieColors.length] }}
                  />
                  {f.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["dash.child_pop", "dash.adult_pop", "dash.coverage"].map((k) => (
            <div key={k} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-wide text-slate-500">{t(k)}</p>
              <p className="mt-2 text-lg font-semibold text-slate-400">{t("common.na")}</p>
              <p className="mt-1 text-[11px] text-slate-500">{t("dash.no_dataset")}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

