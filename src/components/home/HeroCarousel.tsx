"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import styles from "./HeroCarousel.module.css";

type Slide = {
  src: string;
  alt: string;
};

const SWIPE_PX = 56;
const AUTO_MS = 4200;
const SLIDE_MS = 560;

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [shift, setShift] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [instant, setInstant] = useState(false);
  const startX = useRef<number | null>(null);
  const lastDrag = useRef(0);
  const pressedOffset = useRef<number | null>(null);
  const animatingRef = useRef(false);
  const pauseUntil = useRef(0);

  const go = (dir: -1 | 1) => {
    if (animatingRef.current || count < 2) {
      return;
    }
    animatingRef.current = true;
    setShift(dir);
    window.setTimeout(() => {
      setInstant(true);
      setIndex((current) => ((current + dir) % count + count) % count);
      setShift(0);
      setDrag(0);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setInstant(false);
          animatingRef.current = false;
        });
      });
    }, SLIDE_MS);
  };
  const goRef = useRef(go);
  goRef.current = go;

  useEffect(() => {
    if (count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const timer = window.setInterval(() => {
      if (animatingRef.current || Date.now() < pauseUntil.current) {
        return;
      }
      goRef.current(1);
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [count]);

  if (count === 0) {
    return null;
  }

  const holdAutoplay = () => {
    pauseUntil.current = Date.now() + AUTO_MS;
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (animatingRef.current || event.button !== 0) {
      return;
    }
    holdAutoplay();
    startX.current = event.clientX;
    lastDrag.current = 0;
    const raw = (event.target as HTMLElement).closest("[data-offset]")?.getAttribute("data-offset");
    pressedOffset.current = raw == null ? null : Number(raw);
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null || animatingRef.current) {
      return;
    }
    const next = event.clientX - startX.current;
    lastDrag.current = next;
    setDrag(next);
  };

  const finishGesture = () => {
    if (startX.current === null) {
      return;
    }
    holdAutoplay();
    const distance = lastDrag.current;
    const offset = pressedOffset.current;
    startX.current = null;
    lastDrag.current = 0;
    setDragging(false);
    setDrag(0);
    if (distance <= -SWIPE_PX) {
      go(1);
      return;
    }
    if (distance >= SWIPE_PX) {
      go(-1);
      return;
    }
    if (Math.abs(distance) > 10 || offset == null) {
      return;
    }
    go(offset < 0 ? -1 : 1);
  };

  const slots = [-2, -1, 0, 1, 2];
  const trackClass = [styles.track, instant ? styles.instant : "", dragging ? styles.dragging : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.wrap}>
      <div
        className={styles.viewport}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishGesture}
        onPointerCancel={finishGesture}
      >
        <div
          className={trackClass}
          style={{
            transform: `translateX(calc(${-shift} * (var(--slide) + var(--gap)) + ${drag}px))`,
          }}
        >
          {slots.map((offset) => {
            const slide = slides[((index + offset) % count + count) % count];
            return (
              <figure key={`${offset}`} className={styles.card}>
                <button
                  type="button"
                  className={styles.hit}
                  data-offset={offset}
                  aria-label={offset === 0 ? `Next: ${slide.alt}` : `Show ${slide.alt}`}
                  tabIndex={Math.abs(offset) <= 1 ? 0 : -1}
                >
                  <span className={styles.frame}>
                    <Image src={slide.src} alt="" width={900} height={900} priority={Math.abs(offset) <= 1} draggable={false} />
                  </span>
                </button>
              </figure>
            );
          })}
        </div>
      </div>
    </div>
  );
}
