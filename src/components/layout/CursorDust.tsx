"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CursorDust.module.css";

const DOTS = 20;

function isMobile() {
  if (window.innerWidth < 768) {
    return true;
  }
  return /Mobi|Android|iPhone|iPod|iPad|webOS|BlackBerry|IEMobile/i.test(navigator.userAgent);
}

export function CursorDust() {
  const layerRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const sync = () => setOn(!isMobile());
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    if (!on) {
      return;
    }

    const layer = layerRef.current;
    if (!layer) {
      return;
    }
    const dots = [...layer.querySelectorAll<HTMLElement>("span")];
    let n = 0;

    const onMove = (event: MouseEvent) => {
      const dot = dots[n % dots.length];
      n += 1;
      if (!dot) {
        return;
      }
      const x = event.clientX;
      const y = event.clientY;
      dot.style.transition = "none";
      dot.style.opacity = "1";
      dot.style.transform = `translate(${x}px, ${y}px) scale(1)`;
      window.requestAnimationFrame(() => {
        dot.style.transition = "opacity 520ms ease-out, transform 520ms ease-out";
        dot.style.opacity = "0";
        dot.style.transform = `translate(${x}px, ${y - 16}px) scale(0.2)`;
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [on]);

  if (!on) {
    return null;
  }

  return (
    <div ref={layerRef} className={styles.layer} aria-hidden>
      {Array.from({ length: DOTS }, (_, i) => (
        <span key={i} className={i % 4 === 0 ? styles.gilt : styles.ice} />
      ))}
    </div>
  );
}
