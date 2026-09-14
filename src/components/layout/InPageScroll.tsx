"use client";

import { useEffect } from "react";
import {
  bindAuraPointer,
  bindInPageSectionScroll,
  bindScrollReveal,
  cleanLocation,
  scrollToSection,
  sectionFromLocation,
} from "@/lib/smoothScroll";

export function InPageScroll() {
  useEffect(() => {
    const id = sectionFromLocation();
    cleanLocation(id);
    scrollToSection(id);
    const unbindScroll = bindInPageSectionScroll();
    const unbindReveal = bindScrollReveal();
    const unbindAura = bindAuraPointer();
    const onPop = () => {
      const next = sectionFromLocation();
      cleanLocation(next);
      scrollToSection(next);
    };
    window.addEventListener("popstate", onPop);
    return () => {
      unbindScroll();
      unbindReveal();
      unbindAura();
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  return null;
}
