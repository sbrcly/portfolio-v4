import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import ChapterOpener from "@/components/chapter-opener/ChapterOpener";
import Fade from "@/components/fade/Fade";
import Footer from "@/components/footer/Footer";
import Frame from "@/components/frame/Frame";
import Margin, { type MarginChapter } from "@/components/margin/Margin";
import { DiagramDrawing } from "@/components/diagram/Diagram";
import Lightbox from "@/components/lightbox/Lightbox";
import Reveals from "@/components/reveals/Reveals";
import Plate from "@/components/work/Plate";
import Rating from "@/components/work/Rating";
import StackTokens from "@/components/work/StackTokens";
import { FULL_SIZES } from "@/components/work/WorkEntry";
import type {
  Block,
  Figure,
  Media,
  PagePlate,
  Rich,
  Section,
} from "@/components/work/employers";
import type { ProjectPage as PageData } from "@/components/work/pages";
import styles from "./project-page.module.css";

const TITLE = "title";

// The title's plate spans the column: min(1120px, 100vw - 160px), 960 below
// 1200. A section's figures sit in the measure from 960px up (776 at 1440,
// the column less 240 below 1200) and stack there; from 720 to 959 a group
// is side by side in the column, 48px apart (drawings stack there too: side
// by side their text is too small to read). Everything bleeds on phone.
const COLUMN_SIZES =
  "(max-width: 719px) 100vw, (max-width: 1199px) min(960px, calc(100vw - 64px)), min(1120px, calc(100vw - 160px))";
const SCREEN_SIZES = "(max-width: 719px) 45vw, (max-width: 1199px) 22vw, 238px";
const MEASURE_SIZES =
  "(max-width: 719px) 100vw, (max-width: 959px) calc(100vw - 64px), (max-width: 1199px) calc(100vw - 304px), 776px";
const groupSizes = (count: number) =>
  `(max-width: 719px) 100vw, (max-width: 959px) calc(${100 / count}vw - ${
    (64 + 48 * (count - 1)) / count
  }px), (max-width: 1199px) calc(100vw - 304px), 776px`;

const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];

/** Running text with its emphasis and links. */
function Text({ children }: { children: Rich }) {
  if (typeof children === "string") return children;
  return children.map((part, index) =>
    typeof part === "string" ? (
      part
    ) : "em" in part ? (
      <em key={index}>{part.em}</em>
    ) : part.href.startsWith("/") ? (
      // Another page here: no new tab.
      <Link key={index} href={part.href}>
        {part.text}
      </Link>
    ) : (
      <a key={index} href={part.href} target="_blank" rel="noopener">
        {part.text}
      </a>
    )
  );
}

/** A picture in a plate that opens at full size (components/lightbox). */
function Picture({ media, sizes }: { media: Media; sizes: string }) {
  if (media.kind === "image") {
    return (
      <Lightbox
        alt={media.alt}
        full={<Image src={media.src} alt={media.alt} sizes={FULL_SIZES} />}
      >
        <Image src={media.src} alt={media.alt} sizes={sizes} />
      </Lightbox>
    );
  }
  // A diagram: the tall drawing on phone, if there is one. The dialog
  // copies whichever is drawn.
  return (
    <Lightbox alt={media.label}>
      <DiagramDrawing name={media.name} label={media.label} />
    </Lightbox>
  );
}

function PageFigure({
  figure: { media, caption },
  sizes,
  className = styles.figure,
}: {
  figure: Figure;
  sizes: string;
  className?: string;
}) {
  return (
    <figure
      className={className}
      data-reveal=""
      data-fade=""
      data-cascade="children"
    >
      <Picture media={media} sizes={sizes} />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

/** The plate under the title block, across the column. */
function TitlePlate({ plate }: { plate: PagePlate }) {
  if ("media" in plate) {
    return (
      <PageFigure
        figure={plate}
        sizes={COLUMN_SIZES}
        className={`${styles.column} ${styles.plate}`}
      />
    );
  }
  return (
    <div className={styles.column} data-fade="" data-cascade="children">
      <Plate className={styles.screens}>
        {plate.screens.map(({ src, alt, caption }) => (
          <figure key={caption}>
            <Lightbox
              alt={alt}
              bare
              full={<Image src={src} alt={alt} sizes={FULL_SIZES} />}
            >
              <Image src={src} alt={alt} sizes={SCREEN_SIZES} />
            </Lightbox>
            <figcaption>{caption}</figcaption>
          </figure>
        ))}
      </Plate>
    </div>
  );
}

function Paragraphs({ paragraphs }: { paragraphs: Rich[] }) {
  return (
    <div className={styles.body} data-cascade="children">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>
          <Text>{paragraph}</Text>
        </p>
      ))}
    </div>
  );
}

