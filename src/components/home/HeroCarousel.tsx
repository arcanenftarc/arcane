"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./HeroCarousel.module.css";

type Slide = {
  src: string;
  alt: string;
};

const roles = ["prev2", "prev", "active", "next", "next2"] as const;

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const count = slides.length;
  const [index, setIndex] = useState(0);

  if (count === 0) {
    return null;
  }

  const go = (nextIndex: number) => setIndex(((nextIndex % count) + count) % count);
  const slotIndex = (offset: number) => (index + offset + count) % count;

  return (
    <div className={styles.wrap}>
      <div className={styles.stage}>
        <div className={styles.sizer} aria-hidden="true" />
        {roles.map((role, slot) => {
          const i = slotIndex(slot - 2);
          const slide = slides[i];
          return (
            <figure key={`${role}-${i}`} className={`${styles.card} ${styles[role]}`}>
              <button type="button" className={styles.hit} onClick={() => go(i)} aria-label={slide.alt}>
                <span className={styles.frame}>
                  <Image src={slide.src} alt="" width={720} height={720} priority={role === "active"} />
                </span>
              </button>
            </figure>
          );
        })}
      </div>
      <div className={styles.nav}>
        <button type="button" className={styles.prev} onClick={() => go(index - 1)} aria-label="Previous piece">
          <span />
        </button>
        <button type="button" className={styles.next} onClick={() => go(index + 1)} aria-label="Next piece">
          <span />
        </button>
      </div>
    </div>
  );
}
