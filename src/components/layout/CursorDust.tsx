"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.className = styles.layer;
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      canvas.remove();
      return;
    }

    const specks: Speck[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;
    let lastX = 0;
    let lastY = 0;
    let seeded = false;
    let cursorX = 0;
    let cursorY = 0;
    let hovering = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x: number, y: number, burst: number) => {
      for (let i = 0; i < burst; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.2 + Math.random() * 0.9;
        specks.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.25,
          life: 1,
          max: 520 + Math.random() * 380,
          size: 1.4 + Math.random() * 2.4,
          ice: Math.random() > 0.28,
        });
      }
      if (specks.length > 140) {
        specks.splice(0, specks.length - 140);
      }
    };

    const onMove = (event: PointerEvent | MouseEvent) => {
      if ("pointerType" in event && event.pointerType === "touch") {
        return;
      }
      const x = event.clientX;
      const y = event.clientY;
      cursorX = x;
      cursorY = y;
      hovering = true;
      const dx = seeded ? x - lastX : 12;
      const dy = seeded ? y - lastY : 0;
      const dist = Math.hypot(dx, dy);
      lastX = x;
      lastY = y;
      seeded = true;
      spawn(x, y, dist > 22 ? 5 : dist > 6 ? 3 : 2);
    };

    const onLeave = () => {
      hovering = false;
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      if (hovering) {
        const glow = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, 18);
        glow.addColorStop(0, "rgba(200, 251, 255, 0.45)");
        glow.addColorStop(0.45, "rgba(62, 224, 255, 0.16)");
        glow.addColorStop(1, "rgba(62, 224, 255, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, 18, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = specks.length - 1; i >= 0; i -= 1) {
        const speck = specks[i];
        speck.life -= 16 / speck.max;
        speck.x += speck.vx;
        speck.y += speck.vy;
        speck.vy -= 0.01;
        speck.vx *= 0.985;
        if (speck.life <= 0) {
          specks.splice(i, 1);
          continue;
        }
        const alpha = Math.pow(speck.life, 1.15);
        ctx.beginPath();
        ctx.fillStyle = speck.ice
          ? `rgba(62, 224, 255, ${0.85 * alpha})`
          : `rgba(239, 194, 122, ${0.8 * alpha})`;
        ctx.shadowColor = speck.ice ? "rgba(62, 224, 255, 0.9)" : "rgba(239, 194, 122, 0.85)";
        ctx.shadowBlur = 8;
        ctx.arc(speck.x, speck.y, speck.size * (0.65 + speck.life * 0.7), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      frame = window.requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      canvas.remove();
    };
  }, []);

  return null;
}
