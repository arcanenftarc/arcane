import Link from "next/link";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: Variant;
  external?: boolean;
  full?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

export function Button({
  href,
  children,
  variant = "primary",
  external = false,
  full = false,
  type = "button",
  disabled,
  onClick,
}: ButtonProps) {
  const className = `${styles.button} ${styles[variant]}${full ? ` ${styles.full}` : ""}`;

  if (href) {
    if (external) {
      return (
        <a className={className} href={href} rel="noreferrer" target="_blank">
          <span>{children}</span>
        </a>
      );
    }

    return (
      <Link className={className} href={href}>
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button className={className} type={type} disabled={disabled} onClick={onClick}>
      <span>{children}</span>
    </button>
  );
}
