"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";
import styles from "./HeroCarousel.module.css";

type Slide = {
  src: string;
  alt: string;
};

const SWIPE_PX = 56;

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [shift, setShift] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [instant, setInstant] = useState(false);
  const startX = useRef<number | null>(null);
  const lastDrag = useRef(0);
  const pressedOffset = useRef<number | null>(null);

  if (count === 0) {
    return null;
  }

  const go = (dir: -1 | 1) => {
    if (animating || count < 2) {
      return;
    }
    setAnimating(true);
    setShift(dir);
    window.setTimeout(() => {
      setInstant(true);
      setIndex((current) => ((current + dir) % count + count) % count);
      setShift(0);
      setDrag(0);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setInstant(false);
          setAnimating(false);
        });
      });
    }, 560);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (animating || event.button !== 0) {
      return;
    }
    startX.current = event.clientX;
    lastDrag.current = 0;
    const raw = (event.target as HTMLElement).closest("[data-offset]")?.getAttribute("data-offset");
    pressedOffset.current = raw == null ? null : Number(raw);
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null || animating) {
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
  const centerSlot = 2 - shift;
  const trackClass = [
    styles.track,
    instant ? styles.instant : "",
    dragging ? styles.dragging : "",
  ]
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
            const slot = offset + 2;
            const isCenter = slot === centerSlot;
            const isNeighbor = Math.abs(slot - centerSlot) === 1;
            return (
              <figure
                key={`${offset}`}
                className={`${styles.card} ${isCenter ? styles.center : ""} ${isNeighbor ? styles.side : ""}`}
              >
                <button
                  type="button"
                  className={styles.hit}
                  data-offset={offset}
                  aria-label={isCenter ? `Next: ${slide.alt}` : `Show ${slide.alt}`}
                  tabIndex={isCenter || isNeighbor ? 0 : -1}
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
      <div className={styles.nav}>
        <button type="button" className={styles.prev} onClick={() => go(-1)} aria-label="Previous piece">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15.5 4.5 8 12l7.5 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" className={styles.next} onClick={() => go(1)} aria-label="Next piece">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.5 4.5 16 12l-7.5 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
