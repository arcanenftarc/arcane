import styles from "./SectionHeading.module.css";

type SectionHeadingProps = {
  id?: string;
  eyebrow: string;
  title: string;
  lede?: string;
  titleAs?: "h1" | "h2" | "h3";
};

export function SectionHeading({ id, eyebrow, title, lede, titleAs: Title = "h2" }: SectionHeadingProps) {
  return (
    <header className={styles.header}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <Title className={styles.title} id={id}>
        {title}
      </Title>
      {lede ? <p className={styles.lede}>{lede}</p> : null}
    </header>
  );
}
