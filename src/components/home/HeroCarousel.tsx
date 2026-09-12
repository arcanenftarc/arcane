import Image from "next/image";
import styles from "./HeroCarousel.module.css";

type Slide = {
  src: string;
  alt: string;
};

function Row({ slides, labeled }: { slides: Slide[]; labeled: boolean }) {
  return (
    <div className={styles.row} aria-hidden={!labeled}>
      {slides.map((slide) => (
        <figure key={`${labeled ? "a" : "b"}-${slide.src}`} className={styles.card}>
          <span className={styles.frame}>
            <Image src={slide.src} alt={labeled ? slide.alt : ""} width={900} height={900} priority={labeled} draggable={false} />
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
          <Row slides={slides} labeled />
          <Row slides={slides} labeled={false} />
        </div>
      </div>
    </div>
  );
}
