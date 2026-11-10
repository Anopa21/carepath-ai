"use client";

import { useEffect, useState } from "react";
import { useT4 } from "@/lib/i18n4";

const API = "http://127.0.0.1:8000";

const COLUMNS = [
  "name",
  "publisher",
  "coverage",
  "population",
  "year",
  "format",
  "link",
  "licence",
  "records",
  "missing",
];

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
  const t = useT4();
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`${API}/model-status`)
      .then((r) => r.json())
      .then((d) => setConnected(Boolean(d.adult_model_connected)))
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
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
                  <dt className="text-xs uppercase tracking-wide text-slate-500">
                    {t("data.population")}
                  </dt>
                  <dd>{t(`data.${p}_pop`)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">
                    {t("data.model")}
                  </dt>
                  <dd>{t(`data.${p}_model`)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">
                    {t("data.logic")}
                  </dt>
                  <dd>{t(`data.${p}_logic`)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">
                    {t("data.status")}
                  </dt>
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
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {["data.model_version", "data.eval_date", "data.train_dataset"].map((k) => (
                <div key={k} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
                  <p className="text-xs uppercase tracking-wide text-slate-500">{t(k)}</p>
                  <p className="mt-1 font-semibold text-slate-400">{t("data.na")}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <Card title={t("data.registry")}>
            <div className="overflow-x-auto">
              <table className="w-full text-start text-sm">
                <thead className="bg-[#0b2545] text-white">
                  <tr>
                    {COLUMNS.map((c) => (
                      <th key={c} className="whitespace-nowrap px-4 py-3 text-start">
                        {t(`data.col.${c}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      colSpan={COLUMNS.length}
                      className="px-4 py-8 text-center text-slate-400"
                    >
                      {t("data.empty")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">{t("data.registry_note")}</p>
          </Card>
        </div>
      </div>
    </main>
  );
}
