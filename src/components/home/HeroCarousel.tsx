"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import styles from "./HeroCarousel.module.css";

type Slide = {
  src: string;
  alt: string;
};

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const locked = useRef(false);

  if (count === 0) {
    return null;
  }

  const swipe = (nextIndex: number) => {
    const wrapped = ((nextIndex % count) + count) % count;
    if (wrapped === index || locked.current) {
      return;
    }
    locked.current = true;
    setIndex(wrapped);
    window.setTimeout(() => {
      locked.current = false;
    }, 780);
  };

  const roleFor = (i: number) => {
    const offset = (i - index + count) % count;
    if (offset === 0) {
      return "active";
    }
    if (offset === 1) {
      return "next";
    }
    if (offset === count - 1) {
      return "prev";
    }
    if (offset <= Math.floor(count / 2)) {
      return "hiddenNext";
    }
    return "hiddenPrev";
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.stage}>
        <div className={styles.sizer} aria-hidden="true" />
        {slides.map((slide, i) => {
          const role = roleFor(i);
          return (
            <figure key={slide.src} className={`${styles.card} ${styles[role]}`}>
              <button
                type="button"
                className={styles.hit}
                onClick={() => {
                  if (role === "prev") {
                    swipe(index - 1);
                    return;
                  }
                  swipe(index + 1);
                }}
                aria-label={role === "active" ? `Next: ${slide.alt}` : `Show ${slide.alt}`}
                tabIndex={role === "prev" || role === "active" || role === "next" ? 0 : -1}
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
        <button type="button" className={styles.prev} onClick={() => swipe(index - 1)} aria-label="Previous piece">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15.5 4.5 8 12l7.5 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" className={styles.next} onClick={() => swipe(index + 1)} aria-label="Next piece">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.5 4.5 16 12l-7.5 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
