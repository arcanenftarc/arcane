import styles from "./Sigil.module.css";

export function Sigil({
  align = "center",
  className,
}: {
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={`${styles.sigil} ${styles[align]}${className ? ` ${className}` : ""}`} aria-hidden="true">
      <span className={styles.line} />
      <span className={styles.gem} />
      <span className={styles.line} />
    </div>
  );
}
