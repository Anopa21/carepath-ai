"use client";

import { useEffect, useState } from "react";
import { useT21 } from "@/lib/i18n21";
import { MODELS_ONLINE } from "@/lib/live";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const ADULT_API = process.env.NEXT_PUBLIC_ADULT_API ?? "http://127.0.0.1:8001";
const ADOL_API = process.env.NEXT_PUBLIC_ADOLESCENT_API ?? "http://127.0.0.1:8002";

type Form = {
  age: string;
  sex: string;
  prevDx: string;
  bmi: string;
  weight: string;
  waist: string;
  income: string;
  ethnicity: string;
  bp20: string;
  bp80: string;
  sbp: string;
  dbp: string;
  bmic: string;
};

const EMPTY: Form = {
  age: "", sex: "", prevDx: "", bmi: "", weight: "", waist: "", income: "",
  ethnicity: "", bp20: "", bp80: "", sbp: "", dbp: "", bmic: "",
};

// Synthetic software-test values supplied by the ML team. Not a real person.
const EXAMPLE_ADULT: Form = {
  age: "45", sex: "2", prevDx: "no", bmi: "28.5", weight: "75", waist: "95", income: "2.5",
  ethnicity: "3", bp20: "2", bp80: "2", sbp: "", dbp: "", bmic: "",
};
const EXAMPLE_ADOL: Form = {
  age: "15", sex: "2", prevDx: "no", bmi: "", weight: "", waist: "80", income: "",
  ethnicity: "", bp20: "", bp80: "", sbp: "110", dbp: "70", bmic: "3",
};

type Group = "adult" | "adolescent" | "under12" | "over80" | "none";

function groupFor(age: string): Group {
  if (age.trim() === "") return "none";
  const n = Number(age);
  if (!Number.isInteger(n) || n < 0) return "none";
  if (n < 12) return "under12";
  if (n <= 17) return "adolescent";
  if (n <= 80) return "adult";
  return "over80";
}

type Result = {
  group: "adult" | "adolescent";
  eligible: boolean;
  flagged: boolean;
  score: number | null;
  threshold: number | null;
};

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="text-xs uppercase tracking-wide text-slate-500">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && <span className="mt-1 block text-[11px] text-slate-400">{hint}</span>}
    </div>
  );
}

