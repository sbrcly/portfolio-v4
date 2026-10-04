import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ChapterOpener from "@/components/chapter-opener/ChapterOpener";
import Fade from "@/components/fade/Fade";
import Footer from "@/components/footer/Footer";
import Frame from "@/components/frame/Frame";
import Light from "@/components/light/Light";
import Margin, { type MarginChapter } from "@/components/margin/Margin";
import Reveals from "@/components/reveals/Reveals";
import Plate from "@/components/work/Plate";
import PlateLight from "@/components/work/PlateLight";
import { APP_STORE_URL, PRAVA_SITE_URL } from "@/components/work/links";
import { PRAVA_SCREENS } from "@/components/work/prava-screens";
import pravaCockpit from "@/public/images/prava-cockpit.png";
import pravaPromptLab from "@/public/images/prava-prompt-lab.png";
import pravaSimulator from "@/public/images/prava-simulator.png";
import styles from "./prava.module.css";

export const metadata: Metadata = {
  title: "Prava",
  description:
    "An iOS prayer and scripture app, designed, built, and shipped alone, from first commit to the App Store.",
};


const decisions = [
  {
    index: "i",
    title: "AI cost in three waves",
    text: "Waste first: redundant calls and oversized context. Then small-model routing for five surfaces where quality held. Then prompt caching, with a usage-event table in Postgres that checks the cache metrics the provider reports. A cost optimization you cannot measure independently is a rumor.",
  },
  {
    index: "ii",
    title: "Philosophy as a schema constraint",
    text: "The database stores what happened, never a grade. Unlimited grace is automatic, so a missed day is recorded honestly and never becomes a punishment mechanic. Deciding what the database refuses to know was the most interesting design problem in the product.",
  },
  {
    index: "iii",
    title: "The process is the second engineer",
    text: "Additive-only migrations so nothing is ever un-shippable. Snapshot-tested prompt fallbacks so an AI regression fails a test instead of a user. Features dark-shipped behind flags with written flip runbooks, so turning something on is a decision, not an event.",
  },
];

// The screens span the column: min(1120px, 100vw - 160px), 960 below 1200.
// The back-office plates sit in the measure from 960px up (776 at 1440, the
// column less 240 below 1200) and stack there; from 720 to 959 the last two
// are side by side in the column. Everything bleeds on phone.
const SCREEN_SIZES = "(max-width: 719px) 45vw, (max-width: 1199px) 22vw, 238px";
const PLATE_SIZES =
  "(max-width: 719px) 100vw, (max-width: 959px) calc(100vw - 64px), (max-width: 1199px) calc(100vw - 304px), 776px";
const HALF_PLATE_SIZES =
  "(max-width: 719px) 100vw, (max-width: 959px) calc(50vw - 56px), (max-width: 1199px) calc(100vw - 304px), 776px";

// The back-office plates share this chapter's light (see PlateLight below).
const BACK_OFFICE = "back-office";

// What the running margin reads. Nothing in the title chapter: the margin
// arrives with 01 and empties again above it.
const MARGIN: MarginChapter[] = [
  { id: "prava-title", numeral: "", label: "" },
  { id: "problem", numeral: "01", label: "The problem" },
  { id: "built", numeral: "02", label: "What was built" },
  { id: "decisions", numeral: "03", label: "Three decisions" },
  { id: BACK_OFFICE, numeral: "04", label: "The back office" },
  { id: "outcome", numeral: "05", label: "Outcome" },
];

