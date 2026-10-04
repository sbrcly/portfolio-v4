"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  getCurrentChapter,
  subscribeChapter,
} from "@/components/chapters/current-chapter";
import { hasViewTimelines, onScrollFrame } from "@/components/scroll/frames";
import SocialIcons from "@/components/social/SocialIcons";
import { planMargin, type MarginChapter } from "./glyphs";
import WorkIndex, { type IndexEmployer } from "./WorkIndex";
import { followWork } from "./work-index";
import styles from "./margin.module.css";

export type { IndexEmployer, MarginChapter };

// A chapter found this soon after mounting is where the page loaded (a deep
// link, a reload mid-page), not a handover: it swaps without animating.
const LOAD_MS = 300;

/**
 * The running margin: the current chapter's numeral and label pinned beside
 * the measure, the numeral's top edge on the top line under the frame.
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
 * and back in after it.
 *
 * Numeral and label are decorative and hidden from assistive
 * technology. The icon links are not: they are read, focused, and clicked.
 * They stand in a row from the column's edge and never move: pinned where
 * they clear the footer by 40px when the page ends.
 *
 * On the home page the margin also holds the Work index (WorkIndex.tsx),
 * under the label while chapter II is current. It comes after the icons, so
 * it follows them in the tab order.
 */
export default function Margin({
  chapters,
  index,
}: {
  chapters: MarginChapter[];
  /** The Work index's lines. The page's second chapter must be the work. */
  index?: IndexEmployer[];
}) {
  const root = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLElement>(null);
  const plan = useMemo(() => planMargin(chapters), [chapters]);

  useEffect(() => {
    const rootEl = root.current;
    const headEl = head.current;
    if (!rootEl || !headEl) return;

    const mounted = performance.now();
    const loading = () => performance.now() - mounted < LOAD_MS;
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
    const unsubscribeChapter = subscribeChapter(onChapter);
    onChapter();

    // Without view timelines, the boundaries' progress is written here, by
    // the rules in margin.module.css: the lead on the outgoing chapter, the
    // trail on the incoming one until its top is under the frame, each
    // stopping at the chapter's center, the first chapter's lead not opening
    // before the page scrolls, the trail ending with the page, and every
    // boundary done by the page's end.
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
      const write = (name: string, progress: number) => {
        const value = String(+progress.toFixed(4));
        if (rootEl.style.getPropertyValue(name) !== value) {
          rootEl.style.setProperty(name, value);
        }
      };

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
            Math.max(
              out.height,
              (height + out.height) / 2,
              index === 1 ? height : 0
            ),
            out.height + half
          );
          const trail = within(
            inCover,
            half,
            Math.min(height - frame, (height + top.height) / 2)
          );
          const progress = reduced.matches
            ? Math.max(Math.floor(lead), Math.floor(pageEnd))
            : Math.max(
                (lead +
                  Math.max(
                    trail,
                    trail / Math.max(trail + 1 - pageEnd, 0.0001)
                  )) /
                  2,
                within(pageEnd, 0.8, 1)
              );

          write(`--boundary-${incoming.dataset.chapter}`, progress);
        });
      });
    }

    // After the boundaries, which the index's frame reads.
    const stopIndex = nav.current ? followWork(nav.current) : undefined;

    return () => {
      unsubscribeChapter();
      stopFrames?.();
      stopIndex?.();
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
    <div
      ref={root}
      className={index ? `${styles.margin} ${styles.indexed}` : styles.margin}
      style={
        index &&
        ({
          "--index-employers": index.length,
          "--index-tallest": Math.max(
            ...index.map(({ projects }) => projects.length)
          ),
        } as React.CSSProperties)
      }
    >
      <div className={styles.column}>
        <div
          ref={head}
          className={styles.head}
          data-blank={plan.chapters[0]?.id !== chapters[0].id}
          aria-hidden="true"
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
        <SocialIcons className={styles.social} />
        {index && <WorkIndex ref={nav} employers={index} />}
      </div>
    </div>
  );
}
