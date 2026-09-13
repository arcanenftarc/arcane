"use client";

import { useEffect, useState } from "react";
import styles from "./XLoginButton.module.css";

type User = {
  username: string;
  name: string;
};

function XMark() {
  return (
    <svg className={styles.mark} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function XLoginButton({ compact = false }: { compact?: boolean }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data: { user: User | null }) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  if (user) {
    if (compact) {
      return (
        <div className={styles.compactConnected}>
          <span>@{user.username}</span>
          <button
            type="button"
            className={styles.compactLogout}
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              setUser(null);
            }}
          >
            Disconnect
          </button>
        </div>
      );
    }
    return (
      <div className={styles.connected}>
        <p>
          Connected as <strong>@{user.username}</strong>
        </p>
        <button
          type="button"
          className={styles.logout}
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            setUser(null);
          }}
        >
          Disconnect X
        </button>
      </div>
    );
  }

  return (
    <a className={compact ? styles.compact : styles.button} href="/api/auth/x" aria-label={compact ? "Connect X" : "Continue with X"}>
      {compact ? "Connect" : "Continue with"}
      <XMark />
    </a>
  );
}
