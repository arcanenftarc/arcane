"use client";

import { useEffect } from "react";
import { bindInPageSectionScroll } from "@/lib/smoothScroll";

export function InPageScroll() {
  useEffect(() => bindInPageSectionScroll(), []);
  return null;
}
