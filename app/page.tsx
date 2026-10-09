import { Fragment } from "react";
import Link from "next/link";
import ChapterOpener from "@/components/chapter-opener/ChapterOpener";
import { DiagramDrawing } from "@/components/diagram/Diagram";
import Fade from "@/components/fade/Fade";
import Footer from "@/components/footer/Footer";
import Frame from "@/components/frame/Frame";
import { EMAIL } from "@/components/frame/chapters";
import Light from "@/components/light/Light";
import Margin, {
  type IndexEmployer,
  type MarginChapter,
} from "@/components/margin/Margin";
import projectStyles from "@/components/project-page/project-page.module.css";
import Reveals from "@/components/reveals/Reveals";
import TextLink from "@/components/text-link/TextLink";
import ExtensionLoop from "@/components/work/ExtensionLoop";
import Plate from "@/components/work/Plate";
import Work from "@/components/work/Work";
import {
  EMPLOYERS,
  FEATURED,
  type FeaturedProject,
  isFeatured,
} from "@/components/work/employers";
import { pageHref } from "@/components/work/pages";
import entryStyles from "@/components/work/work-entry.module.css";
import styles from "./page.module.css";

// What the running margin reads in each chapter: the openers' labels.
const MARGIN: MarginChapter[] = [
  { id: "i", numeral: "I", label: "About" },
  { id: "ii", numeral: "II", label: "Work" },
  { id: "iii", numeral: "III", label: "Contact" },
];

// The Work index's lines: each employer, and its projects in the order they
// are shown, the ones on the featured row marked.
const INDEX: IndexEmployer[] = EMPLOYERS.map(({ id, name, projects }) => ({
  id,
  name,
  projects: projects.map((project) => ({
    id: project.id,
    name: project.name,
    featured: isFeatured(project) ? project.featured : undefined,
  })),
}));

/** The label's second word. */
const FEATURED_AS = { engineering: "engineering", ai: "AI" } as const;

/** A featured project's plate: the extension's loop, whole, or a drawing,
    the project's own or the one it has for the row. Each keeps its
    drawing's shape. */
function FeaturedPlate({ project }: { project: FeaturedProject }) {
  const { plate, featuredPlate } = project;
  if (plate?.kind === "loop") {
    return <ExtensionLoop label={plate.label} />;
  }
  const drawing = featuredPlate ?? (plate?.kind === "diagram" ? plate : null);
  if (!drawing) throw new Error(`${project.id} has no plate for the row`);
  return (
    <Plate>
      <DiagramDrawing name={drawing.name} label={drawing.label} />
    </Plate>
  );
}

/**
 * The featured row, under the opening line that names both halves: the
 * engineering project and the AI one, side by side across the measure
 * (one under the other on the phone). Each is its plate, a mono label with
 * "Featured" in brass, the name, one sentence, and the link to the case
 * study; nothing of Work's stack, years, or meta line. The two are
 * children of the About body, whose grid seats them in one row and whose
 * cascade takes each as one part (they share a top edge, so they arrive
 * together). One alone spans the measure. A project with no page yet
 * links to its cell in Work.
 */
function FeaturedRow() {
  const alone = FEATURED.length === 1;
  return FEATURED.map((project) => {
    const { id, featured, name, sentence, featuredSentence, pending } = project;
    const href = pending ? `#work-${id}` : pageHref(project);
    return (
      <article
        key={id}
        id={`featured-${featured}`}
        className={alone ? `${styles.item} ${styles.alone}` : styles.item}
        aria-labelledby={`f-${featured}`}
      >
        <FeaturedPlate project={project} />
        <p className={styles.label}>
          <span className={styles.brass}>Featured</span> · {FEATURED_AS[featured]}
        </p>
        <h3 id={`f-${featured}`} className={styles.name}>
          <Link href={href}>{name}</Link>
        </h3>
        <p className={styles.blurb}>{featuredSentence ?? sentence}</p>
        <p className={styles.read}>
          <Link href={href} className={entryStyles.caseStudy}>
            Read the case study
          </Link>
        </p>
      </article>
    );
  });
}

