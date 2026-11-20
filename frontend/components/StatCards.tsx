"use client";

import { useEffect, useState } from "react";
import { useT15 } from "@/lib/i18n15";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

type Cell = {
  key: string;
  value: number | null;
  suppressed: boolean;
  demo_below_threshold: boolean;
  origin: string;
};
type Counts = { threshold: number; total: Cell; cells: Cell[] };

async function load(by: string): Promise<Counts> {
  const r = await fetch(`${API}/stats/counts?by=${by}`);
  if (!r.ok) throw new Error();
  return r.json();
}

const zero = (key: string): Cell => ({
  key,
  value: 0,
  suppressed: false,
  demo_below_threshold: false,
  origin: "synthetic",
});

export default function StatCards({ version }: { version?: unknown }) {
  const t = useT15();
  const [data, setData] = useState<{ g: Counts; p: Counts; s: Counts } | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    Promise.all([load("population_group"), load("priority"), load("status")])
      .then(([g, p, s]) => {
        setData({ g, p, s });
        setErr(false);
      })
      .catch(() => setErr(true));
  }, [version]);

  const find = (c: Counts, key: string): Cell => c.cells.find((x) => x.key === key) ?? zero(key);

  const cards = data
    ? [
        { k: "stat.total", cell: data.g.total },
        { k: "stat.children", cell: find(data.g, "child") },
        { k: "stat.adults", cell: find(data.g, "adult") },
        { k: "stat.high", cell: find(data.p, "high") },
        { k: "stat.followup", cell: find(data.s, "follow_up_required") },
      ]
    : [];

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
      {err && <p className="col-span-full text-sm text-red-700">{t("error.api")}</p>}
      {!err && !data && <p className="col-span-full text-sm text-slate-500">{t("hist.loading")}</p>}
      {cards.map(({ k, cell }) => (
        <div key={k} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs uppercase tracking-wide text-slate-500">{t(k)}</p>
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
              {cell.origin === "synthetic" && (
                <p className="mt-1 text-[11px] text-teal-700">{t("label.synthetic")}</p>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

