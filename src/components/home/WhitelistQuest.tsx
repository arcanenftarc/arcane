"use client";

import { useEffect, useState } from "react";
import { useXSession } from "@/components/auth/XSession";
import { siteConfig } from "@/config/site";
import styles from "./WhitelistQuest.module.css";

const STORAGE_KEY = "arcane-quests";

type QuestId = (typeof siteConfig.whitelistSteps)[number]["id"];

function readDone(): QuestId[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((id): id is QuestId => typeof id === "string");
  } catch {
    return [];
  }
}

function writeDone(ids: QuestId[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function WhitelistQuest() {
  const { user } = useXSession();
  const loggedIn = Boolean(user);
  const [done, setDone] = useState<QuestId[]>([]);
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    setDone(readDone());
  }, []);

  const requireLogin = () => {
    setPopup(true);
  };

  const openQuest = (href: string) => {
    if (!loggedIn) {
      requireLogin();
      return;
    }
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const verify = (id: QuestId) => {
    if (!loggedIn) {
      requireLogin();
      return;
    }
    setDone((current) => {
      if (current.includes(id)) {
        return current;
      }
      const next = [...current, id];
      writeDone(next);
      return next;
    });
  };

  return (
    <>
      <ol className={styles.list}>
        {siteConfig.whitelistSteps.map((step) => {
          const verified = loggedIn && done.includes(step.id);

          return (
            <li key={step.id} className={`${styles.card}${verified ? ` ${styles.verified}` : ""}`} data-aura>
              <div className={styles.row}>
                <p className={styles.n}>{step.n}</p>
                <p className={styles.body}>{step.body}</p>
              </div>
              <div className={styles.actions}>
                <button type="button" className={styles.open} onClick={() => openQuest(step.href)}>
                  {step.action}
                </button>
                <button type="button" className={styles.verify} onClick={() => verify(step.id)} disabled={verified}>
                  {verified ? "Verified" : "Verify"}
                </button>
              </div>
            </li>
          );
        })}
      </ol>
      {popup ? (
        <div className={styles.backdrop} role="presentation" onClick={() => setPopup(false)}>
          <div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quest-login-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p id="quest-login-title" className={styles.dialogTitle}>
              Sign in with X
            </p>
            <p className={styles.dialogCopy}>Sign in with X to follow, comment, quote, and verify quests.</p>
            <div className={styles.dialogActions}>
              <a className={styles.verify} href="/api/auth/x">
                Continue with X
              </a>
              <button type="button" className={styles.open} onClick={() => setPopup(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
