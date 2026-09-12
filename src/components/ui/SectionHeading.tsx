import styles from "./SectionHeading.module.css";

type SectionHeadingProps = {
  id?: string;
  index?: string;
  eyebrow: string;
  title: string;
  lede?: string;
  titleAs?: "h1" | "h2" | "h3";
};

export function SectionHeading({ id, index, eyebrow, title, lede, titleAs: Title = "h2" }: SectionHeadingProps) {
  return (
    <header className={styles.header}>
      <div className={styles.kicker}>
        {index ? <span className={styles.index}>{index}</span> : null}
        <span className={styles.eyebrow}>{eyebrow}</span>
        <span className={styles.line} aria-hidden="true" />
      </div>
      <Title className={styles.title} id={id}>
        {title}
      </Title>
      {lede ? <p className={styles.lede}>{lede}</p> : null}
    </header>
  );
}
