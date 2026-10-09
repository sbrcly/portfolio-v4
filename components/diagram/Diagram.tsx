import { readFileSync } from "node:fs";
import { join } from "node:path";
import Plate from "@/components/work/Plate";
import styles from "./diagram.module.css";

/**
 * Every drawing in public/diagrams, by its file's name, and whether it is
 * drawn twice: <name>-tall.svg is stacked for the phone and stands in below
 * 720px. The rest keep their shape at every width.
 */
const TALL = {
  "system-map": true,
  "code-relay": true,
  "port-scheduler": true,
  "approval-desk": true,
  "five-origins": true,
  "rule-path": true,
  "rule-lifecycle": true,
  "telemetry-funnel": true,
  "queue-reconstruction": true,
  "prompt-read-path": true,
  "entity-version-pointer": true,
  "presence-union": true,
  "readiness-horizon": true,
  "date-to-slot": true,
  "selection-funnel": true,
  "pricer-wireframe": false,
  "sheet-anatomy": false,
  "buyer-extension": false,
  "buyer-extension-still": false,
  "on-sale-system-still": false,
  "on-sale-monitor-plate": false,
  "pricing-portal-cell": false,
  "buyer-extension-cell": false,
  "on-sale-monitor-cell": false,
  "ask-the-reading": false,
} as const;

export type DiagramName = keyof typeof TALL;

const DIRECTORY = join(process.cwd(), "public", "diagrams");
const drawings = new Map<string, { viewBox: string; inner: string }>();

/** A file's viewBox and everything inside its root element. The root is
    drawn again here, so the page names and sizes it. */
function read(file: string) {
  let drawing = drawings.get(file);
  if (!drawing) {
    const source = readFileSync(join(DIRECTORY, `${file}.svg`), "utf8");
    const root = /^<svg[^>]*\sviewBox="([^"]+)"[^>]*>/.exec(source);
    const end = source.lastIndexOf("</svg>");
    if (!root || end < 0) throw new Error(`${file}.svg is not a drawing`);
    drawing = { viewBox: root[1], inner: source.slice(root[0].length, end) };
    drawings.set(file, drawing);
  }
  return drawing;
}

function Drawing({
  file,
  label,
  className,
  viewBox,
}: {
  file: string;
  label: string;
  className?: string;
  viewBox?: string;
}) {
  const { viewBox: own, inner } = read(file);
  return (
    <svg
      viewBox={viewBox ?? own}
      role="img"
      aria-label={label}
      className={className ? `${styles.drawing} ${className}` : styles.drawing}
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}

/** The drawing alone, for a plate that is already there: the tall one
    below 720px, if it has one. A drawing without one can be classed, for a
    plate that shows one of two, and cropped to a viewBox of the page's
    instead of the file's (components/work/ExtensionLoop). */
export function DiagramDrawing({
  name,
  label,
  className,
  viewBox,
}: {
  name: DiagramName;
  label: string;
  className?: string;
  viewBox?: string;
}) {
  if (!TALL[name]) {
    return (
      <Drawing
        file={name}
        label={label}
        className={className}
        viewBox={viewBox}
      />
    );
  }
  return (
    <>
      <Drawing file={name} label={label} className={styles.wide} />
      <Drawing file={`${name}-tall`} label={label} className={styles.tall} />
    </>
  );
}

type Props = {
  name: DiagramName;
  /** What the drawing shows, for a reader who cannot see it. */
  label: string;
  /** Set under the plate, in the mono. */
  caption?: string;
  /** On the plate, or on the figure if there is a caption. */
  className?: string;
};

/**
 * A diagram: an SVG from public/diagrams inlined in a plate, so it is set
 * in the page's mono and drawn in the page's colors (the files name both
 * as CSS variables), as wide as what holds it. With a caption it is a
 * figure. Server only: the file is read where the page is rendered.
 */
export default function Diagram({ name, label, caption, className }: Props) {
  if (!caption) {
    return (
      <Plate className={className}>
        <DiagramDrawing name={name} label={label} />
      </Plate>
    );
  }
  return (
    <figure
      className={className ? `${styles.figure} ${className}` : styles.figure}
    >
      <Plate>
        <DiagramDrawing name={name} label={label} />
      </Plate>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
