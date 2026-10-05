import Image from "next/image";
import Link from "next/link";
import ExtensionDiagram from "./ExtensionDiagram";
import Plate from "./Plate";
import ProjectLinks, { hasLinks } from "./ProjectLinks";
import Rating from "./Rating";
import VideoPlate from "./VideoPlate";
import type { Hero, Plate as PlateData } from "./employers";
import styles from "./work-entry.module.css";

// Plates span the measure from 960px up (776 at 1440, the column less 240
// below 1200), the column below that, and bleed on phone.
const PLATE_SIZES =
  "(max-width: 719px) 100vw, (max-width: 959px) calc(100vw - 64px), (max-width: 1199px) calc(100vw - 304px), 776px";
const SCREEN_SIZES =
  "(max-width: 719px) 45vw, (max-width: 959px) 22vw, (max-width: 1199px) 16vw, 166px";

function ProjectPlate({
  plate,
  describedBy,
}: {
  plate: PlateData;
  describedBy: string;
}) {
  switch (plate.kind) {
    case "image":
      return (
        <Plate>
          <Image src={plate.src} alt={plate.alt} sizes={PLATE_SIZES} />
        </Plate>
      );
    case "screens":
      return (
        <Plate className={styles.screens}>
          {plate.screens.map(({ src, alt }) => (
            <Image key={alt} src={src} alt={alt} sizes={SCREEN_SIZES} />
          ))}
        </Plate>
      );
    case "video":
      return <VideoPlate describedBy={describedBy} />;
    case "diagram":
      return <ExtensionDiagram />;
  }
}

/** An employer's hero project: title row, plate, sentence, stack, links. */
export default function WorkEntry({ project }: { project: Hero }) {
  const { id, name, detail, rating, ratingCount, plate, sentence, stack, caseStudy } =
    project;
  const headingId = `w-${id}`;
  const summaryId = `${headingId}-summary`;

  return (
    <article
      id={`work-${id}`}
      className={styles.entry}
      aria-labelledby={headingId}
      data-reveal=""
      data-fade=""
    >
      <div className={styles.titleRow} data-cascade="">
        <h4 id={headingId} className={styles.title}>
          {caseStudy ? <Link href={caseStudy}>{name}</Link> : name}
        </h4>
        {detail && (
          <span className={styles.meta}>
            {detail}
            {rating !== undefined && ratingCount !== undefined && (
              <>
                {" · "}
                <Rating rating={rating} count={ratingCount} />
              </>
            )}
          </span>
        )}
      </div>
      <div className={styles.media} data-cascade="">
        <ProjectPlate plate={plate} describedBy={summaryId} />
      </div>
      <div className={styles.caption} data-cascade="children">
        <p id={summaryId} className={styles.sentence}>
          {sentence}
        </p>
        <div className={styles.spec}>
          {stack.items.join(" · ")}
          {hasLinks(project) && (
            <>
              <br />
              <ProjectLinks project={project} />
            </>
          )}
        </div>
      </div>
    </article>
  );
}
