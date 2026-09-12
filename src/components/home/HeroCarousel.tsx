"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./HeroCarousel.module.css";

type Slide = {
  src: string;
  alt: string;
};

const AUTO_MS = 4000;
const SLIDE_MS = 1000;

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [shift, setShift] = useState(0);
  const [instant, setInstant] = useState(false);
  const animatingRef = useRef(false);

  useEffect(() => {
    if (count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const play = () => {
      if (animatingRef.current) {
        return;
      }
      animatingRef.current = true;
      setShift(1);
      window.setTimeout(() => {
        setInstant(true);
        setIndex((current) => (current + 1) % count);
        setShift(0);
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            setInstant(false);
            animatingRef.current = false;
          });
        });
      }, SLIDE_MS);
    };

    const timer = window.setInterval(play, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [count]);

  if (count === 0) {
    return null;
  }

  const slots = [-2, -1, 0, 1, 2];
  const trackClass = `${styles.track}${instant ? ` ${styles.instant}` : ""}`;

  return (
    <div className={styles.wrap}>
      <div className={styles.viewport}>
        <div
          className={trackClass}
          style={{
            transform: `translateX(calc(${-shift} * (var(--slide) + var(--gap))))`,
          }}
        >
          {slots.map((offset) => {
            const slide = slides[((index + offset) % count + count) % count];
            return (
              <figure key={`${offset}`} className={styles.card}>
                <span className={styles.frame}>
                  <Image src={slide.src} alt={offset === 0 ? slide.alt : ""} width={900} height={900} priority={Math.abs(offset) <= 1} draggable={false} />
                </span>
              </figure>
            );
          })}
        </div>
      </div>
    </div>
  );
}
