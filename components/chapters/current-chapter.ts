import { useSyncExternalStore } from "react";

/**
 * The current chapter: the one source for the nav, the running margin, and
 * the light. Chapters are the elements marked data-chapter, in document
 * order, named by their id (i to iii on the home page). The attribute's value
 * is the chapter's position, from 0, which names its view timeline
 * (globals.css).
 *
 * One boundary: the current chapter is the last one whose top is at or above
 * the horizontal line at 50% of the viewport height. An IntersectionObserver
 * rooted on the top half of the viewport fires as a chapter's top crosses
 * that line in either direction; a recompute when scrolling ends covers a
 * fast scroll or a jump. At scroll position zero it is always the first,
 * and at the page's end the last, whose top may never reach the line.
 *
 * The first boundary is also held to the scroll (firstTurn): the second
 * chapter is not current before that is half done, however high in the
 * viewport its top starts. The running margin's first boundary is held the
 * same way, so the two turn together.
 *
 * An anchor jump (a nav click, a hash change, a load with a hash) sets its
 * chapter at once and holds it until the scroll ends, so a smooth scroll
 * never passes through the chapters in between. The anchor is a chapter or
 * something inside one (an employer's block, "employer-02").
 */
const QUIET_MS = 150; // scroll end, where there is no scrollend event

let current = "i";
let chapters: HTMLElement[] = [];
let stop: (() => void) | null = null;
const listeners = new Set<() => void>();

function set(id: string) {
  if (id === current) return;
  current = id;
  listeners.forEach((listener) => listener());
}

/**
 * How far the page has scrolled into its first boundary, 0 to 1: from scroll
 * position zero over half a viewport of scroll, or until the second
 * chapter's top is under the frame (where its anchor lands it) if that comes
 * first. The same window as --first-turn in margin.module.css. `first` is
 * the first chapter, which starts the page.
 */
export function firstTurn(first: HTMLElement) {
  const { top, height } = first.getBoundingClientRect();
  const frame =
    parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) ||
    0;
  const span = Math.min(window.innerHeight / 2, height - frame);
  return span > 0 ? Math.min(1, Math.max(0, -top / span)) : 1;
}

function resolve() {
  const first = chapters[0]?.id ?? "i";
  if (window.scrollY <= 0) return first;
  if (chapters[0] && firstTurn(chapters[0]) < 0.5) return first;
  const scroller = document.documentElement;
  if (window.scrollY >= scroller.scrollHeight - scroller.clientHeight - 1) {
    return chapters.at(-1)?.id ?? first;
  }
  const line = window.innerHeight / 2;
  const last = chapters.findLast(
    (chapter) => chapter.getBoundingClientRect().top <= line
  );
  return last?.id ?? first;
}

function start() {
  chapters = [...document.querySelectorAll<HTMLElement>("[data-chapter]")];
  current = resolve();

  // True from an anchor jump until its scroll ends.
  let jumping = false;
  let quietTimer: number | undefined;
  const hasScrollEnd = "onscrollend" in window;

  const settle = () => {
    window.clearTimeout(quietTimer);
    jumping = false;
    set(resolve());
  };
  const settleSoon = () => {
    window.clearTimeout(quietTimer);
    quietTimer = window.setTimeout(settle, QUIET_MS);
  };

  const observer = new IntersectionObserver(
    () => {
      if (!jumping) set(resolve());
    },
    { rootMargin: "0px 0px -50% 0px", threshold: 0 }
  );
  chapters.forEach((chapter) => observer.observe(chapter));

  const jumpTo = (hash: string) => {
    const anchor = hash ? document.getElementById(hash.slice(1)) : null;
    const target = chapters.find((chapter) => chapter.contains(anchor));
    if (!anchor || !target) return;
    jumping = true;
    set(target.id);
    // If nothing scrolls (already there), this settles it.
    settleSoon();
  };

  const onClick = (event: MouseEvent) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    const link = (event.target as Element).closest?.<HTMLAnchorElement>(
      "a[href]"
    );
    if (
      link &&
      link.hash &&
      link.origin === location.origin &&
      link.pathname === location.pathname
    ) {
      jumpTo(link.hash);
    }
  };
  const onHashChange = () => jumpTo(location.hash);

  // Whether the last scroll was inside the first boundary's own window: half
  // a viewport from the top at most.
  let early = true;
  const onScroll = () => {
    // With scrollend, a jump is held until that event, however the scroll
    // is paced; the timer only covers a jump that never scrolls.
    if (hasScrollEnd && jumping) window.clearTimeout(quietTimer);
    else if (!hasScrollEnd) settleSoon();

    // The first boundary's half is a scroll position, which no chapter's top
    // crosses the line at: looked for here, in and on the way out of its
    // window.
    const wasEarly = early;
    early = window.scrollY < window.innerHeight / 2;
    if (!jumping && (early || wasEarly)) set(resolve());
  };
  // The reader taking over ends a jump.
  const onInput = () => {
    if (jumping) settle();
  };

  document.addEventListener("click", onClick);
  window.addEventListener("hashchange", onHashChange);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("scrollend", settle);
  window.addEventListener("wheel", onInput, { passive: true });
  window.addEventListener("touchmove", onInput, { passive: true });
  window.addEventListener("resize", settle);

  // A load with a chapter in the URL scrolls to it like any other jump.
  jumpTo(location.hash);

  stop = () => {
    observer.disconnect();
    window.clearTimeout(quietTimer);
    document.removeEventListener("click", onClick);
    window.removeEventListener("hashchange", onHashChange);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("scrollend", settle);
    window.removeEventListener("wheel", onInput);
    window.removeEventListener("touchmove", onInput);
    window.removeEventListener("resize", settle);
    stop = null;
  };
}

export function subscribeChapter(listener: () => void) {
  listeners.add(listener);
  // Start, or start over when the observed page has been replaced.
  if (!stop || !chapters[0]?.isConnected) {
    stop?.();
    start();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) stop?.();
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
