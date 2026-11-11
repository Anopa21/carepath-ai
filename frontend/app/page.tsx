"use client";

import { useEffect, useState } from "react";
import { useT8 } from "@/lib/i18n8";
import { useLang } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";

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

export default function Home() {
  const t = useT8();
  const { lang } = useLang();
  const { user, logout } = useAuth();
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [error, setError] = useState("");

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
    } catch {
      setError("error.update");
    }
  }

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

        <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
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
              {cases.map((c) => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium" dir="ltr">
                    {c.person_ref}
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
    </main>
  );
}
