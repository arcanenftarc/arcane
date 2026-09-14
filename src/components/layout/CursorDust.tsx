"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CursorDust.module.css";

type Speck = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  ice: boolean;
};

function isMobile() {
  if (window.innerWidth < 768) {
    return true;
  }
  return /Mobi|Android|iPhone|iPod|iPad|webOS|BlackBerry|IEMobile/i.test(navigator.userAgent);
}

export function CursorDust() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      return;
    }

    const specks: Speck[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;
    let lastX = 0;
    let lastY = 0;
    let hasLast = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const add = (x: number, y: number) => {
      specks.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 0.7,
        vy: -0.35 - Math.random() * 0.7,
        life: 1,
        size: 1.8 + Math.random() * 2.6,
        ice: Math.random() > 0.25,
      });
      if (specks.length > 160) {
        specks.splice(0, specks.length - 160);
      }
    };

    const fromPoint = (x: number, y: number) => {
      if (!hasLast) {
        add(x, y);
        add(x, y);
        lastX = x;
        lastY = y;
        hasLast = true;
        return;
      }
      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.hypot(dx, dy);
      const steps = Math.max(1, Math.min(10, Math.floor(dist / 5)));
      for (let i = 1; i <= steps; i += 1) {
        const t = i / steps;
        add(lastX + dx * t, lastY + dy * t);
      }
      lastX = x;
      lastY = y;
    };

    const onMove = (event: MouseEvent | PointerEvent) => {
      if ("pointerType" in event && event.pointerType === "touch") {
        return;
      }
      const x = event.clientX;
      const y = event.clientY;
      if (hasLast && x === lastX && y === lastY) {
        return;
      }
      fromPoint(x, y);
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = specks.length - 1; i >= 0; i -= 1) {
        const speck = specks[i];
        speck.life -= 0.018;
        speck.x += speck.vx;
        speck.y += speck.vy;
        speck.vy -= 0.012;
        if (speck.life <= 0) {
          specks.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, speck.life);
        ctx.fillStyle = speck.ice ? "#3ee0ff" : "#efc27a";
        ctx.beginPath();
        ctx.arc(speck.x, speck.y, speck.size * speck.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame = window.requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { capture: true, passive: true });
    window.addEventListener("mousemove", onMove, { capture: true, passive: true });
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove, true);
      window.removeEventListener("mousemove", onMove, true);
    };
  }, [on]);

  if (!on) {
    return null;
  }

  return <canvas ref={canvasRef} className={styles.layer} aria-hidden />;
}
