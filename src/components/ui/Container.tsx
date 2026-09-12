import Link from "next/link";
import styles from "./Container.module.css";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav";
};

export function Container({ children, className, as: Tag = "div" }: ContainerProps) {
  return <Tag className={`${styles.container}${className ? ` ${className}` : ""}`}>{children}</Tag>;
}

export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const isExternal = href.startsWith("http");
  if (isExternal) {
    return (
      <a href={href} className={className} rel="noreferrer" target="_blank">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
