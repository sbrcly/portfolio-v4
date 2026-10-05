import Image from "next/image";
import Link from "next/link";
import Plate from "./Plate";
import ProjectLinks, { hasLinks } from "./ProjectLinks";
import type { Cell } from "./employers";
import { pageHref } from "./pages";
import styles from "./work-cell.module.css";

// Two cells across the measure with a 32px gap from 720px up (372 at 1440,
// half the column less 48 below 960, less 168 below 1200); one on phone, as
// wide as the column. The 50vw comes after a space so next/image counts it
// when it trims the srcset: without it nothing under 640w is offered.
const CELL_SIZES =
  "(max-width: 719px) calc(-40px + 100vw), (max-width: 959px) calc(-48px + 50vw), (max-width: 1199px) calc(-168px + 50vw), 372px";

/**
 * A project in an employer's grid: a 16:10 plate, the name linked to its
 * page, the sentence, the stack, any links. A pending project has a labeled
 * slot for a plate.
 */
export default function WorkCell({ project }: { project: Cell }) {
  const { id, name, sentence, stack, plate } = project;
  return (
    <li
      id={`work-${id}`}
      className={styles.cell}
      data-reveal=""
      data-fade=""
      data-cascade="children"
    >
      {plate ? (
        <Plate className={styles.plate}>
          <Image src={plate.src} alt={plate.alt} fill sizes={CELL_SIZES} />
        </Plate>
      ) : (
        <Plate className={`${styles.plate} ${styles.slot}`}>
          <span className={styles.slotLabel}>Screenshot pending</span>
        </Plate>
      )}
      <h4 className={styles.name}>
        <Link href={pageHref(project)}>{name}</Link>
      </h4>
      <p className={styles.sentence}>{sentence}</p>
      <p className={styles.spec}>
        {stack.items.join(" · ")}
        {hasLinks(project) && (
          <>
            <br />
            <ProjectLinks project={project} />
          </>
        )}
      </p>
    </li>
  );
}
