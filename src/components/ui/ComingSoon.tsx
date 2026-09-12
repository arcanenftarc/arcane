import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Glow } from "@/components/ui/Glow";
import styles from "./ComingSoon.module.css";

type ComingSoonProps = {
  title: string;
  body: string;
};

export function ComingSoon({ title, body }: ComingSoonProps) {
  return (
    <div className={styles.page}>
      <Container>
        <Glow />
        <p className={styles.status}>Later stage</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.body}>{body}</p>
        <div className={styles.actions}>
          <Button href={siteConfig.routes.home} variant="secondary">
            Return home
          </Button>
        </div>
      </Container>
    </div>
  );
}
