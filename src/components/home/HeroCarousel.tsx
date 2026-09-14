import Image from "next/image";
import { siteConfig } from "@/config/site";
import styles from "./HeroCarousel.module.css";

type Slide = {
  src: string;
  alt: string;
};

// The track scrolls by exactly one copy, so the remaining copies have to be
// wide enough to fill the viewport on large displays.
const COPIES = 4;

function Row({ slides, labeled }: { slides: Slide[]; labeled: boolean }) {
  return (
    <div className={styles.row} aria-hidden={!labeled}>
      {slides.map((slide) => (
        <figure key={slide.src} className={styles.card}>
          <span className={styles.frame}>
            <Image
              src={slide.src}
              alt={labeled ? slide.alt : ""}
              width={900}
              height={900}
              priority={labeled}
              draggable={false}
            />
            <Image
              src={siteConfig.assets.collectionBorder}
              alt=""
              fill
              sizes="(min-width: 768px) 22.5rem, 78vw"
              className={styles.ornament}
              unoptimized
              draggable={false}
            />
          </span>
        </figure>
      ))}
    </div>
  );
}

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  if (slides.length === 0) {
    return null;
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.viewport}>
        <div className={styles.track}>
          {Array.from({ length: COPIES }, (_, i) => (
            <Row key={i} slides={slides} labeled={i === 0} />
          ))}
        </div>
      </div>
    </div>
  );
}
