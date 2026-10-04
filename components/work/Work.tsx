import WorkCell from "./WorkCell";
import WorkEntry from "./WorkEntry";
import { EMPLOYERS } from "./employers";
import styles from "./work.module.css";

/**
 * Chapter III: one block per employer, most recent first. Each opens with a
 * ruled row that stays under the frame for the length of its block, then
 * the first project as a full entry, then the rest as a grid.
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
        >
          <div className={styles.row}>
            <span className={styles.ground} aria-hidden="true" />
            <span className={styles.tail} aria-hidden="true" />
            <h3 id={`e-${id}`} className={styles.name}>
              {name}
            </h3>
            <p className={styles.role}>
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
    </div>
  );
}
