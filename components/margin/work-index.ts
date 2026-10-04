import { hasViewTimelines, onScrollFrame } from "@/components/scroll/frames";
import { FADE, pinned, pushed } from "@/components/work/running-head";

// An employer's grid is two cells across wherever the index shows
// (work.module.css), and both cells of a row are one place.
const COLUMNS = 2;
// A tier less than half open is not there to be tabbed into.
const OPEN = 0.5;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

function write(element: HTMLElement, name: string, value: number) {
  const text = String(+value.toFixed(4));
  if (element.style.getPropertyValue(name) !== text) {
    element.style.setProperty(name, text);
  }
}

/**
 * The Work index's part of the scroll (WorkIndex.tsx), once a frame at most.
 *
 * The projects' brightness, always: a grid row is current once its cells
 * have passed the line a jump lands them on (under the frame by their
 * scroll-margin: the pinned row and its tail), and the hero until then,
 * each handing over across the running head's fade. Under reduced motion
 * the handover is a step at the line.
 *
 * Without view timelines, also the employers' running heads, which
 * margin.module.css otherwise reads from the employers' timelines.
 *
 * And what cannot be focused: the whole index while it is absent, a tier
 * while it is closed.
 *
 * Returns the function that stops it.
 */
export function followWork(nav: HTMLElement) {
  const timelines = hasViewTimelines();
  const wide = window.matchMedia("(min-width: 960px)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const rows = [
    ...document.querySelectorAll<HTMLElement>("[data-running-head]"),
  ];

  const employers = [
    ...nav.querySelectorAll<HTMLElement>("[data-employer]"),
  ].flatMap((item, index) => {
    const tier = item.querySelector("ul");
    const row = rows[index];
    if (!tier || !row) return [];
    // The lines' list items, which carry their color.
    const [hero, ...cells] = [...tier.children] as HTMLElement[];
    // Each grid row's first cell: the anchor its line jumps to.
    const gridRows = cells
      .filter((_, cell) => cell % COLUMNS === 0)
      .map((line) => {
        const hash = line.querySelector("a")?.hash;
        return hash ? document.getElementById(hash.slice(1)) : null;
      });
    return [{ item, tier, row, hero, cells, gridRows }];
  });

  const stop = onScrollFrame(() => {
    if (!wide.matches) return;
    // The margin's boundary variables, as the index's own opacity.
    const present = Number(getComputedStyle(nav).opacity) > 0;
    nav.inert = !present;
    if (!present) return;

    const frame = parseFloat(
      getComputedStyle(document.documentElement).scrollPaddingTop
    );

    for (const { item, tier, row, hero, cells, gridRows } of employers) {
      let open: number;
      if (timelines) {
        open = Number(getComputedStyle(tier).opacity);
      } else {
        const pin = pinned(row, frame);
        const push = pushed(row);
        write(item, "--index-pinned", pin);
        write(item, "--index-pushed", push);
        open = pin * (1 - push);
      }
      tier.inert = open < OPEN;
      if (open === 0) continue;

      const passed = gridRows.map((cell) => {
        if (!cell) return 0;
        const line = frame + parseFloat(getComputedStyle(cell).scrollMarginTop);
        const past = line - cell.getBoundingClientRect().top;
        // A cell landed on the line has reached it, whatever the rounding.
        return reduced.matches ? Number(past > -0.5) : clamp(past / FADE);
      });
      write(hero, "--bright", 1 - (passed[0] ?? 0));
      cells.forEach((line, cell) => {
        const gridRow = Math.floor(cell / COLUMNS);
        write(
          line,
          "--bright",
          passed[gridRow] * (1 - (passed[gridRow + 1] ?? 0))
        );
      });
    }
  });

  return () => {
    stop();
    nav.inert = false;
    for (const { item, tier, hero, cells } of employers) {
      tier.inert = true;
      item.style.removeProperty("--index-pinned");
      item.style.removeProperty("--index-pushed");
      [hero, ...cells].forEach((line) => line.style.removeProperty("--bright"));
    }
  };
}
