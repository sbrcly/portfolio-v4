import ChapterOpener from "@/components/chapter-opener/ChapterOpener";
import Fade from "@/components/fade/Fade";
import Footer from "@/components/footer/Footer";
import Frame from "@/components/frame/Frame";
import { EMAIL } from "@/components/frame/chapters";
import Light from "@/components/light/Light";
import Margin, {
  type IndexEmployer,
  type MarginChapter,
} from "@/components/margin/Margin";
import Reveals from "@/components/reveals/Reveals";
import TextLink from "@/components/text-link/TextLink";
import Work from "@/components/work/Work";
import { EMPLOYERS } from "@/components/work/employers";
import styles from "./page.module.css";

// What the running margin reads in each chapter: the openers' labels.
const MARGIN: MarginChapter[] = [
  { id: "i", numeral: "I", label: "About" },
  { id: "ii", numeral: "II", label: "Work" },
  { id: "iii", numeral: "III", label: "Contact" },
];

// The Work index's lines: each employer, and its projects in the order they
// are shown.
const INDEX: IndexEmployer[] = EMPLOYERS.map(({ id, name, projects }) => ({
  id,
  name,
  projects: projects.map(({ id, name }) => ({ id, name })),
}));

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
              <p>
                I priced sport for a living at a Las Vegas sportsbook. In the
                evenings I built{" "}
                <TextLink href="#work-live-odds-console">
                  a live odds console
                </TextLink>{" "}
                streamed over Socket.io from BigQuery,{" "}
                <TextLink href="#work-arbitrage-detector">
                  an arbitrage detector
                </TextLink>{" "}
                across about fifty books, and{" "}
                <TextLink href="#work-trading-schedule">
                  a schedule that assigned traders to games
                </TextLink>
                . The company moved me into an engineering role.
              </p>
              <p>
                Then three years of full-stack work at a ticket brokerage:{" "}
                <TextLink href="#work-pricing-portal">a pricing portal</TextLink>
                , and{" "}
                <TextLink href="#work-buyer-extension">
                  a Chrome extension
                </TextLink>{" "}
                that runs inside marketplace sites and rewrites what buyers
                see.
              </p>
              <p>
                Most recently, <TextLink href="#work-prava">Prava</TextLink>:
                an iOS prayer and scripture app, designed, built, and shipped
                alone, with versioned prompts, snapshot-tested fallbacks, and
                cost work that is measured rather than assumed.
              </p>
              <p>
                Away from work I read theology and philosophy and am teaching
                myself Latin.
              </p>
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
