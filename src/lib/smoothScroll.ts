const MIN_MS = 900;
const MAX_MS = 1700;

let frame = 0;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function headerOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--header-h").trim();
  const value = Number.parseFloat(raw) || 90;
  const root = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return value * (raw.endsWith("rem") ? root : 1) + 12;
}

export function scrollToSection(id: string) {
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

  const finish = () => window.history.replaceState(null, "", `#${id}`);

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
    if (!id || !scrollToSection(id)) {
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

  nodes.forEach((node, i) => {
    node.classList.add("reveal");
    node.style.transitionDelay = `${Math.min(i, 4) * 70}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
  );

  // Let the hidden state paint once so the first sections animate in
  // instead of appearing already-revealed.
  let raf = window.requestAnimationFrame(() => {
    raf = window.requestAnimationFrame(() => nodes.forEach((node) => observer.observe(node)));
  });

  return () => {
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
