"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  getCurrentChapter,
  subscribeChapter,
} from "@/components/chapters/current-chapter";
import {
  getLightTarget,
  subscribeLightTarget,
} from "@/components/light/handover";
import { hasViewTimelines, onScrollFrame } from "@/components/scroll/frames";
import { planMargin, type MarginChapter } from "./glyphs";
import styles from "./margin.module.css";

export type { MarginChapter };

// The light's handover: out, a beat of nothing, then in (600 ms, in the CSS).
const OUT_MS = 400;
const GAP_MS = 200;
// A chapter found this soon after mounting is where the page loaded (a deep
// link, a reload mid-page), not a handover: it swaps without animating.
const LOAD_MS = 300;

/**
 * The margin's second line. A change fades the old value out, leaves the
 * line empty for the gap, then brings in the newest value. A change
 * mid-handover drops whatever was pending, so nothing in between is ever
 * shown.
 */
function fader(el: HTMLElement) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let value = "";
  let phase: "in" | "out" | "gap" = "in";
  let outEnd = 0;
  let timer: number | undefined;

  const gap = () => {
    phase = "gap";
    el.dataset.phase = "gap";
    el.textContent = value;
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
        el.textContent = value;
        // Commit the swap before transitions come back.
        void el.offsetWidth;
        phase = "in";
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
 * the measure on the viewport's midline, and under them the lit work entry.
 *
 * The numeral and label turn with the scroll. Every chapter's label and
 * every glyph the numeral ever shows is in the markup, each with an opacity
 * (and, for a glyph that enters, a width) that is a function of the
 * boundaries' progress (glyphs.ts). Numeral and label are both centered on
 * one fixed axis: nested around the glyphs is one box per chapter, as wide
 * as that chapter's numeral and moved left by half its width times the
 * chapter's weight, so the numeral is centered in every font and at every
 * size without measuring anything.
 *
 * Only a chapter with nothing to show is timed: the margin fades out in it
 * and back in after it. The second line keeps the light's timing.
 */
export default function Margin({ chapters }: { chapters: MarginChapter[] }) {
  const root = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const entry = useRef<HTMLSpanElement>(null);
  const plan = useMemo(() => planMargin(chapters), [chapters]);

  useEffect(() => {
    const rootEl = root.current;
    const headEl = head.current;
    const entryEl = entry.current;
    if (!rootEl || !headEl || !entryEl) return;

    const mounted = performance.now();
    const loading = () =>
      performance.now() - mounted < LOAD_MS ||
      document.documentElement.dataset.entrance === "play";

    const entryFader = fader(entryEl);

    const onChapter = () => {
      const empty = !plan.chapters.some(
        (chapter) => chapter.id === getCurrentChapter()
      );
      if (empty === (headEl.dataset.blank === "true")) return;
      if (loading()) headEl.dataset.phase = "load";
      headEl.dataset.blank = String(empty);
      if (headEl.dataset.phase) {
        // Commit the swap before transitions come back.
        void headEl.offsetWidth;
        delete headEl.dataset.phase;
      }
    };
    const onTarget = () => entryFader.set(litEntry(), loading());
    const unsubscribeChapter = subscribeChapter(onChapter);
    const unsubscribeTarget = subscribeLightTarget(onTarget);
    onChapter();
    onTarget();

    // Without view timelines, the boundaries' progress is written here, by
    // the rules in margin.module.css: the lead on the outgoing chapter, the
    // trail on the incoming one until its top is under the frame, each
    // stopping at the chapter's center, and the trail ending with the page.
    // Reduced motion steps at the boundary.
    let stopFrames: (() => void) | undefined;
    if (!hasViewTimelines()) {
      const sections = [
        ...document.querySelectorAll<HTMLElement>("[data-chapter]"),
      ];
      const wide = window.matchMedia("(min-width: 960px)");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const within = (value: number, from: number, to: number) =>
        Math.min(1, Math.max(0, (value - from) / (to - from)));

      stopFrames = onScrollFrame(() => {
        if (!wide.matches) return;
        const height = window.innerHeight;
        const half = height / 2;
        const scroller = document.documentElement;
        const end = scroller.scrollHeight - scroller.clientHeight;
        const pageEnd = end > 0 ? within(window.scrollY, end - half, end) : 0;
        // The frame's height: where an anchor lands a chapter's top.
        const frame = parseFloat(getComputedStyle(scroller).scrollPaddingTop);

        sections.forEach((incoming, index) => {
          if (index === 0) return;
          const out = sections[index - 1].getBoundingClientRect();
          const top = incoming.getBoundingClientRect();
          // How far each chapter is through its pass across the viewport.
          const outCover = height - out.top;
          const inCover = height - top.top;
          const lead = within(
            outCover,
            Math.max(out.height, (height + out.height) / 2),
            out.height + half
          );
          const trail = within(
            inCover,
            half,
            Math.min(height - frame, (height + top.height) / 2)
          );
          const progress = reduced.matches
            ? Math.floor(lead)
            : (lead +
                Math.max(trail, trail / Math.max(trail + 1 - pageEnd, 0.0001))) /
              2;

          const name = `--boundary-${incoming.dataset.chapter}`;
          const value = String(+progress.toFixed(4));
          if (rootEl.style.getPropertyValue(name) !== value) {
            rootEl.style.setProperty(name, value);
          }
        });
      });
    }

    return () => {
      unsubscribeChapter();
      unsubscribeTarget();
      entryFader.stop();
      stopFrames?.();
    };
  }, [plan]);

  const glyphs = plan.glyphs.map(({ char, before, opacity, width }, index) => (
    <span key={index} className={styles.run}>
      <span className={styles.ghost}>{before}</span>
      <span
        className={styles.glyph}
        data-enters={width ? "" : undefined}
        style={{ opacity, "--shown": width } as React.CSSProperties}
      >
        {char}
      </span>
    </span>
  ));

  // Innermost first: the glyphs, then each chapter's box around them.
  const numeral = plan.chapters.reduceRight(
    (inner, { id, numeral, weight }) => (
      <span
        key={id}
        className={styles.counter}
        style={{ "--weight": weight } as React.CSSProperties}
      >
        <span className={styles.ghostNumeral}>{numeral}</span>
        {inner}
      </span>
    ),
    <>{glyphs}</>
  );

  return (
    <div ref={root} className={styles.margin} aria-hidden="true">
      <div className={styles.column}>
        <div
          ref={head}
          className={styles.head}
          data-blank={plan.chapters[0]?.id !== chapters[0].id}
        >
          <span className={styles.numeral}>
            <span className={styles.axis}>{numeral}</span>
          </span>
          <span className={styles.labels}>
            {plan.chapters.map(({ id, label, labelOpacity }) => (
              <span
                key={id}
                className={styles.label}
                style={{ opacity: labelOpacity }}
              >
                {label}
              </span>
            ))}
          </span>
        </div>
        <span ref={entry} className={styles.entry} data-phase="in" />
      </div>
    </div>
  );
}
