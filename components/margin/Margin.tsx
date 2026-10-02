"use client";

import { useEffect, useRef } from "react";
import {
  getCurrentChapter,
  subscribeChapter,
} from "@/components/chapters/current-chapter";
import {
  getLightTarget,
  subscribeLightTarget,
} from "@/components/light/handover";
import styles from "./margin.module.css";

export type MarginChapter = {
  id: string;
  /** Both empty for a chapter in which the margin shows nothing. */
  numeral: string;
  label: string;
};

// The light's handover: out, a beat of nothing, then in (600 ms, in the CSS).
const OUT_MS = 400;
const GAP_MS = 200;
// A chapter found this soon after mounting is where the page loaded (a deep
// link, a reload mid-page), not a handover: it swaps without animating.
const LOAD_MS = 300;

/**
 * One slot of the margin. A change fades the old value out, leaves the slot
 * empty for the gap, then brings in the newest value. A change mid-handover
 * drops whatever was pending, so nothing in between is ever shown. With
 * `blank`, a slot showing a blank value has nothing to hand over from: the
 * next value fades straight in.
 */
function fader(
  el: HTMLElement,
  initial: string,
  render: (value: string) => void,
  blank?: (value: string) => boolean
) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let value = initial;
  let shown = initial;
  let phase: "in" | "out" | "gap" = "in";
  let outEnd = 0;
  let timer: number | undefined;

  const gap = () => {
    phase = "gap";
    el.dataset.phase = "gap";
    render(value);
    shown = value;
    if (blank?.(shown)) {
      phase = "in";
      el.dataset.phase = "in";
      return;
    }
    timer = window.setTimeout(() => {
      phase = "in";
      el.dataset.phase = "in";
    }, GAP_MS);
  };

  return {
    set(next: string, instant: boolean) {
      if (next === value) return;
      value = next;
      window.clearTimeout(timer);

      if (instant) {
        el.dataset.phase = "load";
        render(value);
        shown = value;
        // Commit the swap before transitions come back.
        void el.offsetWidth;
        phase = "in";
        el.dataset.phase = "in";
        return;
      }

      if (phase === "in" && blank?.(shown)) {
        // Mounted hidden, then in: no out, no gap.
        el.dataset.phase = "gap";
        render(value);
        shown = value;
        void el.offsetWidth;
        el.dataset.phase = "in";
        return;
      }

      if (phase === "gap") {
        gap();
        return;
      }
      if (phase === "in") {
        phase = "out";
        el.dataset.phase = "out";
        // Reduced motion: gone at once, the gap stays.
        outEnd = performance.now() + (reduced.matches ? 0 : OUT_MS);
      }
      timer = window.setTimeout(gap, Math.max(0, outEnd - performance.now()));
    },
    stop() {
      window.clearTimeout(timer);
    },
  };
}

/** The lit plate's entry, "02 Live odds console", or nothing. */
const litEntry = () =>
  getLightTarget()?.closest<HTMLElement>("[data-entry]")?.dataset.entry ?? "";

/**
 * The running margin: the current chapter's numeral and label pinned beside
 * the measure, and under them the lit work entry. It computes nothing; it
 * shows the current chapter and the light's target, which other things own.
 * The first chapter is in the server markup, so it is there at first paint.
 */
export default function Margin({ chapters }: { chapters: MarginChapter[] }) {
  const head = useRef<HTMLDivElement>(null);
  const numeral = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const entry = useRef<HTMLSpanElement>(null);
  const first = chapters[0];

  useEffect(() => {
    const headEl = head.current;
    const numeralEl = numeral.current;
    const labelEl = label.current;
    const entryEl = entry.current;
    if (!headEl || !numeralEl || !labelEl || !entryEl) return;

    const mounted = performance.now();
    const loading = () =>
      performance.now() - mounted < LOAD_MS ||
      document.documentElement.dataset.entrance === "play";

    const find = (id: string) =>
      chapters.find((candidate) => candidate.id === id);
    const headFader = fader(
      headEl,
      chapters[0].id,
      (id) => {
        const chapter = find(id);
        if (!chapter) return;
        numeralEl.textContent = chapter.numeral;
        labelEl.textContent = chapter.label;
      },
      (id) => {
        const chapter = find(id);
        return !chapter || (!chapter.numeral && !chapter.label);
      }
    );
    const entryFader = fader(entryEl, "", (text) => {
      entryEl.textContent = text;
    });

    const onChapter = () => headFader.set(getCurrentChapter(), loading());
    const onTarget = () => entryFader.set(litEntry(), loading());
    const unsubscribeChapter = subscribeChapter(onChapter);
    const unsubscribeTarget = subscribeLightTarget(onTarget);
    onChapter();
    onTarget();

    return () => {
      unsubscribeChapter();
      unsubscribeTarget();
      headFader.stop();
      entryFader.stop();
    };
  }, [chapters]);

  return (
    <div className={styles.margin} aria-hidden="true">
      <div className={styles.column}>
        <div ref={head} className={styles.head} data-phase="in">
          <span ref={numeral} className={styles.numeral}>
            {first.numeral}
          </span>
          <span ref={label} className={styles.label}>
            {first.label}
          </span>
        </div>
        <span ref={entry} className={styles.entry} data-phase="in" />
      </div>
    </div>
  );
}
