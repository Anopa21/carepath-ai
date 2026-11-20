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
import { useT15 } from "@/lib/i18n15";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

const STATUS_ORDER = [
  "identified",
  "awaiting_engagement",
  "appointment_recommended",
  "appointment_scheduled",
  "visit_completed",
  "follow_up_required",
  "closed",
];
const MEASURED = ["i1", "i2", "i3", "i4", "i5", "i6", "i7", "i8"];

type CellT = {
  key: string;
  value: number | null;
  suppressed: boolean;
  demo_below_threshold: boolean;
  origin: string;
};
type RowT = { key: string; cells: CellT[] };
type Cross = { data: RowT[] };
type Counts = { cells: CellT[] };

const zero = (key: string): CellT => ({
  key,
  value: 0,
  suppressed: false,
  demo_below_threshold: false,
  origin: "synthetic",
});

export default function Outcomes() {
  const t = useT15();
  const [cross, setCross] = useState<Cross | null>(null);
  const [byStatus, setByStatus] = useState<Counts | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/stats/crosstab?rows=population_group&cols=status`).then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      }),
      fetch(`${API}/stats/counts?by=status`).then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      }),
    ])
      .then(([c, s]) => {
        setCross(c);
        setByStatus(s);
        setError(false);
      })
      .catch(() => setError(true));
  }, []);

  const childLabel = t("out.children");
  const adultLabel = t("out.adults");

  const crossCell = (group: string, status: string): CellT =>
    cross?.data.find((r) => r.key === group)?.cells.find((c) => c.key === status) ?? zero(status);
  const statusCell = (status: string): CellT =>
    byStatus?.cells.find((c) => c.key === status) ?? zero(status);

  const chartData = STATUS_ORDER.map((s) => {
    const child = crossCell("child", s);
    const adult = crossCell("adult", s);
    return {
      name: t(`status.${s}`),
      [childLabel]: child.suppressed ? null : child.value,
      [adultLabel]: adult.suppressed ? null : adult.value,
    };
  });

  const hidden: string[] = [];
  let demoSmall = false;
  if (cross) {
    STATUS_ORDER.forEach((s) =>
      ["child", "adult"].forEach((g) => {
        const c = crossCell(g, s);
        if (c.suppressed) hidden.push(`${g === "child" ? childLabel : adultLabel} · ${t(`status.${s}`)}`);
        if (c.demo_below_threshold) demoSmall = true;
      })
    );
  }

  const simulated = [
    { key: "out.s1", cell: crossCell("child", "visit_completed") },
    { key: "out.s2", cell: crossCell("adult", "visit_completed") },
    { key: "out.s3", cell: statusCell("follow_up_required") },
    { key: "out.s4", cell: statusCell("closed") },
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
            {simulated.map(({ key, cell }) => (
              <div key={key} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-500">{t(key)}</p>
                {cell.suppressed ? (
                  <>
                    <p className="mt-2 text-xl font-semibold text-slate-400">{t("supp.suppressed")}</p>
                    <p className="mt-1 text-[11px] text-slate-500">{t("supp.reason")}</p>
                  </>
                ) : (
                  <>
                    <p className="mt-2 text-3xl font-semibold text-[#0b2545]">{cell.value}</p>
                    {cell.demo_below_threshold && (
                      <p className="mt-1 rounded bg-amber-50 px-2 py-0.5 text-[11px] text-amber-700">
                        {t("supp.demo")}
                      </p>
                    )}
                    <p className="mt-1 text-[11px] text-amber-700">{t("out.sim_label")}</p>
                  </>
                )}
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
                  <Bar dataKey={childLabel} fill="#0b2545" radius={[6, 6, 0, 0]} />
                  <Bar dataKey={adultLabel} fill="#14b8a6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {hidden.length > 0 && (
              <div className="mt-2 rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
                <p>{t("supp.reason")}</p>
                <ul className="mt-1 list-disc ps-5">
                  {hidden.map((h) => (
                    <li key={h}>
                      {h}: {t("supp.suppressed")}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {demoSmall && (
              <p className="mt-2 rounded bg-amber-50 px-2 py-1 text-xs text-amber-700">
                {t("supp.demo")}
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

