import type { CSSProperties } from "react";

/**
 * An employer's running head, as its row (work.module.css, RunningHeads) and
 * the Work index in the running margin (components/margin) both read it.
 */

/** The scroll a row comes in over: --row-fade in work.module.css. */
export const FADE = 24;

/**
 * The names of an employer's two view timelines: the title's, which pins
 * the row, and the projects', whose end pushes it out. Set on the block and
 * on the employer's line in the index, and scoped on the body (globals.css).
 */
export const employerTimelines = (id: string) =>
  ({
    "--head-timeline": `--employer-${id}-head`,
    "--run-timeline": `--employer-${id}-run`,
  }) as CSSProperties;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/**
 * How far a row has come in: 0 until its title, the element before it, is
 * under the frame, and 1 a fade of scroll later.
 */
export function pinned(row: Element, frame: number) {
  const title = row.previousElementSibling;
  if (!title) return 0;
  return clamp((frame - title.getBoundingClientRect().bottom) / FADE);
}

/**
 * How far the end of its block has pushed a row out: 0 at its sticky top,
 * and 1 with its text behind the frame's solid part, which ends where the
 * row sticks.
 */
export function pushed(row: HTMLElement) {
  const style = getComputedStyle(row);
  const text = row.offsetHeight - parseFloat(style.paddingBottom);
  return clamp(
    (parseFloat(style.top) - row.getBoundingClientRect().top) / text
  );
}
