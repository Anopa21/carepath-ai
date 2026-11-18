"use client";

import { useEffect, useState } from "react";
import { useT18 } from "@/lib/i18n18";
import RegistrySection from "@/components/RegistrySection";

const API = "http://127.0.0.1:8000";

type Svc = "checking" | "up" | "down";

const PIPELINES: { key: string; url: string | null }[] = [
  { key: "child", url: null },
  { key: "adolescent", url: "http://127.0.0.1:8002/health" },
  { key: "adult", url: "http://127.0.0.1:8001/health" },
];

async function ping(url: string): Promise<Svc> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 3000);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    if (!r.ok) return "down";
    const d = await r.json();
    return d.status === "ok" && d.model_loaded === true ? "up" : "down";
  } catch {
    return "down";
  } finally {
    clearTimeout(timer);
  }
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="font-semibold text-[#0b2545]">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function DataModels() {
  const t = useT18();
  const [svc, setSvc] = useState<Record<string, Svc>>({ adolescent: "checking", adult: "checking" });
  const [connected, setConnected] = useState<boolean | null>(null);

  function check() {
    setSvc({ adolescent: "checking", adult: "checking" });
    PIPELINES.forEach((p) => {
      if (p.url) ping(p.url).then((s) => setSvc((prev) => ({ ...prev, [p.key]: s })));
    });
  }

  useEffect(() => {
    check();
    fetch(`${API}/model-status`)
      .then((r) => r.json())
      .then((d) => setConnected(Boolean(d.adult_model_connected)))
      .catch(() => {});
  }, []);

  const dt = "text-xs uppercase tracking-wide text-slate-500";
  const chip = (s: Svc | "none") =>
    s === "up"
      ? "bg-teal-50 text-teal-700"
      : s === "down"
        ? "bg-amber-50 text-amber-700"
        : "bg-slate-100 text-slate-600";
  const chipText = (s: Svc | "none") =>
    s === "up" ? t("dm.running") : s === "down" ? t("dm.down") : s === "checking" ? t("dm.checking") : t("dm.none");

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold text-[#0b2545]">{t("data.title")}</h1>
        <p className="mt-1 text-slate-600">{t("data.subtitle")}</p>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {t("dm.notice")}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {PIPELINES.map((p) => {
            const s: Svc | "none" = p.url ? svc[p.key] : "none";
            return (
              <Card key={p.key} title={t(`dm.${p.key}_name`)}>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className={dt}>{t("data.population")}</dt>
                    <dd>{t(`dm.${p.key}_pop`)}</dd>
                  </div>
                  <div>
                    <dt className={dt}>{t("data.model")}</dt>
                    <dd>{t(`dm.${p.key}_model`)}</dd>
                  </div>
                  <div>
                    <dt className={dt}>{t("dm.dataset")}</dt>
                    <dd>{p.url ? t(`dm.${p.key}_data`) : t("dm.na_short")}</dd>
                  </div>
                  <div>
                    <dt className={dt}>{t("data.logic")}</dt>
                    <dd>{t(`dm.${p.key}_logic`)}</dd>
                  </div>
                  <div>
                    <dt className={dt}>{t("dm.service")}</dt>
                    <dd>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${chip(s)}`}>
                        {chipText(s)}
                      </span>
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 text-xs text-slate-500">
                  {p.key === "child" ? t("data.child_note") : t(`dm.${p.key}_note`)}
                </p>
              </Card>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <button
            onClick={check}
            className="rounded-lg bg-white px-3 py-1.5 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            {t("dm.recheck")}
          </button>
          <span>{t("dm.running_note")}</span>
          <span dir="ltr">{t("dm.start_hint")}</span>
        </div>

        <div className="mt-6">
          <Card title={t("dm.why_title")}>
            <ul className="list-disc space-y-2 ps-5 text-sm text-slate-700">
              {["dm.why1", "dm.why2", "dm.why3"].map((k) => (
                <li key={k}>{t(k)}</li>
              ))}
            </ul>
            {connected !== null && (
              <p className="mt-4 text-sm">
                <span className="font-semibold">{t("data.api_status")}</span>
                {connected ? t("model.connected") : t("model.not_connected")}
              </p>
            )}
          </Card>
        </div>

        <div className="mt-6">
          <RegistrySection />
        </div>
      </div>
    </main>
  );
}
