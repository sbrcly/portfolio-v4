import RunningHeads from "./RunningHeads";
import WorkCell from "./WorkCell";
import WorkEntry from "./WorkEntry";
import { EMPLOYERS } from "./employers";
import { employerTimeline } from "./employer-timeline";
import styles from "./work.module.css";

/**
 * Chapter II: one block per employer, most recent first. Each opens with
 * the company's name as a title, then the first project as a full entry,
 * then the rest as a grid. Once the title is under the frame a row repeats
 * it there, pinned for the rest of the block.
 */
export default function Work() {
  return (
    <div className={styles.employers}>
      {EMPLOYERS.map(({ id, name, role, years, projects: [hero, ...cells] }) => (
        <section
          key={id}
          id={`employer-${id}`}
          className={styles.employer}
          aria-labelledby={`e-${id}`}
          style={
            { "--employer-timeline": employerTimeline(id) } as React.CSSProperties
          }
        >
          <header className={styles.head} data-fade="" data-cascade="children">
            <h3 id={`e-${id}`} className={styles.company}>
              {name}
            </h3>
            <p className={styles.tenure}>
              <span>{role} ·</span> <span>{years}</span>
            </p>
          </header>
          {/* The title again, so not read out twice. */}
          <div className={styles.row} aria-hidden="true" data-running-head="">
            <span className={styles.ground} />
            <span className={styles.tail} />
            <p className={styles.name} data-cascade="">
              {name}
            </p>
            <p className={styles.role} data-cascade="">
              <span>{role} ·</span> <span>{years}</span>
            </p>
          </div>
          <div className={styles.projects}>
            <WorkEntry project={hero} />
            {cells.length > 0 && (
              // The role restores the list semantics list-style: none drops.
              <ul className={styles.grid} role="list">
                {cells.map((project) => (
                  <WorkCell key={project.id} project={project} />
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}
      <RunningHeads />
    </div>
  );
}
