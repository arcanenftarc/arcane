import type { Metadata } from "next";
import { XLoginButton } from "@/components/auth/XLoginButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Sigil } from "@/components/ui/Sigil";
import { WhitelistQuest } from "@/components/home/WhitelistQuest";
import { siteConfig } from "@/config/site";
import styles from "@/components/ui/ComingSoon.module.css";

export const metadata: Metadata = {
  title: "Whitelist",
  description: "Connect X to apply for the Arcane whitelist. No wallet required.",
};

export default function WhitelistPage() {
  return (
    <div className={styles.page}>
      <Container>
        <p className={styles.status}>Apply</p>
        <h1 className={styles.title}>Whitelist</h1>
        <Sigil />
        <p className={styles.body}>{siteConfig.copy.communityBody}</p>
        <div className={styles.quest}>
          <WhitelistQuest />
        </div>
        <div className={styles.actions}>
          <XLoginButton />
          <Button href="/#whitelist" variant="secondary">
            View on home
          </Button>
        </div>
      </Container>
    </div>
  );
}
