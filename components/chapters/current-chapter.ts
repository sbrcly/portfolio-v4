import { useSyncExternalStore } from "react";

/**
 * The current chapter, tracked by a single IntersectionObserver shared by
 * the nav and the light. Chapters are the elements marked data-chapter, in
 * document order, named by their id (i to iv on the home page). The root is
 * narrowed to the middle 20% of the viewport. When two chapters share that
 * band, the later one is current, so the handover happens at the same line
 * in both directions.
 */
let current = "i";
let observer: IntersectionObserver | null = null;
let chapters: HTMLElement[] = [];
const listeners = new Set<() => void>();

function start() {
  chapters = [...document.querySelectorAll<HTMLElement>("[data-chapter]")];
  current = chapters[0]?.id ?? "i";
  const inBand = new Set<Element>();
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) inBand.add(entry.target);
        else inBand.delete(entry.target);
      }
      const last = chapters.findLast((chapter) => inBand.has(chapter));
      if (last && last.id !== current) {
        current = last.id;
        listeners.forEach((listener) => listener());
      }
    },
    { rootMargin: "-40% 0px -40% 0px" }
  );
  chapters.forEach((chapter) => observer?.observe(chapter));
}

export function subscribeChapter(listener: () => void) {
  listeners.add(listener);
  // Start, or start over when the observed page has been replaced.
  if (!observer || !chapters[0]?.isConnected) {
    observer?.disconnect();
    start();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      observer?.disconnect();
      observer = null;
    }
  };
}

export function getCurrentChapter() {
  return current;
}

const getServerChapter = () => "i";

export function useCurrentChapter() {
  return useSyncExternalStore(
    subscribeChapter,
    getCurrentChapter,
    getServerChapter
  );
}
