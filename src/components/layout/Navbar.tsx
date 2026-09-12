"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { pageNav, siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import styles from "./Navbar.module.css";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={styles.header}>
      <Container className={styles.inner} as="div">
        <Link className={styles.wordmark} href="/#home" aria-label={`${siteConfig.name} home`}>
          {siteConfig.name}
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary">
          {pageNav.map((item) => (
            <Link key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.tools}>
          <Link className={`${styles.link} ${styles.mint} ${styles.headerMint}`} href={siteConfig.routes.mint}>
            Mint
          </Link>
          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </Container>

      <div className={`${styles.panel}${open ? ` ${styles.panelOpen}` : ""}`} id={panelId}>
        <nav aria-label="Mobile">
          {pageNav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href={siteConfig.routes.mint} className={styles.mintMobile}>
            Mint
          </Link>
        </nav>
      </div>
    </header>
  );
}