type TextBlockData = Exclude<Block, { kind: "figures" }>;

/** A part of a section's body that is text: it sits in the measure. */
function TextBlock({ block }: { block: TextBlockData }) {
  switch (block.kind) {
    case "paragraphs":
      return <Paragraphs paragraphs={block.paragraphs} />;
    case "facts":
      return (
        <dl className={styles.facts} data-cascade="children">
          {block.facts.map(({ term, detail }) => (
            <Fragment key={term}>
              <dt>{term}</dt>
              <dd>{detail}</dd>
            </Fragment>
          ))}
        </dl>
      );
    case "items":
      return (
        <div className={styles.items} data-cascade="children">
          {block.items.map(({ title, text }, index) => (
            <div key={title} className={styles.item}>
              <span className={styles.itemIndex} aria-hidden="true">
                {ROMAN[index]}
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      );
  }
}

function Figures({ figures, lead }: { figures: Figure[]; lead: boolean }) {
  const spacing = lead ? ` ${styles.lead}` : "";
  if (figures.length === 1) {
    return (
      <PageFigure
        figure={figures[0]}
        sizes={MEASURE_SIZES}
        className={styles.figure + spacing}
      />
    );
  }
  const drawn = figures.every(({ media }) => media.kind === "diagram");
  return (
    <div className={styles.group + spacing + (drawn ? ` ${styles.drawn}` : "")}>
      {figures.map((figure) => (
        <PageFigure
          key={figure.caption}
          figure={figure}
          sizes={groupSizes(figures.length)}
        />
      ))}
    </div>
  );
}

/** The row a page closes on: a note, the primary link, any others, the next
    page in the employer, and the way back. */
function Links({ page }: { page: PageData }) {
  const { note, primary, more, next } = page.links;
  return (
    <div className={styles.links} data-cascade="children">
      {note && <span className={styles.aside}>{note}</span>}
      {primary && (
        <a
          href={primary.href}
          className={styles.primary}
          target="_blank"
          rel="noopener"
        >
          {primary.label}
        </a>
      )}
      {more.map(({ label, href }) => (
        <a key={href} href={href} target="_blank" rel="noopener">
          {label}
        </a>
      ))}
      {next && <Link href={next.href}>{next.label}</Link>}
      <Link href={page.back}>Back to {page.employer.name} in II Work</Link>
    </div>
  );
}

/**
 * A numbered section, which is a chapter. Its body is taken in runs: text
 * sits in the measure, each run fading with the scroll as one block, and
 * figures stand between the runs, each fading alone. The first run opens
 * under the statement. The page's closing links end the last section.
 */
function PageSection({
  section: { id, number, label, statement, body },
  chapter,
  closing,
}: {
  section: Section;
  chapter: number;
  closing?: React.ReactNode;
}) {
  const headingId = `p-${number}`;

  const opening: TextBlockData[] = [];
  const rest: ({ text: TextBlockData[] } | { figures: Figure[] })[] = [];
  for (const block of body) {
    const last = rest.at(-1);
    if (block.kind === "figures") rest.push({ figures: block.figures });
    else if (!last) opening.push(block);
    else if ("text" in last) last.text.push(block);
    else rest.push({ text: [block] });
  }
  // The links go under the last text, or under the last figure in a run of
  // their own.
  const end = rest.at(-1);
  if (closing && end && "figures" in end) rest.push({ text: [] });
  const tail = rest.at(-1);

  return (
    <section
      id={id}
      className={closing ? `${styles.section} ${styles.last}` : styles.section}
      aria-labelledby={headingId}
      data-chapter={chapter}
    >
      <ChapterOpener
        label={label}
        headingId={headingId}
        statement={statement}
        edge
      >
        {opening.map((block, index) => (
          <TextBlock key={index} block={block} />
        ))}
        {!tail && closing}
      </ChapterOpener>
      {rest.map((run, index) =>
        "figures" in run ? (
          <Figures
            key={index}
            figures={run.figures}
            lead={index === 0 && opening.length === 0}
          />
        ) : (
          <div key={index} className={styles.after} data-fade="">
            {run.text.map((block, place) => (
              <TextBlock key={place} block={block} />
            ))}
            {run === tail && closing}
          </div>
        )
      )}
    </section>
  );
}

/**
 * A project's page, at any of the three depths (components/work/employers).
 * The title block is the same at all of them: the top row, with the way back
 * on its left; the name; the lede and the spec. Under it a Full or Standard
 * page has a plate and then its numbered sections, each a chapter the
 * running margin reads (01 to 06; nothing in the title chapter, so the
 * margin arrives with 01 and empties again above it). A section is current
 * from the moment its statement's top rises past the line 36svh down the
 * viewport, and the numeral turns over the 120px of scroll before that, in
 * either direction; the last section is current at the page's bottom as
 * well, over its last 120px of scroll (components/margin). A Note has three
 * paragraphs and no sections, so its margin has nothing to read. The icon
 * links are the footer's at every width; the margin holds none.
 *
 * The three ways back (the top row, the nav's II, the closing link) all go
 * to the employer's block in chapter II.
 */
export default function ProjectPage({ page }: { page: PageData }) {
  const { project, employer, kind, fact, sections, back } = page;
  const { name, rating, ratingCount } = project;

  const margin: MarginChapter[] = sections.length
    ? [
        { id: TITLE, numeral: "", label: "" },
        ...sections.map(({ id, number, label }) => ({
          id,
          numeral: number,
          label,
        })),
      ]
    : [];

  const separator = (
    <span className={styles.separator} aria-hidden="true">
      /
    </span>
  );
  const rated = rating !== undefined && ratingCount !== undefined;

  return (
    <>
      <Frame chapter="ii" back={back} />
      <Margin chapters={margin} turn="statement" icons={false} />
      <main id="content">
        {/* The title, and the plate or the paragraphs under it, are one
            chapter. */}
        <div id={TITLE} data-chapter="0">
          <section
            className={styles.title}
            aria-labelledby="p-h1"
            data-fade=""
          >
            <div className={styles.topRow} data-cascade="">
              <Link href={back} className={styles.back}>
                {/* The spaces are for the link's name: between flex items
                    they take no room. */}
                <span>
                  <span className={styles.brass}>II</span>&nbsp; Work
                </span>{" "}
                {separator}{" "}
                <span>
                  <span className={styles.wide}>{employer.id}&nbsp; </span>
                  {employer.name}
                </span>
              </Link>
              {/* What does not fit beside the years wraps out of sight. */}
              <div className={styles.meta}>
                <span>{page.years}</span>{" "}
                {kind && (
                  <span className={styles.more}>
                    {separator} {kind}
                  </span>
                )}{" "}
                {(rated || fact) && (
                  <span className={styles.more}>
                    {separator}{" "}
                    {rated ? (
                      <Rating rating={rating} count={ratingCount} compact />
                    ) : (
                      fact
                    )}
                  </span>
                )}
              </div>
            </div>
            <h1
              id="p-h1"
              className={
                name.includes(" ")
                  ? styles.name
                  : `${styles.name} ${styles.oneWord}`
              }
              data-cascade=""
            >
              {name}
            </h1>
            <div className={styles.intro} data-cascade="children">
              <p className={styles.lede}>{page.lede}</p>
              <dl className={styles.spec}>
                {page.spec.map((row) => (
                  <Fragment key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>
                      {"items" in row ? (
                        <StackTokens items={row.items} />
                      ) : (
                        <Text>{row.value}</Text>
                      )}
                    </dd>
                  </Fragment>
                ))}
              </dl>
            </div>
          </section>

          {page.plate && <TitlePlate plate={page.plate} />}

          {sections.length === 0 && (
            <div className={styles.note} data-reveal="" data-fade="">
              <Paragraphs paragraphs={page.paragraphs} />
              <Links page={page} />
            </div>
          )}
        </div>

        {sections.map((section, index) => (
          <PageSection
            key={section.id}
            section={section}
            chapter={index + 1}
            closing={
              index === sections.length - 1 && <Links page={page} />
            }
          />
        ))}
      </main>
      <Footer icons />
      <Reveals />
      <Fade />
    </>
  );
}
