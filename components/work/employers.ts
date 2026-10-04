import type { StaticImageData } from "next/image";
import arbitrageTable from "@/public/images/arbitrage-table.png";
import pravaPromptLab from "@/public/images/prava-prompt-lab.png";
import { APP_STORE_URL } from "./links";
import { PRAVA_SCREENS } from "./prava-screens";

/**
 * Chapter III's content: employers, most recent first, each with the
 * projects built there in the order they are shown. A project with a plate
 * is a full entry in the measure; one without is a row in the ruled list
 * under the employer's last plate. Adding the plate field promotes a listed
 * project to an entry; nothing else changes.
 */
export type Plate =
  | { kind: "image"; src: StaticImageData; alt: string }
  /** Phone screens side by side: four, two on phone. */
  | { kind: "screens"; screens: { src: StaticImageData; alt: string }[] }
  /** The odds console recording (VideoPlate). */
  | { kind: "video" }
  /** The origin-boundary diagram (ExtensionDiagram). */
  | { kind: "diagram" };

export type Project = {
  /** The anchor, "work-prava", and the heading's id. */
  id: string;
  /** The title. A lit entry's name is the running margin's second line. */
  name: string;
  sentence: string;
  /** The sentence, and the year where it is new, stand in for real copy. */
  placeholder?: true;
  year: string;
  /** An entry's meta line after the year. */
  detail?: string;
  plate?: Plate;
  /** The case study's route. The title links to it too. */
  caseStudy?: string;
  /** A public repo that holds a write-up of proprietary work, not its code. */
  writeUp?: string;
  /** Somewhere the work can be checked. */
  verify?: { label: string; href: string };
  /** Plain text in the links' place. */
  note?: string;
  /** Mono stack run, entries only. */
  stack?: string;
};

export type Employer = {
  /** The anchor, "employer-01", and the heading's id. */
  id: string;
  name: string;
  role: string;
  years: string;
  projects: Project[];
};

export const EMPLOYERS: Employer[] = [
  {
    id: "01",
    name: "Faith Platforms Inc.",
    // Placeholder role line and years.
    role: "Sole engineer",
    years: "2025 to now",
    projects: [
      {
        id: "prava",
        name: "Prava",
        year: "2025 to now",
        detail: "iOS · live on the App Store",
        plate: {
          kind: "screens",
          screens: PRAVA_SCREENS.map(({ src, alt }) => ({ src, alt })),
        },
        sentence:
          "An iOS prayer and scripture app built around the Church's week rather than a streak. Thirteen AI surfaces read versioned prompts with snapshot-tested fallbacks. Designed, built, and shipped solo.",
        stack: "TypeScript · Next.js · Capacitor · Postgres · Anthropic API",
        caseStudy: "/work/prava",
        verify: { label: "App Store", href: APP_STORE_URL },
      },
      {
        id: "prompt-lab",
        name: "Prompt Lab",
        year: "2025",
        detail: "back office · internal",
        plate: {
          kind: "image",
          src: pravaPromptLab,
          alt: "The Prompt Lab: versioned system prompt surfaces with history, diffs, and drift between database and in-code fallback.",
        },
        placeholder: true,
        sentence:
          "Where Prava's prompts are versioned and checked against their fallbacks.",
      },
      {
        id: "analytics-dashboard",
        name: "Analytics dashboard",
        year: "2025",
        placeholder: true,
        sentence:
          "Where Prava's usage and AI cost are measured rather than assumed.",
      },
      {
        id: "lectionary-authoring-tool",
        name: "Lectionary authoring tool",
        year: "2025",
        placeholder: true,
        sentence:
          "Where the readings for the Church's week are entered and checked.",
      },
      {
        id: "commitment-library",
        name: "Commitment library",
        year: "2025",
        placeholder: true,
        sentence: "The commitments the app offers, written and kept in one place.",
      },
    ],
  },
  {
    id: "02",
    name: "Etainement",
    // Placeholder role line and years.
    role: "Full-stack engineer",
    years: "2022 to 2026",
    projects: [
      {
        id: "marketplace-extension",
        name: "Marketplace extension",
        year: "2023 to 2025",
        detail: "ticket brokerage · proprietary",
        plate: { kind: "diagram" },
        sentence:
          "A Chrome extension that runs inside Ticketmaster and other marketplaces. Cross-origin messaging and DOM automation against sites built to resist it.",
        stack: "Chrome MV3 · TypeScript · Node",
        note: "Walkthrough on request",
      },
      {
        id: "pricing-portal",
        name: "Pricing portal",
        year: "2022 to 2026",
        placeholder: true,
        sentence: "Where buyers write the purchase rules the extension reads.",
      },
    ],
  },
  {
    id: "03",
    name: "Caesars Sportsbook",
    // Placeholder role line and years.
    role: "Developer analyst, promoted from trader",
    years: "2018 to 2022",
    projects: [
      {
        id: "live-odds-console",
        name: "Live odds console",
        year: "2022",
        detail: "sportsbook trading desk · 33 s recording",
        plate: { kind: "video" },
        sentence:
          "Competitor prices pulled into BigQuery and streamed to the trading desk over Socket.io every five seconds. Green when a line moves toward the bettor, red when it moves away. This is the console running live on the desk.",
        stack: "Node · Socket.io · BigQuery · MySQL",
        writeUp: "Odds-Display-Public",
      },
      {
        id: "arbitrage-detector",
        name: "Arbitrage detector",
        year: "2022",
        detail: "about fifty books · one-minute cycle",
        plate: {
          kind: "image",
          src: arbitrageTable,
          alt: "The arbitrage detector's live table: rows of flagged opportunities, each with the game, the market, the book's price, the competitor's price, and the percentage a bettor could lock in.",
        },
        sentence:
          "Every market the book offered, compared against about fifty competitors. Any price a bettor could lock in from both sides is flagged so a trader can move the line first.",
        stack: "Node · Socket.io · MySQL · GCP",
        writeUp: "Arbitrage-Public",
      },
      {
        id: "trading-schedule",
        name: "Trading schedule",
        year: "2022",
        sentence:
          "Pulls every game from the data feeds and assigns traders by shift and league coverage. A game nobody owns stays flagged until someone takes it.",
        stack: "Node · Express · MySQL · feed APIs",
        writeUp: "Trading-Schedule-Public",
      },
    ],
  },
];
