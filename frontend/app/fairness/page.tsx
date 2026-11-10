"use client";

import { useEffect, useState } from "react";
import { useT3 } from "@/lib/i18n3";

const API = "http://127.0.0.1:8000";

const METRICS = ["precision", "recall", "f1", "roc", "pr", "calib"];

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="font-semibold text-[#0b2545]">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function Fairness() {
  const t = useT3();
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`${API}/model-status`)
      .then((r) => r.json())
      .then((d) => setConnected(Boolean(d.adult_model_connected)))
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold text-[#0b2545]">{t("fair.title")}</h1>
        <p className="mt-1 text-slate-600">{t("fair.subtitle")}</p>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span className="font-semibold">{t("fair.important")}</span>
          {t("fair.important_text")}
        </div>

        {connected !== null && (
          <div
            className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
              connected
                ? "border-teal-200 bg-teal-50 text-teal-800"
                : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            <span className="font-semibold">{t("model.label")}</span>
            {connected ? t("model.connected") : t("model.not_connected")}
          </div>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {["fair.model_version", "fair.eval_date", "fair.eval_dataset"].map((k) => (
            <div key={k} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-wide text-slate-500">{t(k)}</p>
              <p className="mt-2 text-lg font-semibold text-slate-400">{t("fair.na")}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Card title={t("fair.metrics")}>
            <div className="grid gap-4 md:grid-cols-3">
              {METRICS.map((m) => (
                <div key={m} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
                  <p className="text-sm font-medium text-[#0b2545]">{t(`fair.${m}`)}</p>
                  <p className="mt-1 text-xl font-semibold text-slate-400">{t("fair.na")}</p>
                  <p className="mt-1 text-xs text-slate-500">{t(`fair.${m}_n`)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card title={t("fair.fpfn")}>
            <p className="text-lg font-semibold text-slate-400">{t("fair.na")}</p>
            <p className="mt-2 text-sm text-slate-600">{t("fair.fpfn_text")}</p>
          </Card>

          <Card title={t("fair.subgroup")}>
            <p className="text-lg font-semibold text-slate-400">{t("fair.na")}</p>
            <p className="mt-2 text-sm text-slate-600">{t("fair.subgroup_text")}</p>
          </Card>

          <Card title={t("fair.missing")}>
            <p className="text-lg font-semibold text-slate-400">{t("fair.na")}</p>
            <p className="mt-2 text-sm text-slate-600">{t("fair.missing_text")}</p>
          </Card>

          <Card title={t("fair.uncertainty")}>
            <ul className="list-disc space-y-2 ps-5 text-sm text-slate-600">
              {["fair.u1", "fair.u2", "fair.u3"].map((k) => (
                <li key={k}>{t(k)}</li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="mt-6">
          <Card title={t("fair.limits")}>
            <ul className="list-disc space-y-2 ps-5 text-sm text-slate-600">
              {["fair.l1", "fair.l2", "fair.l3", "fair.l4", "fair.l5"].map((k) => (
                <li key={k}>{t(k)}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </main>
  );
}

