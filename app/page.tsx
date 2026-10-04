import ChapterOpener from "@/components/chapter-opener/ChapterOpener";
import Fade from "@/components/fade/Fade";
import Footer from "@/components/footer/Footer";
import Frame from "@/components/frame/Frame";
import { EMAIL } from "@/components/frame/chapters";
import Hero from "@/components/hero/Hero";
import Light from "@/components/light/Light";
import Margin, { type MarginChapter } from "@/components/margin/Margin";
import Reveals from "@/components/reveals/Reveals";
import PlateLight from "@/components/work/PlateLight";
import Work from "@/components/work/Work";
import styles from "./page.module.css";

// What the running margin reads in each chapter: the openers' labels.
const MARGIN: MarginChapter[] = [
  { id: "i", numeral: "I", label: "Home" },
  { id: "ii", numeral: "II", label: "About" },
  { id: "iii", numeral: "III", label: "Work · ten" },
  { id: "iv", numeral: "IV", label: "Contact" },
];

export default function Home() {
  return (
    <>
      <Frame />
      <Margin chapters={MARGIN} dockFrom="iv" />
      <main id="content">
        <Hero />

        <section
          id="ii"
          className={styles.chapter}
          aria-labelledby="h-ii"
          data-chapter="1"
        >
          <ChapterOpener
            numeral="II"
            label="About"
            headingId="h-ii"
            statement="Self-taught, starting from a trading desk."
          >
            <div className={styles.body}>
              <p>
                I priced sport for a living at a Las Vegas sportsbook. In the
                evenings I built a live odds console streamed over Socket.io
                from BigQuery, an arbitrage detector across about fifty books,
                and a schedule that assigned traders to games. The company
                moved me into an engineering role.
              </p>
              <p>
                Then three years of full-stack work at a ticket brokerage: a
                pricing portal, and a Chrome extension that runs inside
                marketplace sites and rewrites what buyers see.
              </p>
              <p>
                Most recently, Prava: an iOS prayer and scripture app,
                designed, built, and shipped alone, with versioned prompts,
                snapshot-tested fallbacks, and cost work that is measured
                rather than assumed.
              </p>
              <p>
                Away from work I read theology and philosophy and am teaching
                myself Latin.
              </p>
            </div>
            <dl className={styles.facts}>
              <div>
                <dt>Working in</dt>
                <dd>
                  TypeScript · Node · Postgres
                  <span className={styles.join}> · </span>
                  <br className={styles.softBreak} />
                  Socket.io · BigQuery · Capacitor
                </dd>
              </div>
              <div>
                <dt>Verify</dt>
                <dd>
                  <a href="https://github.com/sbrcly">github.com/sbrcly</a>
                  <br />
                  App Store · public repos
                </dd>
              </div>
            </dl>
          </ChapterOpener>
        </section>

        <section
          id="iii"
          className={styles.chapter}
          aria-labelledby="h-iii"
          data-chapter="2"
        >
          <ChapterOpener
            numeral="III"
            label="Work · ten"
            headingId="h-iii"
            statement="Ten things built and shipped at three companies, most recent first."
          />
          <Work />
        </section>

        <section
          id="iv"
          className={styles.chapter}
          aria-labelledby="h-iv"
          data-chapter="3"
        >
          <ChapterOpener
            numeral="IV"
            label="Contact"
            headingId="h-iv"
          >
            <a
              href={`mailto:${EMAIL}`}
              className={styles.contactEmail}
              data-light="iv"
            >
              {EMAIL}
            </a>
            <p className={styles.contactNote}>
              Replies within a day. Any project here can be walked through at
              whatever depth you want, including the proprietary ones.
            </p>
          </ChapterOpener>
        </section>
      </main>
      <Footer />
      <Light />
      <PlateLight />
      <Reveals />
      <Fade />
    </>
  );
}
