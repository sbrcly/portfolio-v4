import {
  getCurrentChapter,
  subscribeChapter,
} from "@/components/chapters/current-chapter";

/**
 * One lit thing per viewport. An element opts in with data-light="<chapter>";
 * the lit one carries data-lit="true", which drives its --light property
 * (see globals.css). Handover: the outgoing light cools, nothing is lit for
 * a beat, then the incoming light warms. They never overlap. A chapter with
 * no such element (every one but III, whose email is lit) has nothing lit:
 * entering it only cools, and leaving it only warms.
 */
const COOL_MS = 400;
const DARK_MS = 200;

function targetFor(chapter: string) {
  return document.querySelector<HTMLElement>(`[data-light="${chapter}"]`);
}

export function startLight() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let lit = document.querySelector<HTMLElement>('[data-lit="true"]');
  let darkUntil = 0;
  let timer: number | undefined;

  const run = () => {
    const target = targetFor(getCurrentChapter());
    if (target === lit) return;

    if (lit) {
      lit.removeAttribute("data-lit");
      lit = null;
      // Reduced motion: the cool is instant, the dark gap stays.
      darkUntil =
        performance.now() + (reduced.matches ? DARK_MS : COOL_MS + DARK_MS);
    }

    window.clearTimeout(timer);
    if (!target) return;

    timer = window.setTimeout(() => {
      const next = targetFor(getCurrentChapter());
      if (!next) return;
      next.setAttribute("data-lit", "true");
      lit = next;
    }, Math.max(0, darkUntil - performance.now()));
  };

  // Lights that are off screen change without a transition (globals.css).
  // The margin keeps the glow's spread inside the test.
  const visibility = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.toggleAttribute("data-offscreen", !entry.isIntersecting);
      }
    },
    { rootMargin: "100px" }
  );
  document
    .querySelectorAll("[data-light]")
    .forEach((el) => visibility.observe(el));

  const unsubscribe = subscribeChapter(run);
  run();

  return () => {
    visibility.disconnect();
    unsubscribe();
    window.clearTimeout(timer);
  };
}
