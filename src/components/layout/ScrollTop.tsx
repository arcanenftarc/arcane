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
    <a className={styles.top} href="#home">
      Scroll to top
    </a>
  );
}
