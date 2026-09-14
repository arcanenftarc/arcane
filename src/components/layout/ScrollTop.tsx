"use client";

import { useEffect, useState } from "react";
import styles from "./ScrollTop.module.css";

export function ScrollTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) {
    return null;
  }

  return (
    <a className={styles.top} href="/home" aria-label="Back to top">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 6.5 5.5 13.2l1.4 1.4L12 9.5l5.1 5.1 1.4-1.4Z" />
      </svg>
    </a>
  );
}
