"use client";

import { useEffect } from "react";
import { initSound, isSoundTarget, playClick, preloadMusic, unlockSound } from "@/lib/arcaneSound";

export function SoundLayer() {
  useEffect(() => {
    initSound();
    preloadMusic();

    const start = window.setTimeout(() => {
      unlockSound();
    }, 3000);

    const onPointer = () => unlockSound();
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) {
        return;
      }
      unlockSound();
      if (isSoundTarget(event.target)) {
        playClick();
      }
    };

    document.addEventListener("pointerdown", onPointer, { passive: true });
    document.addEventListener("click", onClick, true);
    return () => {
      window.clearTimeout(start);
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
