"use client";

import { useEffect, useRef, useState } from "react";
import { useXSession } from "@/components/auth/XSession";
import styles from "./XLoginButton.module.css";

function largerAvatar(url?: string) {
  if (!url) {
    return "";
  }
  return url.replace("_normal", "_400x400").replace("_bigger", "_400x400");
}

function Chevron() {
  return (
    <svg className={styles.chevron} viewBox="0 0 12 8" aria-hidden="true">
      <path d="M1.2 1.4 6 6.2l4.8-4.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XMark() {
  return (
    <svg className={styles.mark} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function AccountMenu({
  compact,
  username,
  avatar,
  logout,
}: {
  compact: boolean;
  username: string;
  avatar?: string;
  logout: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointer = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={`${styles.box} ${compact ? styles.compactBox : styles.connectedBox}`} ref={menuRef}>
      <button
        type="button"
        className={compact ? styles.compactTrigger : styles.connectedTrigger}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for @${username}`}
        onClick={() => setOpen((value) => !value)}
      >
        {compact && avatar ? <img className={styles.avatar} src={avatar} alt="" width={28} height={28} /> : null}
        <span>@{username}</span>
        <Chevron />
      </button>
      {open ? (
        <button
          type="button"
          role="menuitem"
          className={styles.logoutItem}
          onClick={async () => {
            setOpen(false);
            await logout();
          }}
        >
          Logout
        </button>
      ) : null}
    </div>
  );
}

export function XLoginButton({ compact = false }: { compact?: boolean }) {
  const { user, ready, logout } = useXSession();

  if (!ready) {
    return compact ? <span className={styles.compactStatus} aria-hidden="true" /> : null;
  }

  if (user) {
    if (compact) {
      return <AccountMenu compact username={user.username} avatar={user.avatar} logout={logout} />;
    }

    const background = largerAvatar(user.avatar);
    return (
      <div
        className={styles.connected}
        style={background ? { backgroundImage: `url(${JSON.stringify(background)})` } : undefined}
      >
        <div className={styles.connectedShade} />
        <AccountMenu compact={false} username={user.username} avatar={user.avatar} logout={logout} />
      </div>
    );
  }

  if (compact) {
    return (
      <a className={styles.compact} href="/api/auth/x" aria-label="Connect X">
        Connect
        <XMark />
      </a>
    );
  }

  return (
    <div className={styles.cardInner}>
      <p className={styles.lead}>Sign-in to apply</p>
      <a className={styles.button} href="/api/auth/x" aria-label="Continue with X">
        Continue with
        <XMark />
      </a>
    </div>
  );
}
