"use client";

import { useEffect } from "react";

/**
 * Chapter reveals. Content is visible by default; the hidden pre-state is
 * applied here, only to openers that start below the first viewport. Each
 * fires once at 20% visibility and is never observed again.
 */
export default function Reveals() {
  useEffect(() => {
    const hidden: Element[] = [];
    for (const el of document.querySelectorAll("[data-reveal]")) {
      if (el.getBoundingClientRect().top >= window.innerHeight) {
        el.setAttribute("data-reveal", "hidden");
        hidden.push(el);
      }
    }
    if (hidden.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // An opener taller than five viewports can never be 20% visible,
          // so a fifth of the viewport also counts.
          const rootHeight = entry.rootBounds?.height ?? window.innerHeight;
          if (
            entry.intersectionRatio >= 0.2 ||
            entry.intersectionRect.height >= rootHeight * 0.2
          ) {
            entry.target.setAttribute("data-reveal", "shown");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: [0, 0.05, 0.1, 0.15, 0.2] }
    );
    hidden.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      hidden.forEach((el) => el.setAttribute("data-reveal", ""));
    };
  }, []);

  return null;
}
