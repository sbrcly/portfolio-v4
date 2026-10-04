import { hasViewTimelines, onScrollFrame } from "@/components/scroll/frames";

// The scroll over which a line brightens, ending with what it names on the
// viewport's midline: the 24px in margin.module.css and work.module.css.
const REACH = 24;
// A tier less than half open is not there to be tabbed into.
const OPEN = 0.5;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

function write(element: HTMLElement, name: string, value: number) {
  const text = String(+value.toFixed(4));
  if (element.style.getPropertyValue(name) !== text) {
    element.style.setProperty(name, text);
  }
}

/** What a line's link jumps to. */
const target = (line: Element) => {
  const hash = line.querySelector("a")?.hash;
  return hash ? document.getElementById(hash.slice(1)) : null;
};

/**
 * The Work index's part of the scroll (WorkIndex.tsx), once a frame at most.
 *
 * The projects' brightness, always: the hero is current with its employer,
 * as bright as the employer's line, until a grid row takes over. A row is
 * current once its cells' top (their plates') is at or above the viewport's
 * midline: its lines brighten over the 24px of scroll that bring it there
 * while the lines before dim. So an open tier always has a bright line.
 * Under reduced motion the handover is a step at the midline.
 *
 * Without view timelines, also the employers' reach, by the same rule on
 * their titles, which margin.module.css otherwise reads from the employers'
 * timelines.
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

  const employers = [
    ...nav.querySelectorAll<HTMLElement>("[data-employer]"),
  ].flatMap((item) => {
    const tier = item.querySelector("ul");
    // The employer's block: its top is its title's.
    const block = target(item);
    if (!tier || !block) return [];
    // The lines' list items, which carry their color, and their projects.
    const lines = ([...tier.children] as HTMLElement[]).flatMap((line) => {
      const project = target(line);
      return project ? [{ line, project }] : [];
    });
    return [{ item, tier, block, lines }];
  });

  const stop = onScrollFrame(() => {
    if (!wide.matches) return;
    // The margin's boundary variables, as the index's own opacity.
    const present = Number(getComputedStyle(nav).opacity) > 0;
    nav.inert = !present;
    if (!present) return;

    const midline = window.innerHeight / 2;
    // How far an element's top has come up to the midline.
    const reach = (element: Element) => {
      const past = midline - element.getBoundingClientRect().top;
      // A top landed on the line has reached it, whatever the rounding.
      return reduced.matches
        ? Number(past > -0.5)
        : clamp((past + REACH) / REACH);
    };

    const reached = timelines
      ? []
      : employers.map(({ block }, index) => (index ? reach(block) : 1));

    employers.forEach(({ item, tier, lines }, index) => {
      let open: number;
      if (timelines) {
        open = Number(getComputedStyle(tier).opacity);
      } else {
        const passed = reached[index + 1] ?? 0;
        write(item, "--index-reached", reached[index]);
        write(item, "--index-passed", passed);
        open = reached[index] * (1 - passed);
      }
      tier.inert = open < OPEN;
      if (open === 0) return;

      const tops = lines.map(({ project }) =>
        project.getBoundingClientRect().top
      );
      // The hero, first, has been reached as far as its employer has.
      const near = lines.map(({ project }, place) =>
        place ? reach(project) : open
      );
      lines.forEach(({ line }, place) => {
        // The next project down: not the cell beside this one.
        const next = tops.findIndex(
          (top, other) => other > place && top > tops[place] + 0.5
        );
        write(line, "--bright", near[place] * (1 - (near[next] ?? 0)));
      });
    });
  });

  return () => {
    stop();
    nav.inert = false;
    for (const { item, tier, lines } of employers) {
      tier.inert = true;
      item.style.removeProperty("--index-reached");
      item.style.removeProperty("--index-passed");
      lines.forEach(({ line }) => line.style.removeProperty("--bright"));
    }
  };
}
