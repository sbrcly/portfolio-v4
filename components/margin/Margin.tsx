"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  firstTurn,
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

// The banded head's line, as a fraction of the viewport's height, and the
// scroll over which a section arrives at it, or the page ends: the same as
// margin.module.css (36svh and 120px), for the script that stands in for
// the timelines.
const LINE = 0.36;
const BAND = 120;

/**
 * The running margin: the current chapter's numeral and label pinned beside
 * the measure, the numeral's top edge on the top line under the frame.
 * Below 960px there is no margin and the same numeral and label are in the
 * frame's bar, at its left, small and set from the left with no centering
 * (margin.module.css); the icons and the Work index are the margin's alone.
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
 * Where the chapters turn is the page's (turn). On the home page a chapter
 * is current from its top on the viewport's midline and the numeral turns
 * over the viewport of scroll around that, with a chapter that has nothing
 * to show timed: the margin fades out in it and back in after it. On a
 * project page the chapters are read by their statements (data-chapter-edge)
 * against a line 36svh down the viewport, the numeral turning over the
 * 120px of scroll before each statement reaches it, and nothing is timed:
 * the blank title block before the first section is the head itself fading
 * in on the first section's boundary (margin.module.css, the banded head).
 * A page with no chapters to read (a Note, whose array is empty) never
 * shows the head at all; the icons keep their place.
 *
 * Numeral and label are decorative and hidden from assistive
 * technology. The icon links are not: they are read, focused, and clicked.
 * They stand in a row from the column's edge and never move: pinned where
 * they clear the footer by 40px when the page ends. A page can leave them
 * to its footer instead (icons), as the project pages do.
 *
 * On the home page the margin also holds the Work index (WorkIndex.tsx),
 * under the label while chapter II is current. It comes after the icons, so
 * it follows them in the tab order.
 */
export default function Margin({
  chapters,
  index,
  turn = "top",
  icons = true,
}: {
  chapters: MarginChapter[];
  /** The Work index's lines. The page's second chapter must be the work. */
  index?: IndexEmployer[];
  /**
   * What a chapter is read by: its own top, on the viewport's midline, or
   * its statement (data-chapter-edge), on the line 36svh down.
   */
  turn?: "top" | "statement";
  /** Whether the icon links stand in the margin; the footer has them else. */
  icons?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLElement>(null);
  const plan = useMemo(() => planMargin(chapters), [chapters]);
  const banded = turn === "statement";
  // Banded: the chapter the head first has something for, if blank ones
  // come before it, whose boundary is the head's own presence; and the last
  // chapter, which the page's end brings in.
  const shown = plan.chapters[0]
    ? chapters.findIndex((chapter) => chapter.id === plan.chapters[0].id)
    : -1;
  const last = chapters.length - 1;

  useEffect(() => {
    const rootEl = root.current;
    const headEl = head.current;
    if (!rootEl || !headEl) return;

    // Timed, by the current chapter: the head out of and into a blank one.
    let unsubscribeChapter: (() => void) | undefined;
    if (!banded) {
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
      unsubscribeChapter = subscribeChapter(onChapter);
      onChapter();
    }

    // Without view timelines, the boundaries' progress is written here, by
    // the rules in margin.module.css: the lead on the outgoing chapter, the
    // trail on the incoming one until its top is under the frame, each
    // stopping at the chapter's center, the first chapter's lead not opening
    // before the page scrolls, the trail ending with the page, and every
    // boundary done by the page's end. The first boundary is no further
    // along than the scroll's own first turn.
    // Reduced motion steps at the boundary.
    let stopFrames: (() => void) | undefined;
    if (!hasViewTimelines()) {
      const sections = [
        ...document.querySelectorAll<HTMLElement>("[data-chapter]"),
      ];
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      // A window with no length is behind the scroll from its start.
      const within = (value: number, from: number, to: number) =>
        to > from
          ? Math.min(1, Math.max(0, (value - from) / (to - from)))
          : Number(value >= from);
      const write = (name: string, progress: number) => {
        const value = String(+progress.toFixed(4));
        if (rootEl.style.getPropertyValue(name) !== value) {
          rootEl.style.setProperty(name, value);
        }
      };

      // Banded: each section's statement over the band up to the line, and
      // the last section over the page's last 120px as well.
      if (banded) {
        const edges = sections.map((section) =>
          section.querySelector<HTMLElement>("[data-chapter-edge]")
        );
        stopFrames = onScrollFrame(() => {
          const height = window.innerHeight;
          const scroller = document.documentElement;
          const end = scroller.scrollHeight - scroller.clientHeight;
          const foot = within(window.scrollY, end - BAND, end);
          edges.forEach((edge, index) => {
            if (!edge) return;
            const top = edge.getBoundingClientRect().top;
            const reach = within(height * LINE - top, -BAND, 0);
            const progress = Math.max(reach, index === last ? foot : 0);
            write(
              `--boundary-${index}`,
              reduced.matches ? Math.floor(progress) : progress
            );
          });
        });
      }

      if (!banded) stopFrames = onScrollFrame(() => {
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
          const turned = reduced.matches
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
          const held = index === 1 ? firstTurn(sections[0]) : 1;
          const progress = Math.min(
            turned,
            reduced.matches ? Number(held >= 0.5) : held
          );

          write(`--boundary-${incoming.dataset.chapter}`, progress);
        });
      });
    }

    // After the boundaries, which the index's frame reads.
    const stopIndex = nav.current ? followWork(nav.current) : undefined;

    return () => {
      unsubscribeChapter?.();
      stopFrames?.();
      stopIndex?.();
    };
  }, [banded, last, plan]);

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
      className={[
        styles.margin,
        index && styles.indexed,
        banded && styles.banded,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          ...(index && {
            "--index-employers": index.length,
            "--index-tallest": Math.max(
              ...index.map(({ projects }) => projects.length)
            ),
          }),
          ...(banded && last > 0 && { [`--ends-${last}`]: 1 }),
        } as React.CSSProperties
      }
    >
      <div className={styles.column}>
        <div
          ref={head}
          className={styles.head}
          data-blank={
            banded
              ? undefined
              : plan.chapters[0]?.id !== chapters[0]?.id || !chapters[0]
          }
          style={
            banded && shown > 0
              ? { opacity: `var(--boundary-${shown})` }
              : undefined
          }
          aria-hidden="true"
        >
          <span className={styles.numeral} data-cascade="">
            {/* In the bar: every numeral unseen in one cell, so the box is
                as wide as the widest and the label never moves. */}
            <span className={styles.sizer}>
              {plan.chapters.map(({ id, numeral }) => (
                <span key={id}>{numeral}</span>
              ))}
            </span>
            <span className={styles.axis}>{numeral}</span>
          </span>
          <span className={styles.labels} data-cascade="">
            {plan.chapters.map(({ id, label, labelOpacity }) => (
              <span
                key={id}
                className={styles.label}
                style={{ opacity: labelOpacity }}
              >
                {/* How long the label is, for the bar: one that would
                    reach the nav yields. */}
                <span
                  className={styles.fit}
                  style={{ "--label-ch": label.length } as React.CSSProperties}
                >
                  {label}
                </span>
              </span>
            ))}
          </span>
        </div>
        {icons && <SocialIcons className={styles.social} />}
        {index && <WorkIndex ref={nav} employers={index} />}
      </div>
    </div>
  );
}
