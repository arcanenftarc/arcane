import { navItems, siteConfig } from "@/config/site";
import { Container, TextLink } from "@/components/ui/Container";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div>
            <p className={styles.brand}>{siteConfig.name}</p>
            <p className={styles.note}>
              {siteConfig.supplyDisplay} NFTs · {siteConfig.mintPriceDisplay} mint · {siteConfig.mintPlatform}.{" "}
              {siteConfig.domain}
            </p>
          </div>
          <nav className={styles.nav} aria-label="Footer">
            {navItems.map((item) => (
              <TextLink key={item.href} href={item.href}>
                {item.label}
              </TextLink>
            ))}
          </nav>
          <div className={styles.links}>
            <p>
              <TextLink href={siteConfig.social.x}>X</TextLink>
            </p>
            <p>
              <TextLink href={siteConfig.social.discord}>Discord</TextLink>
            </p>
            <p>
              <TextLink href={siteConfig.openSeaUrl}>OpenSea</TextLink>
            </p>
          </div>
        </div>
        <div className={styles.meta}>
          <span>Mint date: {siteConfig.mintDateDisplay}</span>
          <span>No wallet connection on this site.</span>
        </div>
      </Container>
    </footer>
  );
}
