"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import styles from "./HeroCarousel.module.css";

type Slide = {
  src: string;
  alt: string;
};

const roles = ["prev2", "prev", "active", "next", "next2"] as const;

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<"prev" | "next">("next");
  const [swiping, setSwiping] = useState(false);
  const timer = useRef<number | null>(null);

  if (count === 0) {
    return null;
  }

  const slotIndex = (offset: number) => (index + offset + count) % count;

  const swipe = (nextIndex: number, direction: "prev" | "next") => {
    const wrapped = ((nextIndex % count) + count) % count;
    if (wrapped === index) {
      return;
    }
    setDir(direction);
    setSwiping(true);
    setIndex(wrapped);
    if (timer.current) {
      window.clearTimeout(timer.current);
    }
    timer.current = window.setTimeout(() => setSwiping(false), 620);
  };

  const onCardClick = (role: (typeof roles)[number], i: number) => {
    if (role === "prev" || role === "prev2") {
      swipe(i, "prev");
      return;
    }
    swipe(i === index ? index + 1 : i, "next");
  };

  return (
    <div className={styles.wrap} data-dir={dir} data-swiping={swiping ? dir : undefined}>
      <div className={styles.stage}>
        <div className={styles.sizer} aria-hidden="true" />
        {roles.map((role, slot) => {
          const i = slotIndex(slot - 2);
          const slide = slides[i];
          return (
            <figure key={`${role}-${i}`} className={`${styles.card} ${styles[role]}`}>
              <button
                type="button"
                className={styles.hit}
                onClick={() => onCardClick(role, i)}
                aria-label={role === "active" ? `Next: ${slide.alt}` : `Show ${slide.alt}`}
              >
                <span className={styles.frame}>
                  <Image src={slide.src} alt="" width={900} height={900} priority={role === "active"} />
                </span>
              </button>
            </figure>
          );
        })}
      </div>
      <div className={styles.nav}>
        <button type="button" className={styles.prev} onClick={() => swipe(index - 1, "prev")} aria-label="Previous piece">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15.5 4.5 8 12l7.5 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" className={styles.next} onClick={() => swipe(index + 1, "next")} aria-label="Next piece">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.5 4.5 16 12l-7.5 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
