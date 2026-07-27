"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const TARGETS = "main .section, main .caseAside, main .screenshotBand";

/**
 * One shared IntersectionObserver for the rise-in scroll reveals.
 * Elements are fully visible by default; the pre-animation state is a class
 * added here, only for elements below the initial viewport, only when motion
 * is allowed — so nothing is ever hidden without JS or under reduced motion.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches)
      return;

    const pending: HTMLElement[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealIn");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );

    for (const el of document.querySelectorAll<HTMLElement>(TARGETS)) {
      if (el.classList.contains("revealIn")) continue;
      // Elements in the initial viewport stay put — the page entrance covers them
      if (el.getBoundingClientRect().top < window.innerHeight * 0.85) continue;
      el.classList.add("revealInit");
      pending.push(el);
      io.observe(el);
    }

    return () => {
      io.disconnect();
      for (const el of pending) {
        if (!el.classList.contains("revealIn")) {
          el.classList.remove("revealInit");
        }
      }
    };
  }, [pathname]);

  return null;
}
