"use client";

import { useEffect, useState } from "react";
import { useT17 } from "@/lib/i18n17";
import { useLang } from "@/components/LanguageProvider";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

type Metrics = {
  precision?: number;
  recall?: number;
  f1_score?: number;
  roc_auc?: number;
  pr_auc?: number;
  confusion_matrix?: number[][];
};
type AdultMeta = {
  version?: string;
  dataset?: string;
  threshold?: number;
  test_records?: number;
  positive_test_cases?: number;
  test_metrics?: Metrics;
  confusion_matrix?: number[][];
  limitations?: string[];
};
type AdolMeta = {
  version?: string;
  dataset?: string;
  training_records?: number;
  target_distribution?: { positive_5_7_or_higher?: number };
  evaluation?: { overall_oof_metrics?: Metrics };
  limitations?: string[];
};
type Meta = { adult?: AdultMeta | null; adolescent?: AdolMeta | null };

type View = {
  version: string;
  dataset: string;
  records: number | null;
  positives: number | null;
  metrics: Metrics;
  cm: number[][] | null;
  targetKey: string;
  methodKey: string;
  ruleKey: string;
  threshold?: number;
  limitations: string[];
  notes: string[];
};

const LIM_AR: Record<string, string> = {
  "Experimental research model": "نموذج بحثي تجريبي",
  "High false-positive rate": "معدل مرتفع للإيجابيات الكاذبة",
  "Not clinically validated": "لم يُتحقق منه سريريًا",
  "Not a diabetes diagnosis": "ليس تشخيصًا للسكري",
  "Requires external validation": "يتطلب تحققًا خارجيًا",
  "Experimental research prototype; not a clinical decision tool and not a diagnosis.":
    "نموذج بحثي أولي تجريبي؛ وليس أداة لاتخاذ القرارات السريرية وليس تشخيصًا.",
  "Discrimination is weak (reported ROC-AUC 0.5570); reported precision is low (0.0831).":
    "القدرة على التمييز ضعيفة (ROC-AUC المُبلَّغ عنه 0.5570)، والدقة المُبلَّغ عنها منخفضة (0.0831).",
  "Repeated cross-validation is internal resampling, not independent external validation.":
    "التحقق المتقاطع المتكرر هو إعادة أخذ عينات داخلية وليس تحققًا خارجيًا مستقلًا.",
  "Pipeline was fitted on all 704 records after CV for handoff; this full-cohort fit is not an independent test evaluation.":
    "جرى تدريب خط المعالجة على جميع السجلات الـ 704 بعد التحقق المتقاطع لأغراض التسليم؛ وهذا التدريب على كامل المجموعة ليس تقييمًا مستقلًا على بيانات اختبار.",
  "NHANES is a United States sample; performance and suitability in Malaysia, Abu Dhabi, or other populations have not been established.":
    "NHANES عينة من الولايات المتحدة؛ ولم يُثبَت الأداء أو الملاءمة في ماليزيا أو أبوظبي أو غيرها من المجتمعات.",
  "Scoped only to ages 12-17 and the stated six features; do not use for children under 12 or adults.":
    "يقتصر على الأعمار 12–17 والمتغيرات الستة المذكورة؛ ولا يُستخدم للأطفال دون 12 عامًا أو للبالغين.",
  "There were 50 participants with HbA1c 5.7% to below 6.5% and none at or above 6.5%; do not describe the positive target as adolescent diabetes.":
    "كان هناك 50 مشاركًا بمستوى HbA1c بين 5.7% وأقل من 6.5% ولم يكن أي منهم عند 6.5% أو أعلى؛ ولا يجوز وصف الهدف الإيجابي بأنه سكري المراهقين.",
};

function adultView(m?: AdultMeta | null): View | null {
  if (!m) return null;
  return {
    version: m.version ?? "",
    dataset: m.dataset ?? "",
    records: m.test_records ?? null,
    positives: m.positive_test_cases ?? null,
    metrics: m.test_metrics ?? {},
    cm: m.confusion_matrix ?? null,
    targetKey: "fm.target_adult",
    methodKey: "fm.method_adult",
    ruleKey: "fm.rule_adult",
    threshold: m.threshold,
    limitations: m.limitations ?? [],
    notes: ["fm.note_us", "fm.note_inputs", "fm.note_demo_adult"],
  };
}

