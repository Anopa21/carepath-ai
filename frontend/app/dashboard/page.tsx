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
import { useT15 } from "@/lib/i18n15";

const API = "http://127.0.0.1:8000";
const NAVY = "#0b2545";
const TEAL = "#14b8a6";
const PIE_COLORS = [NAVY, TEAL, "#94a3b8"];

type CellT = {
  key: string;
  value: number | null;
  suppressed: boolean;
  demo_below_threshold: boolean;
  origin: string;
};
type Counts = { cells: CellT[]; total: CellT };

async function load(by: string): Promise<Counts> {
  const r = await fetch(`${API}/stats/counts?by=${by}`);
  if (!r.ok) throw new Error();
  return r.json();
}

export default function Dashboard() {
  const t = useT15();
  const [status, setStatus] = useState<Counts | null>(null);
  const [flag, setFlag] = useState<Counts | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([load("status"), load("flag_type")])
      .then(([s, f]) => {
        setStatus(s);
        setFlag(f);
        setError(false);
      })
      .catch(() => setError(true));
  }, []);

  const statusCells = status?.cells ?? [];
  const flagCells = flag?.cells ?? [];

  const barData = statusCells.map((c) => ({
    name: c.suppressed
      ? `${t(`status.${c.key}`)} (${t("supp.suppressed")})`
      : t(`status.${c.key}`),
    value: c.suppressed ? null : c.value,
  }));

  const pieCells = flagCells.filter((c) => !c.suppressed && c.value !== null);
  const pieData = pieCells.map((c) => ({ name: t(`flag.${c.key}`), value: c.value as number }));

  const anySuppressed = [...statusCells, ...flagCells].some((c) => c.suppressed);
  const anyDemoSmall = [...statusCells, ...flagCells].some((c) => c.demo_below_threshold);

  const Notes = () => (
    <>
      {anySuppressed && (
        <p className="mt-2 rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
          {t("supp.reason")}
        </p>
      )}
      {anyDemoSmall && (
        <p className="mt-2 rounded bg-amber-50 px-2 py-1 text-xs text-amber-700">
          {t("supp.demo")}
        </p>
      )}
    </>
  );

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
                <BarChart data={barData} margin={{ bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} fontSize={11} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill={TEAL} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Notes />
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="font-semibold text-[#0b2545]">{t("dash.chart_flag")}</h2>
            {pieData.length === 0 && flag ? (
              <p className="mt-6 text-lg font-semibold text-slate-400">{t("supp.suppressed")}</p>
            ) : (
              <div className="mt-4 h-72" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-600">
              {flagCells.map((c, i) => (
                <span key={c.key} className="flex items-center gap-1">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ background: c.suppressed ? "#cbd5e1" : PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  {t(`flag.${c.key}`)}
                  {c.suppressed ? ` (${t("supp.suppressed")})` : ""}
                </span>
              ))}
            </div>
            <Notes />
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
