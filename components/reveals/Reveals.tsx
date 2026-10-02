"use client";

import { useEffect } from "react";

/**
 * Chapter reveals. Content is visible by default; the hidden pre-state is
 * applied here, only to elements that start below the first viewport. Each
 * fires once at 20% visibility and never replays.
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

    // Nothing animates off screen: a part that leaves the viewport while its
    // reveal is still running jumps to the end of it.
    const leaving = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) continue;
        entry.target.getAnimations().forEach((animation) => animation.finish());
        leaving.unobserve(entry.target);
      }
    });

    const reveal = (el: Element) => {
      el.setAttribute("data-reveal", "shown");
      observer.unobserve(el);
      // Once the transitions exist, watch the parts they run on.
      requestAnimationFrame(() => {
        for (const animation of el.getAnimations({ subtree: true })) {
          const part = (animation.effect as KeyframeEffect | null)?.target;
          if (part) leaving.observe(part);
        }
      });
    };

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
            reveal(entry.target);
          } else if (entry.boundingClientRect.bottom <= 0) {
            // Jumped past (an anchor link): show it without animating
            // off screen.
            entry.target.setAttribute("data-reveal", "");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: [0, 0.05, 0.1, 0.15, 0.2] }
    );
    hidden.forEach((el) => observer.observe(el));

    // Keyboard focus never lands on something invisible.
    const onFocus = (event: FocusEvent) => {
      const el = (event.target as Element).closest('[data-reveal="hidden"]');
      if (el) reveal(el);
    };
    document.addEventListener("focusin", onFocus);

    return () => {
      observer.disconnect();
      leaving.disconnect();
      document.removeEventListener("focusin", onFocus);
      hidden.forEach((el) => el.setAttribute("data-reveal", ""));
    };
  }, []);

  return null;
}
