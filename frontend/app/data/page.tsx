"use client";

import { useEffect, useState } from "react";
import { useT14 } from "@/lib/i18n14";
import RegistrySection from "@/components/RegistrySection";

const API = "http://127.0.0.1:8000";

const PIPELINES = ["child", "adult"];

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="font-semibold text-[#0b2545]">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function DataModels() {
  const t = useT14();
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`${API}/model-status`)
      .then((r) => r.json())
      .then((d) => setConnected(Boolean(d.adult_model_connected)))
      .catch(() => {});
  }, []);

  const dt = "text-xs uppercase tracking-wide text-slate-500";

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold text-[#0b2545]">{t("data.title")}</h1>
        <p className="mt-1 text-slate-600">{t("data.subtitle")}</p>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {t("data.notice")}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {PIPELINES.map((p) => (
            <Card key={p} title={t(`data.${p}_name`)}>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className={dt}>{t("data.population")}</dt>
                  <dd>{t(`data.${p}_pop`)}</dd>
                </div>
                <div>
                  <dt className={dt}>{t("data.model")}</dt>
                  <dd>{t(`data.${p}_model`)}</dd>
                </div>
                <div>
                  <dt className={dt}>{t("data.logic")}</dt>
                  <dd>{t(`data.${p}_logic`)}</dd>
                </div>
                <div>
                  <dt className={dt}>{t("data.status")}</dt>
                  <dd>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {t("data.not_connected")}
                    </span>
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-xs text-slate-500">{t(`data.${p}_note`)}</p>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <Card title={t("data.integration")}>
            {connected !== null && (
              <p className="mb-4 text-sm">
                <span className="font-semibold">{t("data.api_status")}</span>
                {connected ? t("model.connected") : t("model.not_connected")}
              </p>
            )}
            <p className="text-sm text-slate-600">{t("data.integration_text")}</p>
            <ul className="mt-3 list-disc space-y-2 ps-5 text-sm text-slate-600">
              <li>
                <span className="font-medium">{t("data.way_api")}</span>
                {t("data.way_api_text")}
              </li>
              <li>
                <span className="font-medium">{t("data.way_file")}</span>
                {t("data.way_file_text")}
              </li>
            </ul>
          </Card>
        </div>

        <div className="mt-6">
          <RegistrySection />
        </div>
      </div>
    </main>
  );
}
