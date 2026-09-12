"use client";

import { useEffect, useState } from "react";
import { initSound, isMuted, setMuted, subscribeSound } from "@/lib/arcaneSound";
import styles from "./SoundToggle.module.css";

export function SoundToggle() {
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    initSound();
    setMutedState(isMuted());
    return subscribeSound(() => setMutedState(isMuted()));
  }, []);

  return (
    <button
      type="button"
      className={`${styles.toggle}${muted ? ` ${styles.muted}` : ""}`}
      data-sound-toggle
      aria-label={muted ? "Unmute sound" : "Mute sound"}
      aria-pressed={!muted}
      onClick={() => setMuted(!muted)}
    >
      <span className={styles.gem} aria-hidden="true" />
    </button>
  );
}
