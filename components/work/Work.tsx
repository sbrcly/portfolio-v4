import ProjectLinks, { hasLinks } from "./ProjectLinks";
import WorkEntry from "./WorkEntry";
import { EMPLOYERS, type Plate, type Project } from "./employers";
import styles from "./work.module.css";

const plated = (project: Project): project is Project & { plate: Plate } =>
  project.plate !== undefined;

/** A project without a plate: one row of the employer's ruled list. */
function ListedProject({ project }: { project: Project }) {
  const { id, name, year, sentence } = project;
  return (
    <li id={`work-${id}`} className={styles.item}>
      <h4 className={styles.itemName}>{name}</h4>
      <span className={styles.itemYear}>{year}</span>
      <p className={styles.itemSentence}>{sentence}</p>
      {hasLinks(project) && (
        <p className={styles.itemLinks}>
          <ProjectLinks project={project} />
        </p>
      )}
    </li>
  );
}

/**
 * Chapter III: one block per employer, most recent first. Each opens with a
 * ruled row that stays under the frame for the length of its block, then
 * the projects with a plate as entries, then the rest as a ruled list.
 */
export default function Work() {
  return (
    <div className={styles.employers}>
      {EMPLOYERS.map(({ id, name, role, years, projects }) => {
        const listed = projects.filter((project) => !plated(project));
        return (
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
              {projects.filter(plated).map((project) => (
                <WorkEntry key={project.id} project={project} />
              ))}
              {listed.length > 0 && (
                // The role restores the list semantics list-style: none drops.
                <ul
                  className={styles.list}
                  role="list"
                  data-reveal=""
                  data-fade=""
                >
                  {listed.map((project) => (
                    <ListedProject key={project.id} project={project} />
                  ))}
                </ul>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
