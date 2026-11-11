"use client";

import { useEffect, useState } from "react";
import { useT10 } from "@/lib/i18n10";
import { useLang } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";
import CaseHistoryPanel from "@/components/CaseHistoryPanel";

const API = "http://127.0.0.1:8000";

const STATUSES = [
  "identified",
  "awaiting_engagement",
  "appointment_recommended",
  "appointment_scheduled",
  "visit_completed",
  "follow_up_required",
  "closed",
];
const GROUPS = ["child", "adult"];
const FLAGS = ["elevated_risk", "unmet_preventive_care"];
const PRIORITIES = ["high", "medium", "routine"];

type CaseRow = {
  id: number;
  person_ref: string;
  population_group: string;
  flag_type: string;
  flag_reason: string;
  flag_reason_ar?: string | null;
  pathway: string;
  priority: string;
  status: string;
  follow_up_date: string;
  data_origin: string;
};

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-slate-500">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-slate-700"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function Home() {
  const t = useT10();
  const { lang } = useLang();
  const { user, logout } = useAuth();
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<CaseRow | null>(null);

  const [query, setQuery] = useState("");
  const [fGroup, setFGroup] = useState("all");
  const [fFlag, setFFlag] = useState("all");
  const [fPriority, setFPriority] = useState("all");
  const [fStatus, setFStatus] = useState("all");

  const canEdit = user?.role === "clinician";

  useEffect(() => {
    fetch(`${API}/cases`)
      .then((r) => r.json())
      .then((d) => setCases(d.cases))
      .catch(() => setError("error.api"));
  }, []);

  async function updateStatus(id: number, status: string) {
    if (!user) return;
    setError("");
    try {
      const res = await fetch(`${API}/cases/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.status === 401) {
        logout();
        setError("auth.expired");
        return;
      }
      if (res.status === 403) {
        setError("auth.readonly");
        return;
      }
      if (!res.ok) throw new Error();
      const updated: CaseRow = await res.json();
      setCases((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setSelected((s) => (s && s.id === id ? updated : s));
    } catch {
      setError("error.update");
    }
  }

  const q = query.trim().toLowerCase();
  const filtered = cases.filter((c) => {
    if (fGroup !== "all" && c.population_group !== fGroup) return false;
    if (fFlag !== "all" && c.flag_type !== fFlag) return false;
    if (fPriority !== "all" && c.priority !== fPriority) return false;
    if (fStatus !== "all" && c.status !== fStatus) return false;
    if (q) {
      const hay = `${c.person_ref} ${c.flag_reason} ${c.flag_reason_ar ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const filtersActive =
    q !== "" || fGroup !== "all" || fFlag !== "all" || fPriority !== "all" || fStatus !== "all";

  function resetFilters() {
    setQuery("");
    setFGroup("all");
    setFFlag("all");
    setFPriority("all");
    setFStatus("all");
  }

  const allOpt = { value: "all", label: t("filter.all") };

  const stats = [
    { key: "stat.total", value: cases.length },
    { key: "stat.children", value: cases.filter((c) => c.population_group === "child").length },
    { key: "stat.adults", value: cases.filter((c) => c.population_group === "adult").length },
    { key: "stat.high", value: cases.filter((c) => c.priority === "high").length },
    { key: "stat.followup", value: cases.filter((c) => c.status === "follow_up_required").length },
  ];

  const columns = [
    "col.reference",
    "col.group",
    "col.flag",
    "col.reason",
    "col.priority",
    "col.status",
    "col.followup",
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold text-[#0b2545]">CarePath AI</h1>
        <p className="mt-1 text-slate-600">{t("home.subtitle")}</p>

        <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
          {t("notice.synthetic")}
        </div>
        {!canEdit && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {user ? t("auth.readonly") : t("auth.need_login")}
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {t(error)}
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
          {stats.map((s) => (
            <div key={s.key} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-wide text-slate-500">{t(s.key)}</p>
              <p className="mt-2 text-3xl font-semibold text-[#0b2545]">{s.value}</p>
              <p className="mt-1 text-[11px] text-teal-700">{t("label.synthetic")}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("filter.search")}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-teal-200"
          />
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            <FilterSelect
              label={t("col.group")}
              value={fGroup}
              onChange={setFGroup}
              options={[allOpt, ...GROUPS.map((g) => ({ value: g, label: t(`group.${g}`) }))]}
            />
            <FilterSelect
              label={t("col.flag")}
              value={fFlag}
              onChange={setFFlag}
              options={[allOpt, ...FLAGS.map((f) => ({ value: f, label: t(`flag.${f}`) }))]}
            />
            <FilterSelect
              label={t("col.priority")}
              value={fPriority}
              onChange={setFPriority}
              options={[allOpt, ...PRIORITIES.map((p) => ({ value: p, label: t(`priority.${p}`) }))]}
            />
            <FilterSelect
              label={t("col.status")}
              value={fStatus}
              onChange={setFStatus}
              options={[allOpt, ...STATUSES.map((s) => ({ value: s, label: t(`status.${s}`) }))]}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
            <span>
              {t("filter.showing")} {filtered.length} {t("filter.of")} {cases.length}{" "}
              {t("filter.cases")}
            </span>
            {filtersActive && (
              <button
                onClick={resetFilters}
                className="rounded-lg bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:bg-slate-200"
              >
                {t("filter.reset")}
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full text-start text-sm">
            <thead className="bg-[#0b2545] text-white">
              <tr>
                {columns.map((c) => (
                  <th key={c} className="px-4 py-3 text-start">
                    {t(c)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                    {t("filter.none")}
                  </td>
                </tr>
              )}
              {filtered.map((c) => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium" dir="ltr">
                    <button
                      onClick={() => setSelected(c)}
                      className="text-teal-700 underline decoration-dotted underline-offset-4 hover:text-teal-900"
                    >
                      {c.person_ref}
                    </button>
                  </td>
                  <td className="px-4 py-3">{t(`group.${c.population_group}`)}</td>
                  <td className="px-4 py-3">{t(`flag.${c.flag_type}`)}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {lang === "ar" && c.flag_reason_ar ? c.flag_reason_ar : c.flag_reason}
                  </td>
                  <td className="px-4 py-3">{t(`priority.${c.priority}`)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={c.status}
                      disabled={!canEdit}
                      onChange={(e) => updateStatus(c.id, e.target.value)}
                      className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {t(`status.${s}`)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3" dir="ltr">
                    {c.follow_up_date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selected && <CaseHistoryPanel c={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}
