import { pageNav, siteConfig } from "@/config/site";
import { Container, TextLink } from "@/components/ui/Container";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer} id="footer">
      <Container>
        <div className={styles.bar}>
          <p>
            {siteConfig.name} — {siteConfig.supplyDisplay} · {siteConfig.mintPriceDisplay} mint on {siteConfig.mintPlatform}.
          </p>
          <ul>
            {pageNav.map((item) => (
              <li key={item.href}>
                <TextLink href={item.href}>{item.label}</TextLink>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