function adolView(m?: AdolMeta | null): View | null {
  if (!m) return null;
  const oof = m.evaluation?.overall_oof_metrics ?? {};
  return {
    version: m.version ?? "",
    dataset: m.dataset ?? "",
    records: m.training_records ?? null,
    positives: m.target_distribution?.positive_5_7_or_higher ?? null,
    metrics: oof,
    cm: oof.confusion_matrix ?? null,
    targetKey: "fm.target_adolescent",
    methodKey: "fm.method_adolescent",
    ruleKey: "fm.rule_adolescent",
    limitations: m.limitations ?? [],
    notes: ["fm.note_us", "fm.note_cohort_adolescent", "fm.note_demo_adolescent"],
  };
}

const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : null);
const fmt = (v?: number) => (typeof v === "number" ? v.toFixed(4) : null);

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="font-semibold text-[#0b2545]">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

const METRICS: [string, keyof Metrics][] = [
  ["fair.precision", "precision"],
  ["fair.recall", "recall"],
  ["fair.f1", "f1_score"],
  ["fair.roc", "roc_auc"],
  ["fair.pr", "pr_auc"],
];

export default function Fairness() {
  const t = useT17();
  const { lang } = useLang();
  const [meta, setMeta] = useState<Meta | null>(null);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<"adult" | "adolescent">("adult");

  useEffect(() => {
    fetch(`${API}/models/metadata`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setMeta)
      .catch(() => setError(true));
    fetch(`${API}/model-status`)
      .then((r) => r.json())
      .then((d) => setConnected(Boolean(d.adult_model_connected)))
      .catch(() => {});
  }, []);

  const view = tab === "adult" ? adultView(meta?.adult) : adolView(meta?.adolescent);
  const cm = view?.cm ?? null;
  const [tn, fp, fn, tp] = cm ? [cm[0][0], cm[0][1], cm[1][0], cm[1][1]] : [0, 0, 0, 0];
  const fpr = cm ? pct(fp, fp + tn) : null;
  const fnr = cm ? pct(fn, fn + tp) : null;

  const na = t("fair.na");
  const label = "text-xs uppercase tracking-wide text-slate-500";

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold text-[#0b2545]">{t("fair.title")}</h1>
        <p className="mt-1 text-slate-600">{t("fair.subtitle")}</p>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span className="font-semibold">{t("fair.important")}</span>
          {t("fair.important_text")}
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          {t("fm.banner")}
        </div>

        {connected !== null && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <span className="font-semibold">{t("model.label")}</span>
            {connected ? t("model.connected") : t("model.not_connected")}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {t("error.api")}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {(["adult", "adolescent"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-full px-4 py-2 text-sm font-medium ring-1 transition ${
                tab === k
                  ? "bg-[#0b2545] text-white ring-[#0b2545]"
                  : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {t(`fm.tab.${k}`)}
            </button>
          ))}
        </div>

        {!view && !error && <p className="mt-6 text-slate-500">{meta ? na : t("hist.loading")}</p>}

        {view && (
          <div className="mt-6 space-y-6">
            <Card title={t("fm.version")}>
              <dl className="grid gap-4 text-sm md:grid-cols-2">
                <div>
                  <dt className={label}>{t("fm.version")}</dt>
                  <dd dir="ltr" className="text-start">{view.version || na}</dd>
                </div>
                <div>
                  <dt className={label}>{t("fm.eval_date")}</dt>
                  <dd className="text-slate-400">{na}</dd>
                </div>
                <div>
                  <dt className={label}>{t("fm.eval_data")}</dt>
                  <dd dir="ltr" className="text-start">{view.dataset || na}</dd>
                </div>
                <div>
                  <dt className={label}>{t("fm.eval_method")}</dt>
                  <dd>{t(view.methodKey)}</dd>
                </div>
                <div>
                  <dt className={label}>{t("fm.target")}</dt>
                  <dd>{t(view.targetKey)}</dd>
                </div>
                <div>
                  <dt className={label}>{t("fm.rule")}</dt>
                  <dd>
                    {t(view.ruleKey).replace("{x}", view.threshold !== undefined ? String(view.threshold) : "")}
                  </dd>
                </div>
                <div>
                  <dt className={label}>{t("fm.records")}</dt>
                  <dd>{view.records !== null ? <bdi>{view.records}</bdi> : na}</dd>
                </div>
                <div>
                  <dt className={label}>{t("fm.positives")}</dt>
                  <dd>{view.positives !== null ? <bdi>{view.positives}</bdi> : na}</dd>
                </div>
              </dl>
              {view.positives !== null && (
                <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{t("fm.small")}</p>
              )}
            </Card>

            <Card title={t("fm.metrics")}>
              <div className="grid gap-4 md:grid-cols-3">
                {METRICS.map(([k, key]) => {
                  const v = fmt(view.metrics[key] as number | undefined);
                  return (
                    <div key={k} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
                      <p className="text-sm font-medium text-[#0b2545]">{t(k)}</p>
                      <p className={`mt-1 text-xl font-semibold ${v ? "text-[#0b2545]" : "text-slate-400"}`}>
                        {v ? <bdi>{v}</bdi> : na}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{t(`${k}_n`)}</p>
                    </div>
                  );
                })}
                <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
                  <p className="text-sm font-medium text-[#0b2545]">{t("fair.calib")}</p>
                  <p className="mt-1 text-xl font-semibold text-slate-400">{t("fm.calib_value")}</p>
                  <p className="mt-1 text-xs text-slate-500">{t("fm.calib_note")}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">{t("fm.roc_hint")}</p>
            </Card>

            <Card title={t("fair.fpfn")}>
              {cm ? (
                <>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      ["fm.cm_tn", tn],
                      ["fm.cm_fp", fp],
                      ["fm.cm_fn", fn],
                      ["fm.cm_tp", tp],
                    ].map(([k, v]) => (
                      <div key={k as string} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
                        <p className="text-xs text-slate-500">{t(k as string)}</p>
                        <p className="mt-1 text-2xl font-semibold text-[#0b2545]">
                          <bdi>{v as number}</bdi>
                        </p>
                      </div>
                    ))}
                  </div>
                  <ul className="mt-4 list-disc space-y-1 ps-5 text-sm text-slate-700">
                    {fpr !== null && <li>{t("fm.read_fp").replace("{x}", String(fpr))}</li>}
                    {fnr !== null && <li>{t("fm.read_fn").replace("{x}", String(fnr))}</li>}
                  </ul>
                </>
              ) : (
                <p className="text-lg font-semibold text-slate-400">{na}</p>
              )}
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card title={t("fair.subgroup")}>
                <p className="text-lg font-semibold text-slate-400">{na}</p>
                <p className="mt-2 text-sm text-slate-600">{t("fm.subgroup_na")}</p>
              </Card>
              <Card title={t("fair.missing")}>
                <p className="text-lg font-semibold text-slate-400">{na}</p>
                <p className="mt-2 text-sm text-slate-600">{t("fm.missing_na")}</p>
              </Card>
            </div>

            <Card title={t("fm.lim_dev")}>
              <ul className="list-disc space-y-2 ps-5 text-sm text-slate-700">
                {view.limitations.map((l) => (
                  <li key={l}>{lang === "ar" && LIM_AR[l] ? LIM_AR[l] : l}</li>
                ))}
              </ul>
            </Card>

            <Card title={t("fm.lim_ours")}>
              <ul className="list-disc space-y-2 ps-5 text-sm text-slate-700">
                {view.notes.map((k) => (
                  <li key={k}>{t(k)}</li>
                ))}
              </ul>
            </Card>

            <Card title={t("fair.uncertainty")}>
              <ul className="list-disc space-y-2 ps-5 text-sm text-slate-600">
                {["fair.u1", "fair.u2", "fair.u3"].map((k) => (
                  <li key={k}>{t(k)}</li>
                ))}
              </ul>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}




