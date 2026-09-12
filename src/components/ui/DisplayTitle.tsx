import styles from "./DisplayTitle.module.css";

export function DisplayTitle({
  text,
  as: Tag = "h2",
  id,
  align = "center",
  size = "md",
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  id?: string;
  align?: "center" | "left";
  size?: "md" | "lg";
}) {
  return (
    <Tag
      id={id}
      className={`${styles.title} ${styles[align]} ${styles[size]}`}
      data-text={text}
    >
      {text}
    </Tag>
  );
}
