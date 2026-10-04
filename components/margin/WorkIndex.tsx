import type { Ref } from "react";
import { employerTimeline } from "@/components/work/employer-timeline";
import styles from "./margin.module.css";

/** An employer's line and its projects' lines, the hero first. */
export type IndexEmployer = {
  id: string;
  name: string;
  projects: { id: string; name: string }[];
};

/**
 * The Work index: under the running margin's label while chapter II is
 * current, the employers in order and, under the current one, its projects.
 * The current employer is the last whose title's top is at or above the
 * viewport's midline, so there is always exactly one: the first until the
 * second's title gets there. The reader's place is told by brightness
 * alone, and every line is a link to what it names.
 *
 * Every employer's projects are in the markup; all but the current
 * employer's are closed and inert. What is present, open, and bright is
 * the scroll's (margin.module.css, work-index.ts): an employer's line reads
 * its own title's timeline and the next employer's. No aria-current: the
 * brightness is a reading position, not a selected page.
 */
export default function WorkIndex({
  employers,
  ref,
}: {
  employers: IndexEmployer[];
  ref?: Ref<HTMLElement>;
}) {
  return (
    <nav ref={ref} className={styles.index} aria-label="Work index">
      {/* The role restores the list semantics list-style: none drops. */}
      <ul className={styles.employers} role="list" data-cascade="">
        {employers.map(({ id, name, projects }, index) => (
          <li
            key={id}
            className={styles.employer}
            style={
              {
                // The first has been reached from the start, and nothing
                // comes after the last.
                "--own-timeline": index > 0 ? employerTimeline(id) : undefined,
                "--next-timeline":
                  employers[index + 1] &&
                  employerTimeline(employers[index + 1].id),
                "--lines": projects.length,
              } as React.CSSProperties
            }
            data-employer=""
          >
            <a href={`#employer-${id}`} className={styles.line}>
              {name}
            </a>
            <ul className={styles.tier} role="list" inert>
              {projects.map((project) => (
                <li key={project.id}>
                  <a href={`#work-${project.id}`} className={styles.line}>
                    {project.name}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
