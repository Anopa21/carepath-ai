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
const NA_CARDS = ["c1", "c2", "c3", "c4"];

type CellT = {
  key: string;
  value: number | null;
  suppressed: boolean;
  demo_below_threshold: boolean;
  origin: string;
};
type RowT = { key: string; cells: CellT[] };
type Cross = { col_keys: string[]; data: RowT[] };

async function load(cols: string): Promise<Cross> {
  const r = await fetch(`${API}/stats/crosstab?rows=population_group&cols=${cols}`);
  if (!r.ok) throw new Error();
  return r.json();
}

function Notes({ hidden, demoSmall, t }: { hidden: string[]; demoSmall: boolean; t: (k: string) => string }) {
  return (
    <>
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
        <p className="mt-2 rounded bg-amber-50 px-2 py-1 text-xs text-amber-700">{t("supp.demo")}</p>
      )}
    </>
  );
}

export default function Community() {
  const t = useT15();
  const [flag, setFlag] = useState<Cross | null>(null);
  const [priority, setPriority] = useState<Cross | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([load("flag_type"), load("priority")])
      .then(([f, p]) => {
        setFlag(f);
        setPriority(p);
        setError(false);
      })
      .catch(() => setError(true));
  }, []);

  const childLabel = t("com.children");
  const adultLabel = t("com.adults");
  const groupLabel = (g: string) => (g === "child" ? childLabel : adultLabel);

  function build(cross: Cross | null, prefix: string) {
    if (!cross) return { chart: [] as Record<string, string | number | null>[], hidden: [] as string[], demoSmall: false };
    const chart = cross.col_keys.map((ck) => {
      const row: Record<string, string | number | null> = { name: t(`${prefix}.${ck}`) };
      cross.data.forEach((r) => {
        const cell = r.cells.find((c) => c.key === ck);
        row[groupLabel(r.key)] = cell && !cell.suppressed ? cell.value : null;
      });
      return row;
    });
    const hidden: string[] = [];
    let demoSmall = false;
    cross.data.forEach((r) =>
      r.cells.forEach((c) => {
        if (c.suppressed) hidden.push(`${groupLabel(r.key)} · ${t(`${prefix}.${c.key}`)}`);
        if (c.demo_below_threshold) demoSmall = true;
      })
    );
    return { chart, hidden, demoSmall };
  }

  const f = build(flag, "flag");
  const p = build(priority, "priority");

  const Chart = ({ data }: { data: Record<string, string | number | null>[] }) => (
    <div className="mt-4 h-72" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
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
  );

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
            <Chart data={f.chart} />
            <Notes hidden={f.hidden} demoSmall={f.demoSmall} t={t} />
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="font-semibold text-[#0b2545]">{t("com.chart_priority")}</h3>
            <Chart data={p.chart} />
            <Notes hidden={p.hidden} demoSmall={p.demoSmall} t={t} />
          </div>
        </div>
      </div>
    </main>
  );
}

