"use client";

import { useEffect } from "react";
import { bindAuraPointer, bindInPageSectionScroll, bindScrollReveal } from "@/lib/smoothScroll";

export function InPageScroll() {
  useEffect(() => {
    const unbindScroll = bindInPageSectionScroll();
    const unbindReveal = bindScrollReveal();
    const unbindAura = bindAuraPointer();
    return () => {
      unbindScroll();
      unbindReveal();
      unbindAura();
    };
  }, []);

  return null;
}
