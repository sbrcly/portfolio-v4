import Image from "next/image";
import Link from "next/link";
import { DiagramDrawing } from "@/components/diagram/Diagram";
import Lightbox from "@/components/lightbox/Lightbox";
import Plate from "./Plate";
import ProjectLinks, { hasLinks } from "./ProjectLinks";
import Rating from "./Rating";
import StackTokens from "./StackTokens";
import VenueLoop from "./VenueLoop";
import VideoPlate from "./VideoPlate";
import {
  hasPage,
  type Hero,
  type Plate as PlateData,
  type Project,
} from "./employers";
import { pageHref } from "./pages";
import styles from "./work-entry.module.css";

// Plates span the measure from 960px up (776 at 1440, the column less 240
// below 1200), the column below that, and bleed on phone.
const PLATE_SIZES =
  "(max-width: 719px) 100vw, (max-width: 959px) calc(100vw - 64px), (max-width: 1199px) calc(100vw - 304px), 776px";
const SCREEN_SIZES =
  "(max-width: 719px) 45vw, (max-width: 959px) 22vw, (max-width: 1199px) 16vw, 166px";
/** Open at full size: up to 92vw, or less where 92vh bounds it first. */
export const FULL_SIZES = "92vw";

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
        <Lightbox
          alt={plate.alt}
          full={<Image src={plate.src} alt={plate.alt} sizes={FULL_SIZES} />}
        >
          <Image src={plate.src} alt={plate.alt} sizes={PLATE_SIZES} />
        </Lightbox>
      );
    case "screens":
      // Each screen opens on its own; the surface is not a picture.
      return (
        <Plate className={styles.screens}>
          {plate.screens.map(({ src, alt }) => (
            <Lightbox
              key={alt}
              alt={alt}
              bare
              full={<Image src={src} alt={alt} sizes={FULL_SIZES} />}
            >
              <Image src={src} alt={alt} sizes={SCREEN_SIZES} />
            </Lightbox>
          ))}
        </Plate>
      );
    case "video":
      return <VideoPlate describedBy={describedBy} />;
    case "diagram":
      return (
        <Lightbox alt={plate.label}>
          <DiagramDrawing name={plate.name} label={plate.label} />
        </Lightbox>
      );
    case "venue":
      return <VenueLoop label={plate.label} />;
  }
}

/**
 * An employer's hero: title row, plate, sentence, stack, links. A system's
 * name is not a link, and its links are to the projects it is made of.
 */
export default function WorkEntry({
  project,
  cells,
}: {
  project: Hero;
  /** The employer's other projects. */
  cells: Project[];
}) {
  const { id, name, detail, rating, ratingCount, plate, sentence, stack } =
    project;
  const headingId = `w-${id}`;
  const summaryId = `${headingId}-summary`;
  const links = { project, made: hasPage(project) ? [] : cells };

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
          {hasPage(project) ? (
            <Link href={pageHref(project)}>{name}</Link>
          ) : (
            name
          )}
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
          <StackTokens items={stack.items} placeholder={stack.placeholder} />
          {hasLinks(links) && (
            // On phone the cells, next, carry a system's links.
            <p
              className={
                links.made.length
                  ? `${styles.links} ${styles.made}`
                  : styles.links
              }
            >
              <ProjectLinks {...links} />
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
