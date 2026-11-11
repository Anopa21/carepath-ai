"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { useT8 } from "@/lib/i18n8";

export default function AuthBox() {
  const t = useT8();
  const { user, login, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const err = await login(username.trim(), password);
    if (err) setError(err);
    else {
      setUsername("");
      setPassword("");
    }
    setBusy(false);
  }

  if (user) {
    return (
      <div className="mb-6 rounded-xl bg-white/10 p-3 text-xs">
        <p className="text-slate-300">{t("auth.signed_as")}</p>
        <p className="mt-0.5 text-sm font-semibold text-white">{user.name}</p>
        <p className="mt-1 text-teal-200">{t(`auth.role.${user.role}`)}</p>
        <button
          onClick={logout}
          className="mt-3 w-full rounded-lg bg-white/10 py-1.5 text-slate-100 hover:bg-white/20"
        >
          {t("auth.signout")}
        </button>
      </div>
    );
  }

  const input =
    "w-full rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-teal-300";

  return (
    <form onSubmit={submit} className="mb-6 rounded-xl bg-white/10 p-3 text-xs">
      <p className="mb-2 text-sm font-semibold text-white">{t("auth.title")}</p>
      <div className="space-y-2">
        <input
          className={input}
          placeholder={t("auth.username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="off"
          dir="ltr"
        />
        <input
          className={input}
          type="password"
          placeholder={t("auth.password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
          dir="ltr"
        />
      </div>
      {error && <p className="mt-2 text-red-300">{t(error)}</p>}
      <button
        type="submit"
        disabled={busy || !username || !password}
        className="mt-3 w-full rounded-lg bg-teal-400/30 py-1.5 text-teal-100 hover:bg-teal-400/40 disabled:opacity-50"
      >
        {t("auth.signin")}
      </button>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-300" dir="ltr">
        {t("auth.hint")}
      </p>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{t("auth.demo_note")}</p>
    </form>
  );
}
