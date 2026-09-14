const MIN_MS = 900;
const MAX_MS = 1700;

let frame = 0;

export const sectionPaths = {
  home: "/home",
  whitelist: "/whitelist",
  about: "/about",
} as const;

export type SectionId = keyof typeof sectionPaths;

const pathToSection: Record<string, SectionId> = {
  "/": "home",
  "/home": "home",
  "/whitelist": "whitelist",
  "/about": "about",
};

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function headerOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--header-h").trim();
  const value = Number.parseFloat(raw) || 90;
  const root = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return value * (raw.endsWith("rem") ? root : 1) + 12;
}

export function sectionFromLocation() {
  const hash = window.location.hash.replace(/^#/, "");
  if (hash && hash in sectionPaths) {
    return hash as SectionId;
  }
  return pathToSection[window.location.pathname] ?? "home";
}

export function cleanLocation(id: SectionId) {
  const path = sectionPaths[id];
  if (window.location.pathname !== path || window.location.search || window.location.hash) {
    window.history.replaceState(null, "", path);
  }
}

export function scrollToSection(id: string, historyMode: "replace" | "push" = "replace") {
  const el = document.getElementById(id);
  if (!el) {
    return false;
  }

  window.cancelAnimationFrame(frame);

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const wanted = el.getBoundingClientRect().top + window.scrollY - headerOffset();
  const target = Math.max(0, Math.min(wanted, maxScroll));
  const start = window.scrollY;
  const distance = target - start;
  const path = id in sectionPaths ? sectionPaths[id as SectionId] : `/${id}`;

  const finish = () => {
    if (window.location.pathname !== path || window.location.search || window.location.hash) {
      if (historyMode === "push" && window.location.pathname !== path) {
        window.history.pushState(null, "", path);
      } else {
        window.history.replaceState(null, "", path);
      }
    }
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || Math.abs(distance) < 2) {
    window.scrollTo(0, target);
    finish();
    return true;
  }

  const duration = Math.min(MAX_MS, Math.max(MIN_MS, Math.abs(distance) * 0.6));
  const begun = performance.now();

  const step = (now: number) => {
    const t = Math.min(1, (now - begun) / duration);
    window.scrollTo(0, start + distance * easeInOutCubic(t));
    if (t < 1) {
      frame = window.requestAnimationFrame(step);
      return;
    }
    finish();
  };

  frame = window.requestAnimationFrame(step);
  return true;
}

export function bindInPageSectionScroll() {
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const link = (event.target as HTMLElement | null)?.closest("a");
    if (!link || link.target === "_blank") {
      return;
    }
    const href = link.getAttribute("href");
    if (!href) {
      return;
    }
    let url: URL;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return;
    }
    if (url.origin !== window.location.origin) {
      return;
    }
    const fromHash = decodeURIComponent(url.hash.replace(/^#/, ""));
    let id: SectionId | undefined;
    if (fromHash) {
      if (!(fromHash in sectionPaths)) {
        return;
      }
      id = fromHash as SectionId;
    } else {
      id = pathToSection[url.pathname];
    }
    if (!id || !scrollToSection(id, window.location.pathname !== sectionPaths[id] ? "push" : "replace")) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
  };

  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}

export function bindScrollReveal() {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
  if (nodes.length === 0) {
    return () => {};
  }

  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    nodes.forEach((node) => node.classList.add("reveal-in"));
    return () => {};
  }

  const inView = (node: HTMLElement) => {
    const box = node.getBoundingClientRect();
    return box.bottom > 48 && box.top < window.innerHeight * 0.92;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
  );

  let raf = 0;
  const safety = window.setTimeout(() => {
    nodes.forEach((node) => node.classList.add("reveal-in"));
  }, 1800);

  raf = window.requestAnimationFrame(() => {
    raf = window.requestAnimationFrame(() => {
      nodes.forEach((node, i) => {
        node.classList.add("reveal");
        node.style.transitionDelay = `${Math.min(i, 5) * 60}ms`;
        if (inView(node)) {
          node.classList.add("reveal-in");
        } else {
          observer.observe(node);
        }
      });
    });
  });

  return () => {
    window.clearTimeout(safety);
    window.cancelAnimationFrame(raf);
    observer.disconnect();
  };
}

export function bindAuraPointer() {
  const onMove = (event: PointerEvent) => {
    const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-aura]");
    if (!target) {
      return;
    }
    const box = target.getBoundingClientRect();
    target.style.setProperty("--mx", `${event.clientX - box.left}px`);
    target.style.setProperty("--my", `${event.clientY - box.top}px`);
  };

  document.addEventListener("pointermove", onMove, { passive: true });
  return () => document.removeEventListener("pointermove", onMove);
}
