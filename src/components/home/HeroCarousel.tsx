"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./HeroCarousel.module.css";

type Slide = {
  src: string;
  alt: string;
};

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const prev = (index - 1 + count) % count;
  const next = (index + 1) % count;

  return (
    <div className={styles.wrap}>
      <div className={styles.stage}>
        {slides.map((slide, i) => {
          const role = i === index ? "active" : i === prev ? "prev" : i === next ? "next" : "hidden";
          return (
            <figure key={slide.src} className={`${styles.card} ${styles[role]}`}>
              <Image src={slide.src} alt={slide.alt} width={640} height={640} priority={role === "active"} />
            </figure>
          );
        })}
      </div>
      <div className={styles.nav}>
        <button type="button" onClick={() => setIndex(prev)} aria-label="Previous piece">
          Prev
        </button>
        <button type="button" onClick={() => setIndex(next)} aria-label="Next piece">
          Next
        </button>
      </div>
    </div>
  );
}
