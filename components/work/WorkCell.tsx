import Image from "next/image";
import Link from "next/link";
import Plate from "./Plate";
import ProjectLinks, { hasLinks } from "./ProjectLinks";
import type { Cell } from "./employers";
import styles from "./work-cell.module.css";

// Two cells across the measure with a 32px gap from 720px up (372 at 1440,
// half the column less 48 below 960, less 168 below 1200); one on phone,
// where the plate bleeds. The 50vw comes after a space so next/image counts
// it when it trims the srcset: without it nothing under 640w is offered.
const CELL_SIZES =
  "(max-width: 719px) 100vw, (max-width: 959px) calc(-48px + 50vw), (max-width: 1199px) calc(-168px + 50vw), 372px";

/**
 * A project in an employer's grid: a 16:10 plate, the name and year on one
 * line, the sentence. A pending project has a labeled slot for a plate,
 * which never takes the light.
 */
export default function WorkCell({ project }: { project: Cell }) {
  const { id, name, year, sentence, plate, caseStudy } = project;
  return (
    <li
      id={`work-${id}`}
      className={styles.cell}
      data-reveal=""
      data-fade=""
    >
      {plate ? (
        <Plate className={styles.plate}>
          <Image src={plate.src} alt={plate.alt} fill sizes={CELL_SIZES} />
        </Plate>
      ) : (
        <Plate className={`${styles.plate} ${styles.slot}`} light={null}>
          <span className={styles.slotLabel}>Screenshot pending</span>
        </Plate>
      )}
      <div className={styles.head}>
        <h4 className={styles.name}>
          {caseStudy ? <Link href={caseStudy}>{name}</Link> : name}
        </h4>
        <span className={styles.year}>{year}</span>
      </div>
      <p className={styles.sentence}>{sentence}</p>
      {hasLinks(project) && (
        <p className={styles.links}>
          <ProjectLinks project={project} />
        </p>
      )}
    </li>
  );
}
