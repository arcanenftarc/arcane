import styles from "./Divider.module.css";

export function Divider() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <span className={styles.short} />
      <span className={styles.long} />
      <span className={styles.short} />
    </div>
  );
}
