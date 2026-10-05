import type { StaticImageData } from "next/image";
import arbitrageTable from "@/public/images/arbitrage-table.png";
import pravaPromptLab from "@/public/images/prava-prompt-lab.png";
import tradingSchedule from "@/public/images/trading-schedule.png";
import { APP_STORE_URL } from "./links";
import { PRAVA_SCREENS } from "./prava-screens";

/**
 * Chapter II's content: employers, most recent first, each with the
 * projects built there in the order they are shown. The first project is
 * the hero, a full entry in the measure; the rest are cells in the grid
 * under it. A cell has a screenshot or is marked pending and shows a
 * labeled slot in its place.
 */
type ImagePlate = { kind: "image"; src: StaticImageData; alt: string };

export type Plate =
  | ImagePlate
  /** Phone screens side by side: four, two on phone. */
  | { kind: "screens"; screens: { src: StaticImageData; alt: string }[] }
  /** The odds console recording (VideoPlate). */
  | { kind: "video" }
  /** The origin-boundary diagram (ExtensionDiagram). */
  | { kind: "diagram" };

/** What a project is built with. A placeholder is a guess to correct. */
export type Stack = { items: string[]; placeholder?: true };

export type Project = {
  /** The anchor, "work-prava", and the heading's id. */
  id: string;
  name: string;
  sentence: string;
  /** The sentence stands in for real copy. */
  placeholder?: true;
  /** An entry's meta line. */
  detail?: string;
  /** The App Store rating, out of five, shown after the detail as stars. */
  rating?: number;
  /** How many ratings it is from. */
  ratingCount?: number;
  plate?: Plate;
  /** No screenshot yet: the cell shows a labeled slot. */
  pending?: true;
  /** The case study's route. The title links to it too. */
  caseStudy?: string;
  /** A public repo that holds a write-up of proprietary work, not its code. */
  writeUp?: string;
  /** Somewhere the work can be checked. */
  verify?: { label: string; href: string };
  /** Plain text in the links' place. */
  note?: string;
  /** The mono line under the sentence, items joined with " · ". */
  stack: Stack;
};

export type Hero = Project & { plate: Plate; pending?: never };

export type Cell = Project &
  ({ plate: ImagePlate; pending?: never } | { plate?: never; pending: true });

export type Employer = {
  /** The anchor, "employer-01", and the heading's id. */
  id: string;
  name: string;
  role: string;
  years: string;
  /** The hero, then the grid's cells. */
  projects: [Hero, ...Cell[]];
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
        detail: "iOS",
        rating: 5.0,
        ratingCount: 51,
        plate: {
          kind: "screens",
          screens: PRAVA_SCREENS.map(({ src, alt }) => ({ src, alt })),
        },
        sentence:
          "An iOS prayer and scripture app built around the Church's week rather than a streak. Thirteen AI surfaces read versioned prompts with snapshot-tested fallbacks. Designed, built, and shipped solo.",
        stack: {
          items: ["TypeScript", "Next.js", "Capacitor", "Postgres", "Anthropic API"],
        },
        caseStudy: "/work/prava",
        verify: { label: "App Store", href: APP_STORE_URL },
      },
      {
        id: "prompt-lab",
        name: "Prompt Lab",
        detail: "back office · internal",
        plate: {
          kind: "image",
          src: pravaPromptLab,
          alt: "The Prompt Lab: versioned system prompt surfaces with history, diffs, and drift between database and in-code fallback.",
        },
        placeholder: true,
        sentence:
          "Where Prava's prompts are versioned and checked against their fallbacks.",
        // Prava's stack, assumed shared.
        stack: {
          items: ["TypeScript", "Next.js", "Capacitor", "Postgres", "Anthropic API"],
          placeholder: true,
        },
      },
      {
        id: "analytics-dashboard",
        name: "Analytics dashboard",
        pending: true,
        placeholder: true,
        sentence:
          "Where Prava's usage and AI cost are measured rather than assumed.",
        // Prava's stack, assumed shared.
        stack: {
          items: ["TypeScript", "Next.js", "Capacitor", "Postgres", "Anthropic API"],
          placeholder: true,
        },
      },
      {
        id: "lectionary-authoring-tool",
        name: "Lectionary authoring tool",
        pending: true,
        placeholder: true,
        sentence:
          "Where the readings for the Church's week are entered and checked.",
        // Prava's stack, assumed shared.
        stack: {
          items: ["TypeScript", "Next.js", "Capacitor", "Postgres", "Anthropic API"],
          placeholder: true,
        },
      },
      {
        id: "commitment-library",
        name: "Commitment library",
        pending: true,
        placeholder: true,
        sentence: "The commitments the app offers, written and kept in one place.",
        // Prava's stack, assumed shared.
        stack: {
          items: ["TypeScript", "Next.js", "Capacitor", "Postgres", "Anthropic API"],
          placeholder: true,
        },
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
        detail: "ticket brokerage · proprietary",
        plate: { kind: "diagram" },
        sentence:
          "A Chrome extension that runs inside Ticketmaster and other marketplaces. Cross-origin messaging and DOM automation against sites built to resist it.",
        stack: { items: ["Chrome MV3", "TypeScript", "Node"] },
        note: "Walkthrough on request",
      },
      {
        id: "pricing-portal",
        name: "Pricing portal",
        pending: true,
        placeholder: true,
        sentence: "Where buyers write the purchase rules the extension reads.",
        // No old site records the portal's stack; this is the extension's,
        // less the Chrome part.
        stack: { items: ["TypeScript", "Node"], placeholder: true },
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
        detail: "sportsbook trading desk · 33 s recording",
        plate: { kind: "video" },
        sentence:
          "Competitor prices pulled into BigQuery and streamed to the trading desk over Socket.io every five seconds. Green when a line moves toward the bettor, red when it moves away. This is the console running live on the desk.",
        stack: { items: ["Node", "Socket.io", "BigQuery", "MySQL"] },
        writeUp: "Odds-Display-Public",
      },
      {
        id: "arbitrage-detector",
        name: "Arbitrage detector",
        detail: "about fifty books · one-minute cycle",
        plate: {
          kind: "image",
          src: arbitrageTable,
          alt: "The arbitrage detector's live table: rows of flagged opportunities, each with the game, the market, the book's price, the competitor's price, and the percentage a bettor could lock in.",
        },
        sentence:
          "Every market the book offered, compared against about fifty competitors. Any price a bettor could lock in from both sides is flagged so a trader can move the line first.",
        stack: { items: ["Node", "Socket.io", "MySQL", "GCP"] },
        writeUp: "Arbitrage-Public",
      },
      {
        id: "trading-schedule",
        name: "Trading schedule",
        plate: {
          kind: "image",
          src: tradingSchedule,
          alt: "Trading schedule: games across sports with assigned traders",
        },
        sentence:
          "Pulls every game from the data feeds and assigns traders by shift and league coverage. A game nobody owns stays flagged until someone takes it.",
        stack: { items: ["Node", "Express", "MySQL", "feed APIs"] },
        writeUp: "Trading-Schedule-Public",
      },
    ],
  },
];

/** Prava's hero entry, which its case study's top row also reads. */
export const PRAVA = EMPLOYERS[0].projects[0];
