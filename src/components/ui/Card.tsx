import styles from "./Card.module.css";

type CardProps = {
  label?: string;
  value?: string;
  children?: React.ReactNode;
};

export function Card({ label, value, children }: CardProps) {
  return (
    <article className={styles.card}>
      {label ? <span className={styles.label}>{label}</span> : null}
      {value ? <p className={styles.value}>{value}</p> : null}
      {children ? <div className={styles.body}>{children}</div> : null}
    </article>
  );
}
