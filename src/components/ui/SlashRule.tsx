import styles from "./SlashRule.module.css";

export function SlashRule({ align = "left" }: { align?: "left" | "center" }) {
  return (
    <div className={`${styles.rule} ${styles[align]}`} aria-hidden="true">
      <span />
    </div>
  );
}
