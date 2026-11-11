"use client";

import { createContext, useContext, useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

export type AuthUser = { token: string; username: string; role: string; name: string };

type AuthCtx = {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<string | null>;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx>({
  user: null,
  login: async () => null,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("carepath-user");
      if (!saved) return;
      const u: AuthUser = JSON.parse(saved);
      fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${u.token}` } })
        .then((r) => {
          if (r.ok) setUser(u);
          else sessionStorage.removeItem("carepath-user");
        })
        .catch(() => {});
    } catch {}
  }, []);

  async function login(username: string, password: string) {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) return "auth.bad";
      const d = await res.json();
      const u: AuthUser = { token: d.token, username: d.username, role: d.role, name: d.name };
      setUser(u);
      try {
        sessionStorage.setItem("carepath-user", JSON.stringify(u));
      } catch {}
      return null;
    } catch {
      return "error.api";
    }
  }

  function logout() {
    setUser(null);
    try {
      sessionStorage.removeItem("carepath-user");
    } catch {}
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
