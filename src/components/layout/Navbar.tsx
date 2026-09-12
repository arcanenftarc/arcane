"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { navItems, siteConfig } from "@/config/site";
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
        <Link className={styles.wordmark} href={siteConfig.routes.home} aria-label={`${siteConfig.name} home`}>
          {siteConfig.name}
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.link}${active ? ` ${styles.linkActive}` : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.tools}>
          <div className={styles.aside}>
            <a className={styles.social} href={siteConfig.social.x} rel="noreferrer" target="_blank">
              X
            </a>
            <a className={styles.social} href={siteConfig.social.discord} rel="noreferrer" target="_blank">
              Discord
            </a>
            <a className={styles.social} href={siteConfig.openSeaUrl} rel="noreferrer" target="_blank">
              OpenSea
            </a>
          </div>

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
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <a href={siteConfig.social.x} rel="noreferrer" target="_blank">
            X
          </a>
          <a href={siteConfig.social.discord} rel="noreferrer" target="_blank">
            Discord
          </a>
          <a href={siteConfig.openSeaUrl} rel="noreferrer" target="_blank">
            OpenSea
          </a>
        </nav>
      </div>
    </header>
  );
}