export default function Screening() {
  const t = useT21();
  const [form, setForm] = useState<Form>(EMPTY);
  const [result, setResult] = useState<Result | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [svcError, setSvcError] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [prec, setPrec] = useState<{ adult: number | null; adolescent: number | null }>({
    adult: null,
    adolescent: null,
  });

  const group = groupFor(form.age);
  const modelGroup = group === "adult" || group === "adolescent";
  const diagYes = form.prevDx === "yes";

  useEffect(() => {
    fetch(`${API}/models/metadata`)
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => {
        if (!m) return;
        const a = m.adult?.test_metrics?.precision;
        const b = m.adolescent?.evaluation?.overall_oof_metrics?.precision;
        setPrec({
          adult: typeof a === "number" ? a : null,
          adolescent: typeof b === "number" ? b : null,
        });
      })
      .catch(() => {});
  }, []);

  function set(key: keyof Form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setResult(null);
  }

  function validate(): string[] {
    const errs: string[] = [];
    const need = (v: string, label: string) => {
      if (v.trim() === "") errs.push(t("scr.err_required").replace("{f}", label));
    };
    const range = (v: string, label: string, min: number, max: number) => {
      if (v.trim() === "") return;
      const n = Number(v);
      if (!Number.isFinite(n) || n < min || n > max) {
        errs.push(
          t("scr.err_range").replace("{f}", label).replace("{min}", String(min)).replace("{max}", String(max))
        );
      }
    };
    need(form.prevDx, t("scr.prev_dx"));
    if (diagYes) return errs;
    need(form.sex, t("scr.sex"));
    if (group === "adult") {
      need(form.ethnicity, t("scr.ethnicity"));
      range(form.bmi, t("scr.bmi"), 10, 80);
      range(form.weight, t("scr.weight"), 20, 300);
      range(form.waist, t("scr.waist"), 40, 200);
      range(form.income, t("scr.income"), 0, 5);
    }
    if (group === "adolescent") {
      range(form.waist, t("scr.waist"), 40, 200);
      range(form.sbp, t("scr.sbp"), 60, 250);
      range(form.dbp, t("scr.dbp"), 30, 150);
    }
    return errs;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setSvcError(false);
    setApiError(false);
    const errs = validate();
    setErrors(errs);
    if (errs.length > 0) return;
    if (group !== "adult" && group !== "adolescent") return;

    if (diagYes) {
      setResult({ group, eligible: false, flagged: false, score: null, threshold: null });
      return;
    }

    const num = (v: string) => (v.trim() === "" ? null : Number(v));
    const code = (v: string) => (v === "" ? null : Number(v));
    const payload =
      group === "adult"
        ? {
            RIDAGEYR: Number(form.age),
            BMXBMI: num(form.bmi),
            BMXWT: num(form.weight),
            BMXWAIST: num(form.waist),
            INDFMPIR: num(form.income),
            RIAGENDR: Number(form.sex),
            RIDRETH1: Number(form.ethnicity),
            BPQ020: code(form.bp20),
            BPQ080: code(form.bp80),
            previous_diabetes_diagnosis: false,
          }
        : {
            RIDAGEYR: Number(form.age),
            BMXWAIST: num(form.waist),
            BPXOSY1: num(form.sbp),
            BPXODI1: num(form.dbp),
            RIAGENDR: Number(form.sex),
            BMDBMIC: num(form.bmic),
            previous_diabetes_diagnosis: false,
          };

    setBusy(true);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    try {
      const res = await fetch(`${group === "adult" ? ADULT_API : ADOL_API}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
      const d = await res.json().catch(() => null);
      if (!res.ok || !d) {
        setApiError(true);
        return;
      }
      if (d.prediction_generated === false || d.eligible_for_this_prototype === false) {
        setResult({ group, eligible: false, flagged: false, score: null, threshold: null });
      } else {
        setResult({
          group,
          eligible: true,
          flagged: d.prototype_prediction === "elevated_hba1c_screen_flag",
          score: typeof d.model_score === "number" ? d.model_score : null,
          threshold: typeof d.research_threshold === "number" ? d.research_threshold : null,
        });
      }
    } catch {
      setSvcError(true);
    } finally {
      clearTimeout(timer);
      setBusy(false);
    }
  }

  function clearAll() {
    setForm(EMPTY);
    setResult(null);
    setErrors([]);
    setSvcError(false);
    setApiError(false);
  }

  function useExample() {
    setForm(group === "adolescent" ? EXAMPLE_ADOL : EXAMPLE_ADULT);
    setResult(null);
    setErrors([]);
  }

  const precision = result && result.eligible ? prec[result.group] : null;

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold text-[#0b2545]">{t("scr.title")}</h1>
        <p className="mt-1 text-slate-600">{t("scr.subtitle")}</p>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {t("scr.banner")}
        </div>
        <div className="mt-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
          {t("scr.privacy")}
        </div>

        {!MODELS_ONLINE && (<div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{t("live.screening")}</div>)}
        <form onSubmit={submit} className="mt-6 space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={t("scr.age")}>
              <input
                type="number"
                inputMode="numeric"
                step="1"
                min="0"
                max="120"
                dir="ltr"
                aria-label={t("scr.age")}
                className={inputCls}
                value={form.age}
                onChange={(e) => set("age", e.target.value)}
              />
            </Field>
            <Field label={t("scr.prev_dx")}>
              <div className="flex gap-6 pt-2">
                {["yes", "no"].map((v) => (
                  <label key={v} className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="prevDx"
                      value={v}
                      checked={form.prevDx === v}
                      onChange={() => set("prevDx", v)}
                    />
                    {t(`scr.${v}`)}
                  </label>
                ))}
              </div>
            </Field>
          </div>

          {group === "none" && <p className="text-sm text-slate-500">{t("scr.enter_age")}</p>}
          {group === "under12" && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{t("scr.under12")}</p>
          )}
          {group === "over80" && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{t("scr.over80")}</p>
          )}
          {modelGroup && (
            <p className="text-sm text-slate-600">
              <span className="font-semibold">{t("scr.model_used")}: </span>
              {t(`fm.tab.${group}`)}
            </p>
          )}

          {modelGroup && !diagYes && (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label={t("scr.sex")}>
                <select
                  aria-label={t("scr.sex")}
                  className={inputCls}
                  value={form.sex}
                  onChange={(e) => set("sex", e.target.value)}
                >
                  <option value="">{t("scr.eth.placeholder")}</option>
                  <option value="1">{t("scr.sex.1")}</option>
                  <option value="2">{t("scr.sex.2")}</option>
                </select>
              </Field>

              {group === "adult" && (
                <>
                  <Field label={`${t("scr.bmi")} (${t("scr.optional")})`}>
                    <input type="number" step="any" dir="ltr" aria-label={t("scr.bmi")} className={inputCls}
                      value={form.bmi} onChange={(e) => set("bmi", e.target.value)} />
                  </Field>
                  <Field label={`${t("scr.weight")} (${t("scr.optional")})`}>
                    <input type="number" step="any" dir="ltr" aria-label={t("scr.weight")} className={inputCls}
                      value={form.weight} onChange={(e) => set("weight", e.target.value)} />
                  </Field>
                  <Field label={`${t("scr.waist")} (${t("scr.optional")})`}>
                    <input type="number" step="any" dir="ltr" aria-label={t("scr.waist")} className={inputCls}
                      value={form.waist} onChange={(e) => set("waist", e.target.value)} />
                  </Field>
                  <Field label={`${t("scr.income")} (${t("scr.optional")})`} hint={t("scr.income_hint")}>
                    <input type="number" step="any" min="0" max="5" dir="ltr" aria-label={t("scr.income")}
                      className={inputCls} value={form.income} onChange={(e) => set("income", e.target.value)} />
                  </Field>
                  <Field label={t("scr.ethnicity")} hint={t("scr.eth_note")}>
                    <select aria-label={t("scr.ethnicity")} className={inputCls} value={form.ethnicity}
                      onChange={(e) => set("ethnicity", e.target.value)}>
                      <option value="">{t("scr.eth.placeholder")}</option>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={String(n)}>{t(`scr.eth.${n}`)}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label={`${t("scr.bp20")} (${t("scr.optional")})`}>
                    <select aria-label={t("scr.bp20")} className={inputCls} value={form.bp20}
                      onChange={(e) => set("bp20", e.target.value)}>
                      <option value="">{t("scr.unsure")}</option>
                      <option value="1">{t("scr.yes")}</option>
                      <option value="2">{t("scr.no")}</option>
                    </select>
                  </Field>
                  <Field label={`${t("scr.bp80")} (${t("scr.optional")})`}>
                    <select aria-label={t("scr.bp80")} className={inputCls} value={form.bp80}
                      onChange={(e) => set("bp80", e.target.value)}>
                      <option value="">{t("scr.unsure")}</option>
                      <option value="1">{t("scr.yes")}</option>
                      <option value="2">{t("scr.no")}</option>
                    </select>
                  </Field>
                </>
              )}

              {group === "adolescent" && (
                <>
                  <Field label={`${t("scr.waist")} (${t("scr.optional")})`}>
                    <input type="number" step="any" dir="ltr" aria-label={t("scr.waist")} className={inputCls}
                      value={form.waist} onChange={(e) => set("waist", e.target.value)} />
                  </Field>
                  <Field label={`${t("scr.sbp")} (${t("scr.optional")})`}>
                    <input type="number" step="any" dir="ltr" aria-label={t("scr.sbp")} className={inputCls}
                      value={form.sbp} onChange={(e) => set("sbp", e.target.value)} />
                  </Field>
                  <Field label={`${t("scr.dbp")} (${t("scr.optional")})`}>
                    <input type="number" step="any" dir="ltr" aria-label={t("scr.dbp")} className={inputCls}
                      value={form.dbp} onChange={(e) => set("dbp", e.target.value)} />
                  </Field>
                  <Field label={`${t("scr.bmic")} (${t("scr.optional")})`}>
                    <select aria-label={t("scr.bmic")} className={inputCls} value={form.bmic}
                      onChange={(e) => set("bmic", e.target.value)}>
                      <option value="">{t("scr.bmic.none")}</option>
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={String(n)}>{t(`scr.bmic.${n}`)}</option>
                      ))}
                    </select>
                  </Field>
                </>
              )}
            </div>
          )}

          {errors.length > 0 && (
            <ul className="list-disc space-y-1 rounded-lg bg-red-50 px-3 py-2 ps-7 text-sm text-red-700">
              {errors.map((er) => (
                <li key={er}>{er}</li>
              ))}
            </ul>
          )}
          {svcError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{t("scr.err_service")}</p>
          )}
          {apiError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{t("scr.err_api")}</p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={busy || !modelGroup || !MODELS_ONLINE}
              className="rounded-lg bg-[#0b2545] px-4 py-2 text-sm text-white hover:bg-[#12335f] disabled:opacity-50"
            >
              {busy ? t("scr.checking") : t("scr.check")}
            </button>
            <button
              type="button"
              onClick={useExample}
              className="rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              {t("scr.example")}
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              {t("scr.clear")}
            </button>
          </div>
          <p className="text-xs text-slate-500">{t("scr.example_note")}</p>
        </form>

        {result && (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="font-semibold text-[#0b2545]">{t("scr.res_title")}</h2>
            <p className="mt-1 text-xs text-slate-500">{t(`fm.tab.${result.group}`)}</p>

            {!result.eligible ? (
              <p className="mt-4 rounded-lg bg-amber-50 px-3 py-3 text-sm text-amber-800">
                {t("scr.res_ineligible")}
              </p>
            ) : (
              <>
                <p
                  className={`mt-4 rounded-lg px-3 py-3 text-sm ${
                    result.flagged ? "bg-amber-50 text-amber-800" : "bg-slate-50 text-slate-700"
                  }`}
                >
                  {result.flagged ? t("scr.res_flag") : t("scr.res_noflag")}
                </p>
                <dl className="mt-4 space-y-3 text-sm">
                  {result.score !== null && (
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">{t("scr.res_score")}</dt>
                      <dd className="text-2xl font-semibold text-[#0b2545]">
                        <bdi>{result.score.toFixed(4)}</bdi>
                      </dd>
                      <dd className="text-xs text-slate-500">{t("scr.res_not_cal")}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-slate-500">{t("scr.res_target")}</dt>
                    <dd>{t(result.group === "adult" ? "fm.target_adult" : "fm.target_adolescent")}</dd>
                  </div>
                  <div>
                    <dd className="text-slate-600">
                      {result.group === "adult" && result.threshold !== null
                        ? t("scr.res_rule_adult").replace("{x}", String(result.threshold))
                        : t("scr.res_rule_adol")}
                    </dd>
                  </div>
                  {precision !== null && (
                    <div>
                      <dd className="rounded-lg bg-slate-50 px-3 py-2 text-slate-700">
                        {t("scr.res_precision").replace("{x}", String(Math.round(precision * 100)))}
                      </dd>
                    </div>
                  )}
                </dl>
              </>
            )}
            <p className="mt-4 text-sm font-medium text-slate-700">{t("scr.res_next")}</p>
          </div>
        )}
      </div>
    </main>
  );
}




