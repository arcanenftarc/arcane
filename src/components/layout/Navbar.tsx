"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { XLoginButton } from "@/components/auth/XLoginButton";
import { pageNav, siteConfig } from "@/config/site";
import styles from "./Navbar.module.css";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header}${scrolled ? ` ${styles.scrolled}` : ""}`}>
      <div className={styles.inner}>
        <Link className={styles.wordmark} href="/#home" aria-label={`${siteConfig.name} home`}>
          <Image src={siteConfig.assets.logo} alt="" width={36} height={36} />
          {siteConfig.name}
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {pageNav.map((item) => (
            <Link key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ))}
          <a className={styles.mint} href={siteConfig.openSeaUrl} rel="noreferrer" target="_blank">
            Mint
          </a>
        </nav>

        <div className={styles.account}>
          <XLoginButton compact />
        </div>
      </div>
    </header>
  );
}
