"use client";

import { useEffect } from "react";
import { initSound, isSoundTarget, playClick, unlockSound } from "@/lib/arcaneSound";

export function SoundLayer() {
  useEffect(() => {
    initSound();

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
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