// About's closing rows: where the focus is now.
const FOCUS: { label: string; lines: string[] }[] = [
  {
    label: "Reading",
    lines: [
      "The Road, Cormac McCarthy",
      "The Spirit of the Liturgy, Joseph Ratzinger",
      "Writing to Learn, William Zinsser",
      "Designing Data-Intensive Applications, Martin Kleppmann (reread)",
    ],
  },
  { label: "Studying", lines: ["AI engineering"] },
  { label: "Running", lines: ["Maui Oceanfront Marathon, 17 January 2027"] },
];

export default function Home() {
  return (
    <>
      <Frame />
      <Margin chapters={MARGIN} index={INDEX} />
      <main id="content">
        <section
          id="i"
          className={`${styles.chapter} ${styles.first}`}
          aria-labelledby="h-i"
          data-chapter="0"
        >
          <ChapterOpener
            label="About"
            headingId="h-i"
            statement="Scott Barclay"
            titled
          >
            <p className={styles.subtitle} data-cascade="">
              Full-Stack Engineer
            </p>
            <div className={styles.body} data-cascade="children">
              <p className={styles.opening}>
                From sports trader on a Las Vegas trading floor to full-stack
                engineer shipping an AI-powered prayer and scripture app.
              </p>
              <FeaturedRow />
              <p>
                The trading floor needed tools it did not have, so I built them.
                The first was a Python script that gave every matchup its proper
                ID and mapped it to a trader. That script became a department: I
                helped hire a data analyst, and the two of us built tools for
                the floor, reporting to a senior vice president. I have been
                writing software since.
              </p>
              <p>
                Most recently I designed, built, and shipped{" "}
                <TextLink href="#work-prava">Prava</TextLink>, an AI-powered iOS
                prayer and scripture app, as its only engineer. Before that I
                spent nearly four years at one of the largest ticket brokers in
                the country, integrating with Ticketmaster and other ticketing
                services through{" "}
                <TextLink href="#work-buyer-extension">
                  custom Chrome extensions
                </TextLink>{" "}
                that talked to{" "}
                <TextLink href="#work-pricing-portal">
                  our pricing portal
                </TextLink>
                . There was no blueprint and no documentation for any of it, and
                I learned more there than I think I could have in any other
                industry.
              </p>
              <p>
                The trading desk tools are still here too:{" "}
                <TextLink href="#work-live-odds-console">
                  a live odds console
                </TextLink>
                ,{" "}
                <TextLink href="#work-arbitrage-detector">
                  an arbitrage detector
                </TextLink>{" "}
                that caught the gaps sharp bettors were picking off, and{" "}
                <TextLink href="#work-trading-schedule">
                  a trading schedule
                </TextLink>
                . Each was built alone, and together they saved traders hours a
                week.
              </p>
              <p>
                I have learned what I wanted to learn from shipping an app solo.
                I want to be on a team again.
              </p>
              <p>
                Outside work I read, keep learning, run marathons, play tennis,
                and spend the rest of my time with my family. Where my focus is
                now:
              </p>
              {/* The project pages' spec rows (components/project-page), with
                  a value of several lines stacked. */}
              <dl className={`${projectStyles.spec} ${styles.rows}`}>
                {FOCUS.map(({ label, lines }) => (
                  <Fragment key={label}>
                    <dt>{label}</dt>
                    <dd>
                      {lines.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </dd>
                  </Fragment>
                ))}
              </dl>
            </div>
          </ChapterOpener>
        </section>

        <section
          id="ii"
          className={styles.chapter}
          aria-labelledby="h-ii"
          data-chapter="1"
        >
          <ChapterOpener label="Work" headingId="h-ii" />
          <Work />
        </section>

        <section
          id="iii"
          className={`${styles.chapter} ${styles.contact}`}
          aria-labelledby="h-iii"
          data-chapter="2"
        >
          <ChapterOpener label="Contact" headingId="h-iii">
            <a
              href={`mailto:${EMAIL}`}
              className={styles.contactEmail}
              data-light="iii"
              data-cascade=""
            >
              {EMAIL}
            </a>
            <p className={styles.contactNote} data-cascade="">
              Replies within a day. Any project here can be walked through at
              whatever depth you want, including the proprietary ones.
            </p>
          </ChapterOpener>
        </section>
      </main>
      <Footer />
      <Light />
      <Reveals />
      <Fade />
    </>
  );
}
