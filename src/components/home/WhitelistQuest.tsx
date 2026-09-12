"use client";

import { useEffect, useState } from "react";
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
  const [done, setDone] = useState<QuestId[]>([]);

  useEffect(() => {
    setDone(readDone());
  }, []);

  const verify = (id: QuestId) => {
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
    <ol className={styles.list}>
      {siteConfig.whitelistSteps.map((step) => {
        const verified = done.includes(step.id);
        const secondaryHref = "secondaryHref" in step ? step.secondaryHref : null;
        const secondaryAction = "secondaryAction" in step ? step.secondaryAction : null;

        return (
          <li key={step.id} className={`${styles.card}${verified ? ` ${styles.verified}` : ""}`} data-aura>
            <div className={styles.row}>
              <p className={styles.n}>{step.n}</p>
              <p className={styles.body}>{step.body}</p>
            </div>
            <div className={styles.actions}>
              <a className={styles.open} href={step.href} rel="noreferrer" target="_blank">
                {step.action}
              </a>
              {secondaryHref && secondaryAction ? (
                <a className={styles.open} href={secondaryHref} rel="noreferrer" target="_blank">
                  {secondaryAction}
                </a>
              ) : null}
              <button
                type="button"
                className={styles.verify}
                onClick={() => verify(step.id)}
                disabled={verified}
              >
                {verified ? "Verified" : "Verify"}
              </button>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
