"use client";

import { useEffect, useState } from "react";
import { useT14 } from "@/lib/i18n14";
import { useAuth } from "./AuthProvider";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

type ModelRow = {
  id: number;
  name: string;
  version: string | null;
  population_group: string;
  model_type: string;
  status: string;
  evaluation_date: string | null;
  notes: string | null;
};

type DatasetRow = {
  id: number;
  name: string;
  publisher: string;
  country: string | null;
  coverage: string | null;
  population_group: string;
  collection_year: string | null;
  data_format: string | null;
  source_url: string;
  licence: string;
  record_count: number | null;
  missing_value_pct: number | null;
};

const EMPTY = {
  name: "",
  publisher: "",
  country: "",
  coverage: "",
  population_group: "adult",
  collection_year: "",
  data_format: "",
  source_url: "",
  licence: "",
  record_count: "",
  missing_value_pct: "",
};

const TEXT_FIELDS: [keyof typeof EMPTY, string][] = [
  ["name", "reg.ds.name"],
  ["publisher", "reg.ds.publisher"],
  ["country", "reg.ds.country"],
  ["coverage", "reg.ds.coverage"],
  ["collection_year", "reg.ds.year"],
  ["data_format", "reg.ds.format"],
  ["source_url", "reg.ds.link"],
  ["licence", "reg.ds.licence"],
];

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="font-semibold text-[#0b2545]">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function RegistrySection() {
  const t = useT14();
  const { user, logout } = useAuth();
  const [models, setModels] = useState<ModelRow[]>([]);
  const [datasets, setDatasets] = useState<DatasetRow[]>([]);
  const [loadErr, setLoadErr] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [verified, setVerified] = useState(false);
  const [ok, setOk] = useState(false);
  const [errKey, setErrKey] = useState("");
  const [errDetail, setErrDetail] = useState("");
  const [busy, setBusy] = useState(false);
  const canEdit = user?.role === "clinician";

  function load() {
    Promise.all([
      fetch(`${API}/registry/models`).then((r) => r.json()),
      fetch(`${API}/registry/datasets`).then((r) => r.json()),
    ])
      .then(([m, d]) => {
        setModels(m);
        setDatasets(d);
        setLoadErr(false);
      })
      .catch(() => setLoadErr(true));
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setOk(false);
    setErrKey("");
    setErrDetail("");
    const num = (v: string) => (v.trim() === "" ? null : Number(v));
    const body = {
      name: form.name,
      publisher: form.publisher,
      country: form.country,
      coverage: form.coverage,
      population_group: form.population_group,
      collection_year: form.collection_year,
      data_format: form.data_format,
      source_url: form.source_url,
      licence: form.licence,
      record_count: num(form.record_count),
      record_count_verified: verified,
      missing_value_pct: num(form.missing_value_pct),
    };
    try {
      const res = await fetch(`${API}/registry/datasets`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(body),
      });
      if (res.status === 401) {
        logout();
        setErrKey("auth.expired");
        return;
      }
      if (res.status === 403) {
        setErrKey("auth.readonly");
        return;
      }
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        setErrKey("reg.add.err");
        setErrDetail(d && typeof d.detail === "string" ? d.detail : "");
        return;
      }
      setForm(EMPTY);
      setVerified(false);
      setOk(true);
      load();
    } catch {
      setErrKey("error.api");
    } finally {
      setBusy(false);
    }
  }

  const na = t("reg.na");
  const th = "whitespace-nowrap px-4 py-3 text-start";
  const input =
    "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-slate-700";

  return (
    <div className="space-y-6">
      {loadErr && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {t("reg.load_err")}
        </div>
      )}

      <Card title={t("reg.models")}>
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead className="bg-[#0b2545] text-white">
              <tr>
                {["name", "version", "population", "type", "status", "eval", "notes"].map((c) => (
                  <th key={c} className={th}>
                    {t(`reg.col.${c}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {models.map((m) => (
                <tr key={m.id} className="border-t border-slate-100 align-top">
                  <td className="px-4 py-3 font-medium">{m.name}</td>
                  <td className="px-4 py-3" dir="ltr">
                    {m.version ?? na}
                  </td>
                  <td className="px-4 py-3">{t(`reg.pop.${m.population_group}`)}</td>
                  <td className="px-4 py-3">{t(`reg.type.${m.model_type}`)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        m.status === "demo_logic"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {t(`reg.status.${m.status}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3" dir="ltr">
                    {m.evaluation_date ?? na}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{m.notes ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500">{t("reg.models_note")}</p>
      </Card>

      <Card title={t("reg.datasets")}>
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead className="bg-[#0b2545] text-white">
              <tr>
                {["name", "publisher", "coverage", "population", "year", "format", "link", "licence", "records", "missing"].map((c) => (
                  <th key={c} className={th}>
                    {t(`reg.ds.${c}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {datasets.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-slate-400">
                    {t("reg.ds.empty")}
                  </td>
                </tr>
              )}
              {datasets.map((d) => (
                <tr key={d.id} className="border-t border-slate-100 align-top">
                  <td className="px-4 py-3 font-medium">{d.name}</td>
                  <td className="px-4 py-3">{d.publisher}</td>
                  <td className="px-4 py-3">
                    {[d.country, d.coverage].filter(Boolean).join(" · ") || na}
                  </td>
                  <td className="px-4 py-3">{t(`reg.pop.${d.population_group}`)}</td>
                  <td className="px-4 py-3" dir="ltr">
                    {d.collection_year ?? na}
                  </td>
                  <td className="px-4 py-3">{d.data_format ?? na}</td>
                  <td className="px-4 py-3" dir="ltr">
                    {/^https?:\/\//.test(d.source_url) ? (
                      <a
                        href={d.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-700 underline"
                      >
                        {d.source_url}
                      </a>
                    ) : (
                      d.source_url
                    )}
                  </td>
                  <td className="px-4 py-3">{d.licence}</td>
                  <td className="px-4 py-3" dir="ltr">
                    {d.record_count !== null ? d.record_count.toLocaleString("en-US") : na}
                  </td>
                  <td className="px-4 py-3" dir="ltr">
                    {d.missing_value_pct !== null ? `${d.missing_value_pct}%` : na}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title={t("reg.add")}>
        {!canEdit ? (
          <p className="text-sm text-amber-800">
            {user ? t("auth.readonly") : t("reg.add.signin")}
          </p>
        ) : (
          <form onSubmit={submit}>
            <p className="mb-3 text-xs text-slate-500">{t("reg.add.note")}</p>
            <div className="grid gap-3 md:grid-cols-2">
              {TEXT_FIELDS.map(([k, label]) => (
                <label key={k} className="text-xs uppercase tracking-wide text-slate-500">
                  {t(label)}
                  <input
                    className={input}
                    value={form[k]}
                    onChange={(e) => {
                      setOk(false);
                      setForm({ ...form, [k]: e.target.value });
                    }}
                  />
                </label>
              ))}
              <label className="text-xs uppercase tracking-wide text-slate-500">
                {t("reg.ds.population")}
                <select
                  className={input}
                  value={form.population_group}
                  onChange={(e) => setForm({ ...form, population_group: e.target.value })}
                >
                  {["child", "adult", "both"].map((g) => (
                    <option key={g} value={g}>
                      {t(`reg.pop.${g}`)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs uppercase tracking-wide text-slate-500">
                {t("reg.ds.missing")}
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  className={input}
                  value={form.missing_value_pct}
                  onChange={(e) => setForm({ ...form, missing_value_pct: e.target.value })}
                />
              </label>
              <label className="text-xs uppercase tracking-wide text-slate-500">
                {t("reg.ds.records")}
                <input
                  type="number"
                  min="0"
                  className={input}
                  value={form.record_count}
                  onChange={(e) => setForm({ ...form, record_count: e.target.value })}
                />
              </label>
              <label className="flex items-end gap-2 pb-2 text-sm normal-case text-slate-700">
                <input
                  type="checkbox"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                />
                {t("reg.add.verified")}
              </label>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-[#0b2545] px-4 py-2 text-sm text-white hover:bg-[#12335f] disabled:opacity-50"
              >
                {t("reg.add.submit")}
              </button>
              {ok && <span className="text-sm text-teal-700">{t("reg.add.ok")}</span>}
              {errKey && (
                <span className="text-sm text-red-700">
                  {t(errKey)} {errDetail}
                </span>
              )}
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

