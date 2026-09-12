"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { pageNav, sideNav, siteConfig } from "@/config/site";
import styles from "./Navbar.module.css";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`${styles.header}${scrolled || open ? ` ${styles.scrolled}` : ""}`}>
        <div className={styles.inner}>
          <div className={styles.brand}>
            <button
              type="button"
              className={`${styles.trigger}${open ? ` ${styles.triggerOpen}` : ""}`}
              aria-expanded={open}
              aria-controls={panelId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              <span />
            </button>
            <Link className={styles.wordmark} href="/#home" aria-label={`${siteConfig.name} home`}>
              <Image src={siteConfig.assets.logo} alt="" width={36} height={36} />
              {siteConfig.name}
            </Link>
          </div>

          <nav className={styles.desktopNav} aria-label="Primary">
            {pageNav.map((item) => (
              <Link key={item.href} href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ))}
          </nav>

          <Link className={styles.mint} href={siteConfig.routes.mint}>
            <span>Mint</span>
          </Link>
        </div>
      </header>

      <div className={styles.mobnav}>
        <div className={styles.mobTop}>
          <a className={styles.mobSocial} href={siteConfig.social.x} rel="noreferrer" target="_blank">
            X
          </a>
          <Link className={styles.mint} href={siteConfig.routes.mint}>
            <span>Mint</span>
          </Link>
        </div>
        <div className={styles.mobMid}>
          <Link className={styles.wordmark} href="/#home" aria-label={`${siteConfig.name} home`}>
            <Image src={siteConfig.assets.logo} alt="" width={32} height={32} />
            {siteConfig.name}
          </Link>
          <button
            type="button"
            className={`${styles.trigger}${open ? ` ${styles.triggerOpen}` : ""}`}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
          </button>
        </div>
        <div className={`${styles.mobBot}${open ? ` ${styles.mobBotOpen}` : ""}`}>
          <nav aria-label="Mobile">
            {pageNav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div
        className={`${styles.backdrop}${open ? ` ${styles.backdropOpen}` : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside className={`${styles.drawer}${open ? ` ${styles.drawerOpen}` : ""}`} id={panelId}>
        <button type="button" className={styles.drawerClose} onClick={() => setOpen(false)} aria-label="Close menu">
          <span />
        </button>
        <ul className={styles.markets}>
          <li>
            <a href={siteConfig.openSeaUrl} rel="noreferrer" target="_blank">
              OpenSea
            </a>
          </li>
          <li>
            <a href={siteConfig.social.discord} rel="noreferrer" target="_blank">
              Discord
            </a>
          </li>
        </ul>
        <nav className={styles.drawerNav} aria-label="Site">
          {sideNav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
        <p className={styles.drawerMeta}>
          {siteConfig.supplyDisplay} · {siteConfig.mintPriceDisplay} · {siteConfig.mintPlatform}
        </p>
      </aside>
    </>
  );
}
