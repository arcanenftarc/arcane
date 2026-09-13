"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { XSession } from "@/lib/auth/session";

type AuthState = {
  user: XSession | null;
  ready: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  ready: false,
  logout: async () => undefined,
});

export function XSessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<XSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data: { user: XSession | null }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, ready, logout }), [user, ready, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useXSession() {
  return useContext(AuthContext);
}
