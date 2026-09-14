"use client";

import { useEffect, useRef } from "react";
import styles from "./CursorDust.module.css";

type Speck = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  ice: boolean;
};

export function CursorDust() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(pointer: fine)");
    if (motion.matches || !pointer.matches) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const specks: Speck[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let lastX = 0;
    let lastY = 0;
    let seeded = false;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x: number, y: number, burst: number) => {
      for (let i = 0; i < burst; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.12 + Math.random() * 0.55;
        specks.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.18,
          life: 1,
          max: 420 + Math.random() * 280,
          size: 0.7 + Math.random() * 1.6,
          ice: Math.random() > 0.22,
        });
      }
      if (specks.length > 90) {
        specks.splice(0, specks.length - 90);
      }
    };

    const onMove = (event: PointerEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      const dx = seeded ? x - lastX : 0;
      const dy = seeded ? y - lastY : 0;
      const dist = Math.hypot(dx, dy);
      lastX = x;
      lastY = y;
      seeded = true;
      if (dist < 1.2) {
        return;
      }
      spawn(x, y, dist > 18 ? 3 : 2);
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = specks.length - 1; i >= 0; i -= 1) {
        const speck = specks[i];
        speck.life -= 16 / speck.max;
        speck.x += speck.vx;
        speck.y += speck.vy;
        speck.vy -= 0.008;
        speck.vx *= 0.98;
        if (speck.life <= 0) {
          specks.splice(i, 1);
          continue;
        }
        const alpha = Math.pow(speck.life, 1.35);
        ctx.beginPath();
        ctx.fillStyle = speck.ice
          ? `rgba(62, 224, 255, ${0.55 * alpha})`
          : `rgba(239, 194, 122, ${0.5 * alpha})`;
        ctx.arc(speck.x, speck.y, speck.size * (0.55 + speck.life * 0.7), 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = speck.ice
          ? `rgba(200, 251, 255, ${0.28 * alpha})`
          : `rgba(255, 231, 194, ${0.22 * alpha})`;
        ctx.arc(speck.x, speck.y, speck.size * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = window.requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.layer} aria-hidden />;
}
