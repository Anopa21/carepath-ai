"use client";

import { useEffect, useState } from "react";
import { useT12 } from "@/lib/i18n12";
import { useAuth } from "./AuthProvider";

const API = "http://127.0.0.1:8000";
const CONSENT = ["not_recorded", "consented", "declined"];
const LANGS = ["ar", "en"];
const CHANNELS = ["sms", "email", "phone", "none"];

type Prefs = {
  consent_status: string;
  preferred_language: string;
  preferred_channel: string;
  consent_updated_by?: string | null;
};

export default function ConsentSection({ caseId }: { caseId: number }) {
  const t = useT12();
  const { user, logout } = useAuth();
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const canEdit = user?.role === "clinician";

  useEffect(() => {
    setMsg("");
    setErr("");
    fetch(`${API}/cases`)
      .then((r) => r.json())
      .then((d) => {
        const row = (d.cases as (Prefs & { id: number })[]).find((x) => x.id === caseId);
        if (row)
          setPrefs({
            consent_status: row.consent_status ?? "not_recorded",
            preferred_language: row.preferred_language ?? "ar",
            preferred_channel: row.preferred_channel ?? "none",
            consent_updated_by: row.consent_updated_by,
          });
      })
      .catch(() => setErr("hist.error"));
  }, [caseId]);

  function changeStatus(v: string) {
    if (!prefs) return;
    setMsg("");
    setPrefs({
      ...prefs,
      consent_status: v,
      preferred_channel:
        v === "consented"
          ? prefs.preferred_channel === "none"
            ? "sms"
            : prefs.preferred_channel
          : "none",
    });
  }

  async function save() {
    if (!user || !prefs) return;
    setBusy(true);
    setErr("");
    setMsg("");
    try {
      const res = await fetch(`${API}/cases/${caseId}/consent`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          consent_status: prefs.consent_status,
          preferred_language: prefs.preferred_language,
          preferred_channel: prefs.preferred_channel,
        }),
      });
      if (res.status === 401) {
        logout();
        setErr("auth.expired");
        return;
      }
      if (res.status === 403) {
        setErr("auth.readonly");
        return;
      }
      if (!res.ok) throw new Error();
      const u = await res.json();
      setPrefs({
        consent_status: u.consent_status,
        preferred_language: u.preferred_language,
        preferred_channel: u.preferred_channel,
        consent_updated_by: u.consent_updated_by,
      });
      setMsg("cons.saved");
    } catch {
      setErr("error.update");
    } finally {
      setBusy(false);
    }
  }

  const label = "text-xs uppercase tracking-wide text-slate-500";
  const sel =
    "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

  const noteStyle =
    prefs?.consent_status === "declined"
      ? "bg-red-50 text-red-700"
      : prefs?.consent_status === "consented"
        ? "bg-teal-50 text-teal-800"
        : "bg-amber-50 text-amber-800";

  return (
    <div className="mt-6">
      <h3 className="font-semibold text-[#0b2545]">{t("cons.title")}</h3>
      <p className="mt-1 text-xs text-slate-500">{t("cons.synthetic")}</p>

      {err && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{t(err)}</p>}

      {!prefs && !err && <p className="mt-2 text-sm text-slate-500">{t("hist.loading")}</p>}

      {prefs && (
        <>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className={label}>
              {t("cons.status")}
              <select
                className={sel}
                disabled={!canEdit}
                value={prefs.consent_status}
                onChange={(e) => changeStatus(e.target.value)}
              >
                {CONSENT.map((c) => (
                  <option key={c} value={c}>
                    {t(`cons.status.${c}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className={label}>
              {t("cons.language")}
              <select
                className={sel}
                disabled={!canEdit}
                value={prefs.preferred_language}
                onChange={(e) => {
                  setMsg("");
                  setPrefs({ ...prefs, preferred_language: e.target.value });
                }}
              >
                {LANGS.map((l) => (
                  <option key={l} value={l}>
                    {t(`cons.lang.${l}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className={label}>
              {t("cons.channel")}
              <select
                className={sel}
                disabled={!canEdit || prefs.consent_status !== "consented"}
                value={prefs.preferred_channel}
                onChange={(e) => {
                  setMsg("");
                  setPrefs({ ...prefs, preferred_channel: e.target.value });
                }}
              >
                {CHANNELS.map((c) => (
                  <option key={c} value={c}>
                    {t(`cons.channel.${c}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className={`mt-3 rounded-lg px-3 py-2 text-sm ${noteStyle}`}>
            {t(`cons.note.${prefs.consent_status}`)}
          </p>

          {canEdit ? (
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={save}
                disabled={busy}
                className="rounded-lg bg-[#0b2545] px-4 py-2 text-sm text-white hover:bg-[#12335f] disabled:opacity-50"
              >
                {t("cons.save")}
              </button>
              {msg && <span className="text-sm text-teal-700">{t(msg)}</span>}
            </div>
          ) : (
            <p className="mt-3 text-xs text-slate-500">{t("cons.readonly")}</p>
          )}

          {prefs.consent_updated_by && (
            <p className="mt-2 text-xs text-slate-500">
              {t("cons.updated_by")} <span dir="ltr">{prefs.consent_updated_by}</span>
            </p>
          )}
        </>
      )}
    </div>
  );
}
