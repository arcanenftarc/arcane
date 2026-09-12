import styles from "./Glow.module.css";

type GlowProps = {
  className?: string;
};

export function Glow({ className }: GlowProps) {
  return <div className={`${styles.glow}${className ? ` ${className}` : ""}`} aria-hidden="true" />;
}
