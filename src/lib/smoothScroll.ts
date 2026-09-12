const MIN_MS = 800;
const MAX_MS = 1600;

let frame = 0;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function headerOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--header-h").trim();
  const header = Number.parseFloat(raw) || 90;
  const root = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return header * (raw.endsWith("rem") ? root : 1) + 12;
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) {
    return false;
  }

  window.cancelAnimationFrame(frame);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const target = el.getBoundingClientRect().top + window.scrollY - headerOffset();
  const start = window.scrollY;
  const distance = target - start;

  if (reduce || Math.abs(distance) < 2) {
    window.scrollTo(0, target);
    window.history.pushState(null, "", `#${id}`);
    return true;
  }

  const duration = Math.min(MAX_MS, Math.max(MIN_MS, Math.abs(distance) * 0.55));
  const begun = performance.now();

  const step = (now: number) => {
    const t = Math.min(1, (now - begun) / duration);
    window.scrollTo(0, start + distance * easeInOutCubic(t));
    if (t < 1) {
      frame = window.requestAnimationFrame(step);
      return;
    }
    window.history.pushState(null, "", `#${id}`);
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
    if (!href || !href.includes("#")) {
      return;
    }
    let url: URL;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return;
    }
    if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) {
      return;
    }
    const id = decodeURIComponent(url.hash.replace(/^#/, ""));
    if (!id) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    scrollToSection(id);
  };

  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}
