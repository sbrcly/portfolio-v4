import Image from "next/image";
import Link from "next/link";
import arbitrageTable from "@/public/images/arbitrage-table.png";
import pravaCircle from "@/public/images/prava-circle.png";
import pravaHome from "@/public/images/prava-home.png";
import pravaJournal from "@/public/images/prava-journal.png";
import pravaLectio from "@/public/images/prava-lectio.png";
import tradingSchedule from "@/public/images/trading-schedule.png";
import ExtensionDiagram from "./ExtensionDiagram";
import Plate from "./Plate";
import VideoPlate from "./VideoPlate";
import WorkEntry from "./WorkEntry";
import entry from "./work-entry.module.css";
import styles from "./work.module.css";

const APP_STORE_URL =
  "https://apps.apple.com/us/app/faith-journal-prava/id6759777699";

// Plates span the column: min(1120px, 100vw - 160px), 960 below 1200,
// full bleed on phone.
const PLATE_SIZES =
  "(max-width: 719px) 100vw, (max-width: 1199px) calc(100vw - 64px), 1120px";
const SCREEN_SIZES = "(max-width: 719px) 45vw, (max-width: 1199px) 22vw, 238px";

const pravaScreens = [
  { src: pravaHome, alt: "Prava home: the week's readings and a verse card" },
  { src: pravaLectio, alt: "Lectio Divina, Pray movement" },
  { src: pravaJournal, alt: "Daily journal, yes and no questions" },
  { src: pravaCircle, alt: "A Circle group keeping the same week" },
];

function Verify({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} className={entry.verify} target="_blank" rel="noopener">
      {children}
    </a>
  );
}

/** Chapter III's five entries, most recent first. */
export default function Work() {
  return (
    <>
      <WorkEntry
        index="01"
        headingId="w-01"
        title={<Link href="/work/prava">Prava</Link>}
        meta="2025 to now · iOS · live on the App Store"
        media={
          <Plate className={styles.screens}>
            {pravaScreens.map(({ src, alt }) => (
              <Image key={alt} src={src} alt={alt} sizes={SCREEN_SIZES} />
            ))}
          </Plate>
        }
        sentence="An iOS prayer and scripture app built around the Church's week rather than a streak. Thirteen AI surfaces read versioned prompts with snapshot-tested fallbacks. Designed, built, and shipped solo."
        spec={
          <>
            TypeScript · Next.js · Capacitor · Postgres · Anthropic API
            <br />
            <Link href="/work/prava" className={entry.caseStudy}>
              Read the case study
            </Link>{" "}
            &nbsp;·&nbsp; <Verify href={APP_STORE_URL}>App Store</Verify>
          </>
        }
      />

      <WorkEntry
        index="02"
        headingId="w-02"
        title="Live odds console"
        meta="2022 · sportsbook trading desk · 33 s recording"
        media={
          <VideoPlate />
        }
        sentence="Competitor prices pulled into BigQuery and streamed to the trading desk over Socket.io every five seconds. Green when a line moves toward the bettor, red when it moves away. This is the console running live on the desk."
        spec={
          <>
            Node · Socket.io · BigQuery · MySQL
            <br />
            <Verify href="https://github.com/sbrcly/Odds-Display-Public">
              Odds-Display-Public
            </Verify>
          </>
        }
      />

      <WorkEntry
        index="03"
        headingId="w-03"
        title="Arbitrage detector"
        meta="2022 · about fifty books · one-minute cycle"
        media={
          <Plate>
            <Image
              src={arbitrageTable}
              alt="Arbitrage detector: flagged prices against competitor books"
              sizes={PLATE_SIZES}
            />
          </Plate>
        }
        sentence="Every market the book offered, compared against about fifty competitors. Any price a bettor could lock in from both sides is flagged so a trader can move the line first."
        spec={
          <>
            Node · Socket.io · MySQL · GCP
            <br />
            <Verify href="https://github.com/sbrcly/Arbitrage-Public">
              Arbitrage-Public
            </Verify>
          </>
        }
      />

      <WorkEntry
        index="04"
        headingId="w-04"
        title="Trading schedule"
        meta="2022 · every game offered, with an owner"
        media={
          <Plate>
            <Image
              src={tradingSchedule}
              alt="Trading schedule: games across sports with assigned traders"
              sizes={PLATE_SIZES}
            />
          </Plate>
        }
        sentence="Pulls every game from the data feeds and assigns traders by shift and league coverage. A game nobody owns stays flagged until someone takes it."
        spec={
          <>
            Node · Express · MySQL · feed APIs
            <br />
            <Verify href="https://github.com/sbrcly/Trading-Schedule-Public">
              Trading-Schedule-Public
            </Verify>
          </>
        }
      />

      <WorkEntry
        index="05"
        headingId="w-05"
        title="Marketplace extension"
        meta="2023 to 2025 · ticket brokerage · proprietary"
        media={<ExtensionDiagram />}
        sentence="A Chrome extension that runs inside Ticketmaster and other marketplaces. Cross-origin messaging and DOM automation against sites built to resist it."
        spec={
          <>
            Chrome MV3 · TypeScript · Node
            <br />
            Walkthrough on request
          </>
        }
      />
    </>
  );
}
