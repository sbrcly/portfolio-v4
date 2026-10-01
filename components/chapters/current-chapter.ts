import { useSyncExternalStore } from "react";
import { CHAPTERS, type ChapterId } from "@/components/frame/chapters";

/**
 * The current chapter, tracked by a single IntersectionObserver shared by
 * the nav and the light. The root is narrowed to the middle 20% of the
 * viewport. When two chapters share that band, the later one is current, so
 * the handover happens at the same line in both directions.
 */
let current: ChapterId = "i";
let observer: IntersectionObserver | null = null;
const listeners = new Set<() => void>();

function start() {
  current = "i";
  const inBand = new Set<string>();
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) inBand.add(entry.target.id);
        else inBand.delete(entry.target.id);
      }
      const last = CHAPTERS.findLast(({ id }) => inBand.has(id));
      if (last && last.id !== current) {
        current = last.id;
        listeners.forEach((listener) => listener());
      }
    },
    { rootMargin: "-40% 0px -40% 0px" }
  );

  for (const { id } of CHAPTERS) {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  }
}

export function subscribeChapter(listener: () => void) {
  listeners.add(listener);
  if (!observer) start();
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

const getServerChapter = (): ChapterId => "i";

export function useCurrentChapter() {
  return useSyncExternalStore(
    subscribeChapter,
    getCurrentChapter,
    getServerChapter
  );
}
