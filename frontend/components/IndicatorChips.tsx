"use client";

import { useT13 } from "@/lib/i18n13";

type Indicator = { k: string; v: string | number | null; u?: string; hi?: boolean };
type Details = { completeness?: number | null; indicators?: Indicator[] };

export default function IndicatorChips({ detailsJson }: { detailsJson?: string | null }) {
  const t = useT13();

  let d: Details | null = null;
  try {
    d = detailsJson ? JSON.parse(detailsJson) : null;
  } catch {
    d = null;
  }

  if (!d || !d.indicators || d.indicators.length === 0) {
    return <p className="text-sm text-slate-400">{t("det.none")}</p>;
  }

  const unit = (u?: string) => {
    if (!u) return "";
    const x = t(`unit.${u}`);
    return x.startsWith("unit.") ? u : x;
  };

  const text = (i: Indicator) => {
    if (i.v === null || i.v === undefined) return t("common.na");
    if (i.k === "sex") return t(`sex.${i.v}`);
    return String(i.v) + (i.u ? " " + unit(i.u) : "");
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {d.indicators.map((i) => (
          <div key={i.k} className="rounded-lg bg-slate-50 p-2 ring-1 ring-slate-100">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">{t(`ind.${i.k}`)}</p>
            <p
              className={`text-sm font-medium ${
                i.v === null || i.v === undefined ? "text-slate-400" : "text-slate-800"
              }`}
            >
              <bdi>{text(i)}</bdi>
            </p>
            {i.hi && (
              <span className="mt-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700">
                {t("det.above")}
              </span>
            )}
          </div>
        ))}
      </div>
      {typeof d.completeness === "number" && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{t("det.completeness")}</span>
            <bdi>{d.completeness}%</bdi>
          </div>
          <div className="mt-1 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-teal-400" style={{ width: `${d.completeness}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
