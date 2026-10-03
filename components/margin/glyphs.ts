/**
 * The running margin's numeral, planned as glyphs. Each chapter boundary has
 * a progress, 0 to 1 over the viewport height of scroll centered on it and
 * 0.5 on it, in the CSS variable --boundary-<n> (n is the incoming chapter's
 * data-chapter; margin.module.css has the exact window).
 * Everything here is a CSS expression of those, so the same plan is driven
 * by the view timelines or by the script that stands in for them.
 *
 * Between two numerals the shared leading glyphs hold. If the old numeral is
 * the start of the new one (I to II), the added glyphs enter over the whole
 * boundary, width and opacity together. Otherwise the old tail fades out as
 * the new one fades in at the same place: overlapping for numerals of
 * different lengths (III to IV), one after the other for a digit swapped in
 * place (01 to 02).
 */
export type MarginChapter = {
  id: string;
  /** Both empty for a chapter in which the margin shows nothing. */
  numeral: string;
  label: string;
};

export type Glyph = {
  char: string;
  /** The glyphs before it in its numeral, which set where it sits. */
  before: string;
  opacity: string;
  /** For a glyph that enters by width: the fraction of it shown. */
  width?: string;
};

export type PlannedChapter = {
  id: string;
  numeral: string;
  label: string;
  labelOpacity: string;
  /** How far the numeral is centered as this chapter's, 0 to 1. */
  weight: string;
};

// Outgoing tail ends, incoming tail starts, as boundary progress.
const OVERLAP = { outEnd: 0.6, inStart: 0.4 };
const IN_PLACE = { outEnd: 0.5, inStart: 0.5 };
// The label: out, then in, around the boundary itself.
const LABEL_OUT = [0.33, 0.5] as const;
const LABEL_IN = [0.5, 0.67] as const;
// The numeral moves to its new center over the second half.
const RECENTER = [0.5, 1] as const;

const progress = (boundary: number) => `var(--boundary-${boundary}, 0)`;

/** 0 until `from`, 1 from `to`, linear between. */
const ramp = (boundary: number, from: number, to: number) =>
  from === 0 && to === 1
    ? progress(boundary)
    : `clamp(0, (${progress(boundary)} - ${from}) / ${+(to - from).toFixed(4)}, 1)`;

const times = (a: string, b: string) =>
  a === "1" ? b : b === "1" ? a : `calc(${a} * ${b})`;
const inverse = (a: string) => (a === "0" ? "1" : `calc(1 - ${a})`);

export function planMargin(chapters: MarginChapter[]) {
  // A blank chapter takes no part: the margin is simply empty in it.
  const shown = chapters
    .map((chapter, boundary) => ({ ...chapter, boundary }))
    .filter((chapter) => chapter.numeral || chapter.label);

  type Live = Glyph & { enter: string; leave: string };
  const glyphs: Live[] = [];
  let live: Live[] = [];

  const planned: PlannedChapter[] = shown.map((chapter, index) => {
    const previous = shown[index - 1];
    const next = shown[index + 1];
    const { boundary, numeral } = chapter;

    let held = 0;
    if (previous) {
      while (
        held < numeral.length &&
        held < previous.numeral.length &&
        numeral[held] === previous.numeral[held]
      ) {
        held++;
      }
    }
    const added = held === (previous?.numeral.length ?? 0);
    const timing =
      previous?.numeral.length === numeral.length ? IN_PLACE : OVERLAP;

    for (const glyph of live.slice(held)) {
      glyph.leave = ramp(boundary, 0, timing.outEnd);
    }
    const entering = [...numeral.slice(held)].map((char, offset): Live => {
      const enter = !previous
        ? "1"
        : added
          ? progress(boundary)
          : ramp(boundary, timing.inStart, 1);
      return {
        char,
        before: numeral.slice(0, held + offset),
        opacity: "1",
        width: previous && added ? progress(boundary) : undefined,
        enter,
        leave: "0",
      };
    });
    live = [...live.slice(0, held), ...entering];
    glyphs.push(...entering);

    const arrived = previous ? ramp(boundary, ...RECENTER) : "1";
    const departed = next ? ramp(next.boundary, ...RECENTER) : "0";
    return {
      id: chapter.id,
      numeral,
      label: chapter.label,
      labelOpacity: times(
        previous ? ramp(boundary, ...LABEL_IN) : "1",
        inverse(next ? ramp(next.boundary, ...LABEL_OUT) : "0")
      ),
      weight: departed === "0" ? arrived : `calc(${arrived} - ${departed})`,
    };
  });

  return {
    chapters: planned,
    glyphs: glyphs.map(
      ({ enter, leave, ...glyph }): Glyph => ({
        ...glyph,
        opacity: times(enter, inverse(leave)),
      })
    ),
  };
}