export default function PravaPage() {
  return (
    <>
      <Frame chapter="iii" />
      <Margin chapters={MARGIN} />
      <main id="content">
        {/* Title and screens are one chapter. Nothing in it is lit. */}
        <div id="prava-title" data-chapter="0">
          <section
            className={styles.title}
            aria-labelledby="p-h1"
            data-fade=""
          >
            <div className={styles.topRow}>
              <span>
                <span className={styles.brass}>III</span>&nbsp; Work
              </span>
              <span className={styles.separator} aria-hidden="true">
                /
              </span>
              <span>01</span>
              <span className={styles.fill} />
              <span>2025 to now</span>
              <span className={styles.separator} aria-hidden="true">
                /
              </span>
              <span>iOS</span>
              <span
                className={`${styles.separator} ${styles.wide}`}
                aria-hidden="true"
              >
                /
              </span>
              <span className={styles.wide}>Live on the App Store</span>
            </div>
            <h1 id="p-h1" className={styles.name}>
              Prava
            </h1>
            <div className={styles.intro}>
              <p className={styles.lede}>
                An iOS prayer and scripture app, designed, built, and shipped
                alone, from first commit to the App Store.
              </p>
              <dl className={styles.spec}>
                <dt>Role</dt>
                <dd>Sole engineer and designer</dd>
                <dt>Stack</dt>
                <dd>
                  TypeScript · Next.js · Capacitor · Postgres with Prisma ·
                  Anthropic API
                </dd>
                <dt>Verify</dt>
                <dd>
                  <a href={APP_STORE_URL} target="_blank" rel="noopener">
                    App Store
                  </a>{" "}
                  ·{" "}
                  <a href={PRAVA_SITE_URL} target="_blank" rel="noopener">
                    joinprava.com
                  </a>
                </dd>
              </dl>
            </div>
          </section>

          <div className={styles.column} data-fade="">
            <Plate light={null} className={styles.screens}>
              {PRAVA_SCREENS.map(({ src, alt, caption }) => (
                <figure key={caption}>
                  <Image src={src} alt={alt} sizes={SCREEN_SIZES} />
                  <figcaption>{caption}</figcaption>
                </figure>
              ))}
            </Plate>
          </div>
        </div>

        <section
          id="problem"
          className={styles.section}
          aria-labelledby="p-01"
          data-chapter="1"
        >
          <ChapterOpener
            numeral="01"
            label="The problem"
            headingId="p-01"
            statement="Faith apps borrow the wrong mechanics."
          >
            <div className={styles.body}>
              <p>
                Most of them are habit trackers in vestments: streaks, scores,
                completion rings, and the quiet guilt of a missed day. Those
                mechanics reward showing up and punish honesty. The moment a
                practice becomes a scoreboard, people perform for the app
                instead of telling it the truth.
              </p>
              <p>
                What I wanted already existed and was two thousand years old:
                the Church&apos;s week, its lectionary, its prayers, its
                creeds. Prava puts that at the center across twelve traditions,
                in each tradition&apos;s own words.
              </p>
              <p>
                The founding rule is <em>record, not score</em>. It reads like
                product copy. It turned out to be an engineering constraint
                that shaped the schema, the prompts, and what the app refuses
                to measure.
              </p>
            </div>
          </ChapterOpener>
        </section>

        <section
          id="built"
          className={styles.section}
          aria-labelledby="p-02"
          data-chapter="2"
        >
          <ChapterOpener
            numeral="02"
            label="What was built"
            headingId="p-02"
            statement="A full consumer product, run by one person."
          >
            <div className={styles.body}>
              <p>
                A native-feeling iOS app with a daily journal, prayer and
                scripture surfaces, a weekly lectionary, and small
                accountability circles. The AI teaches and reflects. It never
                touches the Church&apos;s fixed texts: creeds and historic
                prayers render exactly as written, enforced by CI scanners
                rather than good intentions.
              </p>
            </div>
            <dl className={styles.facts}>
              <dt>Platform</dt>
              <dd>
                Next.js and TypeScript inside Capacitor / WKWebView as a native
                iOS app
              </dd>
              <dt>AI</dt>
              <dd>
                Thirteen grounded surfaces, each reading versioned system
                prompts with snapshot-tested fallbacks
              </dd>
              <dt>Data</dt>
              <dd>Postgres with Prisma, additive-only migrations</dd>
              <dt>Revenue</dt>
              <dd>Freemium subscriptions, monthly and annual</dd>
              <dt>Infra</dt>
              <dd>
                Object storage, error monitoring, product analytics with
                feature flags
              </dd>
            </dl>
          </ChapterOpener>
        </section>

        <section
          id="decisions"
          className={styles.section}
          aria-labelledby="p-03"
          data-chapter="3"
        >
          <ChapterOpener
            numeral="03"
            label="Three decisions"
            headingId="p-03"
            statement="Decisions I would defend in any interview."
          >
            <div className={styles.decisions}>
              {decisions.map(({ index, title, text }) => (
                <div key={index} className={styles.decision}>
                  <span className={styles.decisionIndex} aria-hidden="true">
                    {index}
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ChapterOpener>
        </section>

        <section
          id={BACK_OFFICE}
          className={styles.section}
          aria-labelledby="p-04"
          data-chapter="4"
        >
          <ChapterOpener
            numeral="04"
            label="The back office"
            headingId="p-04"
            statement="Eleven internal tools nobody sees."
          >
            <div className={styles.body}>
              <p>
                The Prompt Lab versions every system prompt behind the thirteen
                AI surfaces and shows history, diffs, and drift between the
                database and the in-code fallback. The Profile Simulator builds
                a user from life contexts and runs the selection algorithm,
                scores included, so tuning the matcher takes an afternoon
                instead of a release cycle.
              </p>
            </div>
          </ChapterOpener>
          <figure className={styles.figure} data-reveal="" data-fade="">
            <Plate light={BACK_OFFICE}>
              <Image
                src={pravaCockpit}
                alt="Prava's admin home: a grid of eleven internal tool cards including Analytics, Commitments, Memory Verse, Prayers and Creeds, Lectionary, Teaching, Discovery, Prompt Lab, and more."
                sizes={PLATE_SIZES}
              />
            </Plate>
            <figcaption>The cockpit: eleven tools, one stack.</figcaption>
          </figure>
          <div className={styles.pair}>
            <figure className={styles.figure} data-reveal="" data-fade="">
              <Plate light={BACK_OFFICE}>
                <Image
                  src={pravaPromptLab}
                  alt="The Prompt Lab: versioned system prompt surfaces with history, diffs, and drift between database and in-code fallback."
                  sizes={HALF_PLATE_SIZES}
                />
              </Plate>
              <figcaption>
                Prompt Lab: versioned prompts, diffed and drift-checked.
              </figcaption>
            </figure>
            <figure className={styles.figure} data-reveal="" data-fade="">
              <Plate light={BACK_OFFICE}>
                <Image
                  src={pravaSimulator}
                  alt="The Profile Simulator: a built user profile on the left, simulation results and a scored daily selection preview on the right."
                  sizes={HALF_PLATE_SIZES}
                />
              </Plate>
              <figcaption>
                Profile Simulator: the matching algorithm, testable in an
                afternoon.
              </figcaption>
            </figure>
          </div>
        </section>

        <section
          id="outcome"
          className={`${styles.section} ${styles.last}`}
          aria-labelledby="p-05"
          data-chapter="5"
        >
          <ChapterOpener
            numeral="05"
            label="Outcome"
            headingId="p-05"
            statement="Live, used across a dozen denominations, paying for itself."
          >
            <div className={styles.body}>
              <p>
                On the App Store since Easter 2026, with paying subscribers on
                monthly and annual plans. The specific numbers stay off the
                internet on purpose and are available in an interview.
              </p>
            </div>
            <div className={styles.links}>
              <a
                href={APP_STORE_URL}
                className={styles.primary}
                target="_blank"
                rel="noopener"
              >
                App Store listing
              </a>
              <a href={PRAVA_SITE_URL} target="_blank" rel="noopener">
                joinprava.com
              </a>
              <Link href="/#iii">Back to III Work</Link>
            </div>
          </ChapterOpener>
        </section>
      </main>
      <Footer />
      <Light />
      <PlateLight chapter={BACK_OFFICE} />
      <Reveals />
      <Fade />
    </>
  );
}
