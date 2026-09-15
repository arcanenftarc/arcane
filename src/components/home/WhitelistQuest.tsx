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
  const [failed, setFailed] = useState<Partial<Record<QuestId, boolean>>>({});
  const [pending, setPending] = useState<QuestId | null>(null);
  const [popup, setPopup] = useState(false);
  const [wallet, setWallet] = useState("");
  const [saved, setSaved] = useState("");
  const [walletStatus, setWalletStatus] = useState<"idle" | "saving" | "ok" | "bad" | "locked">("idle");

  const allDone = loggedIn && siteConfig.whitelistSteps.every((step) => done.includes(step.id));
  const applied = loggedIn && /^0x[a-fA-F0-9]{40}$/.test(saved);

  useEffect(() => {
    setDone(readDone());
  }, []);

  useEffect(() => {
    if (!loggedIn) {
      return;
    }
    fetch("/api/whitelist/wallet")
      .then((res) => res.json())
      .then((data: { wallet?: string; follow?: boolean; comment?: boolean; retweet?: boolean }) => {
        const fromSheet: QuestId[] = [];
        if (data.follow) {
          fromSheet.push("follow");
        }
        if (data.comment) {
          fromSheet.push("comment");
        }
        if (data.retweet) {
          fromSheet.push("retweet");
        }
        setDone((current) => {
          const next = [...new Set([...current, ...fromSheet])];
          writeDone(next);
          return next;
        });
        const value = data.wallet ?? "";
        setWallet(value);
        setSaved(value);
      })
      .catch(() => undefined);
  }, [loggedIn]);

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

  const verify = async (id: QuestId) => {
    if (!loggedIn) {
      requireLogin();
      return;
    }
    if (done.includes(id) || pending) {
      return;
    }
    setFailed((current) => ({ ...current, [id]: false }));
    setPending(id);
    try {
      const res = await fetch("/api/quests/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = (await res.json()) as { ok?: boolean };
      if (data.ok) {
        setDone((current) => {
          if (current.includes(id)) {
            return current;
          }
          const next = [...current, id];
          writeDone(next);
          return next;
        });
        setFailed((current) => ({ ...current, [id]: false }));
      } else {
        setFailed((current) => ({ ...current, [id]: true }));
      }
    } catch {
      setFailed((current) => ({ ...current, [id]: true }));
    } finally {
      setPending(null);
    }
  };

  return (
    <>
      {applied ? (
        <div className={styles.applied} data-aura>
          <p className={styles.appliedKicker}>Whitelist</p>
          <p className={styles.appliedTitle}>Applied for whitelist</p>
          <p className={styles.appliedCopy}>Follow X for more updates.</p>
          <a className={styles.appliedLink} href={siteConfig.social.x} target="_blank" rel="noreferrer">
            Follow @{siteConfig.social.xHandle}
          </a>
        </div>
      ) : (
        <>
      <ol className={styles.list}>
        {siteConfig.whitelistSteps.map((step) => {
          const verified = loggedIn && done.includes(step.id);

          return (
            <li key={step.id} className={`${styles.card}${verified ? ` ${styles.verified}` : ""}`} data-aura>
              <div className={styles.row}>
                <p className={styles.n}>{step.n}</p>
                <div className={styles.actions}>
                  <button type="button" className={styles.open} onClick={() => openQuest(step.href)}>
                    {step.action}
                  </button>
                  <button type="button" className={styles.verify} onClick={() => verify(step.id)} disabled={verified || pending === step.id}>
                    {verified ? "Verified" : "Verify"}
                  </button>
                </div>
              </div>
              {failed[step.id] && !verified ? <p className={styles.fail}>Task not completed</p> : null}
            </li>
          );
        })}
      </ol>
      <form
        className={`${styles.wallet}${allDone ? ` ${styles.walletReady}` : ` ${styles.walletLocked}`}`}
        data-aura
        onSubmit={async (event) => {
          event.preventDefault();
          if (!allDone) {
            setWalletStatus("locked");
            return;
          }
          setWalletStatus("saving");
          const res = await fetch("/api/whitelist/wallet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ wallet: wallet.trim() }),
          });
          if (res.ok) {
            setSaved(wallet.trim());
            setWalletStatus("ok");
          } else if (res.status === 403) {
            setWalletStatus("locked");
          } else {
            setWalletStatus("bad");
          }
        }}
      >
        <div className={styles.walletHead}>
          <p className={styles.walletMark} aria-hidden="true">
            04
          </p>
          <div className={styles.walletIntro}>
            <label className={styles.walletLabel} htmlFor="wallet-address">
              Wallet
            </label>
            <p className={styles.walletCopy}>
              {allDone
                ? "Enter your 0x address. This site does not connect a wallet."
                : "Complete and verify all three tasks to unlock submission."}
            </p>
          </div>
        </div>
        <div className={styles.walletRow}>
          <input
            id="wallet-address"
            className={styles.walletInput}
            value={wallet}
            onChange={(event) => {
              setWallet(event.target.value);
              setWalletStatus("idle");
            }}
            autoComplete="off"
            spellCheck={false}
            disabled={!allDone}
          />
          <button
            className={styles.walletSubmit}
            type="submit"
            disabled={!allDone || walletStatus === "saving" || wallet.trim() === saved}
          >
            {walletStatus === "saving" ? "Saving" : saved && wallet.trim() === saved ? "Saved" : "Submit"}
          </button>
        </div>
        {walletStatus === "bad" ? <p className={styles.walletNote}>Enter a valid 0x address.</p> : null}
        {walletStatus === "ok" ? <p className={styles.walletOk}>Address recorded for whitelist.</p> : null}
      </form>
        </>
      )}
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
