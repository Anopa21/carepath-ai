"use client";

import { useEffect, useState } from "react";
import { useT11 } from "@/lib/i18n11";
import { useLang } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";
import ConsentSection from "@/components/ConsentSection";

const API = "http://127.0.0.1:8000";

type CaseInfo = {
  id: number;
  person_ref: string;
  population_group?: string;
  flag_type: string;
  flag_reason: string;
  flag_reason_ar?: string | null;
  details_json?: string | null;
  pathway: string;
  priority: string;
  status: string;
  follow_up_date: string;
};

type Indicator = { k: string; v: string | number | null; u?: string; hi?: boolean };
type Details = {
  completeness?: number | null;
  indicators?: Indicator[];
  factors?: { en: string; ar: string }[];
};

type HistoryRow = {
  from_status: string | null;
  to_status: string;
  changed_by: string;
  changed_at: string | null;
};

function parseDetails(s?: string | null): Details | null {
  if (!s) return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function formatTime(iso: string | null, lang: string) {
  if (!iso) return "";
  const hasZone = iso.endsWith("Z") || /[+-]\d\d:\d\d$/.test(iso);
  const d = new Date(hasZone ? iso : iso + "Z");
  return d.toLocaleString(lang === "ar" ? "ar-u-nu-latn" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function CaseHistoryPanel({
  c,
  onClose,
}: {
  c: CaseInfo;
  onClose: () => void;
}) {
  const t = useT11();
  const { lang } = useLang();
  const { user, logout } = useAuth();
  const [rows, setRows] = useState<HistoryRow[] | null>(null);
  const [error, setError] = useState("");

  const details = parseDetails(c.details_json);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!user) return;
    setRows(null);
    setError("");
    fetch(`${API}/cases/${c.id}/history`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(async (r) => {
        if (r.status === 401) {
          logout();
          setError("auth.expired");
          return;
        }
        if (!r.ok) throw new Error();
        setRows(await r.json());
      })
      .catch(() => setError("hist.error"));
  }, [c.id, user]);

  const unitLabel = (u?: string) => {
    if (!u) return "";
    const x = t(`unit.${u}`);
    return x.startsWith("unit.") ? u : x;
  };

  const valueText = (i: Indicator) => {
    if (i.v === null || i.v === undefined) return t("common.na");
    if (i.k === "sex") return t(`sex.${i.v}`);
    return String(i.v) + (i.u ? " " + unitLabel(i.u) : "");
  };

  const newestFirst = rows ? [...rows].reverse() : [];
  const label = "text-xs uppercase tracking-wide text-slate-500";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={label}>{t("hist.title")}</p>
            <h2 className="text-xl font-semibold text-[#0b2545]" dir="ltr">
              {c.person_ref}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-3 py-1 text-sm text-slate-600 hover:bg-slate-200"
          >
            {t("hist.close")}
          </button>
        </div>

        <p className="mt-2 rounded-lg bg-teal-50 px-3 py-2 text-xs text-teal-800">
          {t("hist.synthetic")}
        </p>

        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className={label}>{t("col.flag")}</dt>
            <dd>{t(`flag.${c.flag_type}`)}</dd>
          </div>
          <div>
            <dt className={label}>{t("col.reason")}</dt>
            <dd className="text-slate-700">
              {lang === "ar" && c.flag_reason_ar ? c.flag_reason_ar : c.flag_reason}
            </dd>
          </div>
          <div>
            <dt className={label}>{t("field.pathway")}</dt>
            <dd>{t(`pathway.${c.pathway}`)}</dd>
          </div>
          <div className="flex gap-8">
            <div>
              <dt className={label}>{t("col.priority")}</dt>
              <dd>{t(`priority.${c.priority}`)}</dd>
            </div>
            <div>
              <dt className={label}>{t("col.followup")}</dt>
              <dd dir="ltr">{c.follow_up_date}</dd>
            </div>
          </div>
          <div>
            <dt className={label}>{t("hist.current")}</dt>
            <dd>
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                {t(`status.${c.status}`)}
              </span>
            </dd>
          </div>
        </dl>

        <h3 className="mt-6 font-semibold text-[#0b2545]">{t("det.indicators")}</h3>
        {!details || !details.indicators || details.indicators.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">{t("det.none")}</p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-3">
            {details.indicators.map((i) => (
              <div key={i.k} className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-100">
                <p className={label}>{t(`ind.${i.k}`)}</p>
                <p
                  className={`mt-1 text-sm font-medium ${
                    i.v === null || i.v === undefined ? "text-slate-400" : "text-slate-800"
                  }`}
                >
                  <bdi>{valueText(i)}</bdi>
                </p>
                {i.hi && (
                  <span className="mt-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[11px] text-amber-700">
                    {t("det.above")}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {details && typeof details.completeness === "number" && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{t("det.completeness")}</span>
              <bdi>{details.completeness}%</bdi>
            </div>
            <div className="mt-1 h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-teal-400"
                style={{ width: `${details.completeness}%` }}
              />
            </div>
          </div>
        )}

        {details && details.factors && details.factors.length > 0 && (
          <>
            <h3 className="mt-6 font-semibold text-[#0b2545]">{t("det.factors")}</h3>
            <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-slate-700">
              {details.factors.map((f, idx) => (
                <li key={idx}>{lang === "ar" ? f.ar : f.en}</li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {c.population_group === "child" ? (
            <p>{t("child.logic")}</p>
          ) : (
            <p>
              <span className="font-semibold">{t("field.risk_score")}: </span>
              {t("adult.risk_na")}
            </p>
          )}
        </div>

        <ConsentSection caseId={c.id} />

        <h3 className="mt-6 font-semibold text-[#0b2545]">{t("hist.history")}</h3>

        {!user && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {t("hist.signin")}
          </p>
        )}
        {user && error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{t(error)}</p>
        )}
        {user && !error && rows === null && (
          <p className="mt-3 text-sm text-slate-500">{t("hist.loading")}</p>
        )}
        {user && rows !== null && rows.length === 0 && (
          <div className="mt-3 text-sm text-slate-600">
            <p>{t("hist.empty")}</p>
            <p className="mt-1 text-xs text-slate-500">{t("hist.empty_note")}</p>
          </div>
        )}
        {user && rows !== null && rows.length > 0 && (
          <ol className="mt-3 space-y-3">
            {newestFirst.map((r, i) => (
              <li
                key={i}
                className="rounded-lg border-s-4 border-teal-300 bg-slate-50 p-3 text-sm"
              >
                <p className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs ring-1 ring-slate-200">
                    {r.from_status ? t(`status.${r.from_status}`) : "—"}
                  </span>
                  <span className="inline-block text-slate-400 rtl:rotate-180">→</span>
                  <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700">
                    {t(`status.${r.to_status}`)}
                  </span>
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {t("hist.by")} <span dir="ltr">{r.changed_by}</span> ·{" "}
                  {formatTime(r.changed_at, lang)}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}


