import type { ComponentType } from "react";
import type { StaticImageData } from "next/image";
import arbitrageTable from "@/public/images/arbitrage-table.png";
import pravaCockpit from "@/public/images/prava-cockpit.png";
import pravaPromptLab from "@/public/images/prava-prompt-lab.png";
import pravaSimulator from "@/public/images/prava-simulator.png";
import tradingSchedule from "@/public/images/trading-schedule.png";
import { APP_STORE_URL, PRAVA_SITE_URL, writeUpUrl } from "./links";
import { PRAVA_SCREENS } from "./prava-screens";

/**
 * Chapter II's content: employers, most recent first, each with the
 * projects built there in the order they are shown. The first project is
 * the hero, a full entry in the measure; the rest are cells in the grid
 * under it. A cell has a screenshot or is marked pending and shows a
 * labeled slot in its place. Every project also has a page, and what the
 * page says is here with it.
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

/**
 * A project's page (app/work/[slug]), at one of three depths. Full: the
 * title block, a plate, five or six numbered sections. Standard: the same
 * with two sections. Note: the title block and three paragraphs.
 */
export type Depth = "full" | "standard" | "note";

/** Running text: a string, or a run of strings, emphasis, and links. */
export type Rich =
  | string
  | (string | { em: string } | { text: string; href: string })[];

/** A row of the title block's spec. */
export type SpecRow = {
  label: "Role" | "Stack" | "Where" | "Verify" | "Code" | "Write-up";
  value: Rich;
};

/** A picture: a screenshot, or a diagram inlined as SVG so it is set in the
    page's mono, with a taller drawing for the phone if it has one. */
export type Media =
  | ImagePlate
  | { kind: "svg"; Svg: ComponentType; Tall?: ComponentType; alt: string };

export type Figure = { media: Media; caption: string };

/** The plate under the title block. Screens carry their own captions. */
export type PagePlate =
  | {
      kind: "screens";
      screens: { src: StaticImageData; alt: string; caption: string }[];
    }
  | Figure;

/** One part of a section's body, under its statement. */
export type Block =
  | { kind: "paragraphs"; paragraphs: Rich[] }
  /** Numbered i, ii, iii in the order given. */
  | { kind: "items"; items: { title: string; text: string }[] }
  | { kind: "facts"; facts: { term: string; detail: string }[] }
  /** One figure, or several: stacked in the measure, side by side from
      720px to 959px. */
  | { kind: "figures"; figures: Figure[] };

export type Section = {
  /** The anchor, "problem". */
  id: string;
  /** "01" to "06": the running margin's numeral. */
  number: string;
  /** The running margin's label, and the section's heading. */
  label: string;
  statement: string;
  body: Block[];
};

export type PageLink = { label: string; href: string };

/**
 * What a page says that the project's entry in Work does not. The way back,
 * the next page in the employer, and the share card's line are worked out
 * from where the project sits (pages.ts).
 */
type PageContent = {
  /** The top row's right half, after the employer's years: what kind of
      thing it is, then one fact. A rated project's fact is its rating. */
  kind?: string;
  fact?: string;
  lede: string;
  spec: SpecRow[];
  /** The closing row: a note in plain text, the primary link, any others. */
  links: { note?: string; primary?: PageLink; more?: PageLink[] };
};

export type SectionedPage = PageContent & {
  plate: PagePlate;
  sections: Section[];
};

export type NotePage = PageContent & { paragraphs: Rich[] };

type Paged =
  | { depth: "full" | "standard"; page: SectionedPage }
  /** Whatever a Note has not had written is filled in (pages.ts). */
  | { depth: "note"; page?: Partial<NotePage> };

export type Project = Paged & {
  /** The anchor, "work-prava", and the heading's id. */
  id: string;
  /** The page's route, /work/<slug>. */
  slug: string;
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

const PRAVA_PAGE: SectionedPage = {
  kind: "iOS",
  lede: "An iOS prayer and scripture app, designed, built, and shipped alone, from first commit to the App Store.",
  spec: [
    { label: "Role", value: "Sole engineer and designer" },
    {
      label: "Stack",
      value:
        "TypeScript · Next.js · Capacitor · Postgres with Prisma · Anthropic API",
    },
    {
      label: "Verify",
      value: [
        { text: "App Store", href: APP_STORE_URL },
        " · ",
        { text: "joinprava.com", href: PRAVA_SITE_URL },
      ],
    },
  ],
  plate: { kind: "screens", screens: PRAVA_SCREENS },
  sections: [
    {
      id: "problem",
      number: "01",
      label: "The problem",
      statement: "Faith apps borrow the wrong mechanics.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Most of them are habit trackers in vestments: streaks, scores, completion rings, and the quiet guilt of a missed day. Those mechanics reward showing up and punish honesty. The moment a practice becomes a scoreboard, people perform for the app instead of telling it the truth.",
            "What I wanted already existed and was two thousand years old: the Church's week, its lectionary, its prayers, its creeds. Prava puts that at the center across twelve traditions, in each tradition's own words.",
            [
              "The founding rule is ",
              { em: "record, not score" },
              ". It reads like product copy. It turned out to be an engineering constraint that shaped the schema, the prompts, and what the app refuses to measure.",
            ],
          ],
        },
      ],
    },
    {
      id: "built",
      number: "02",
      label: "What was built",
      statement: "A full consumer product, run by one person.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "A native-feeling iOS app with a daily journal, prayer and scripture surfaces, a weekly lectionary, and small accountability circles. The AI teaches and reflects. It never touches the Church's fixed texts: creeds and historic prayers render exactly as written, enforced by CI scanners rather than good intentions.",
          ],
        },
        {
          kind: "facts",
          facts: [
            {
              term: "Platform",
              detail:
                "Next.js and TypeScript inside Capacitor / WKWebView as a native iOS app",
            },
            {
              term: "AI",
              detail:
                "Thirteen grounded surfaces, each reading versioned system prompts with snapshot-tested fallbacks",
            },
            {
              term: "Data",
              detail: "Postgres with Prisma, additive-only migrations",
            },
            {
              term: "Revenue",
              detail: "Freemium subscriptions, monthly and annual",
            },
            {
              term: "Infra",
              detail:
                "Object storage, error monitoring, product analytics with feature flags",
            },
          ],
        },
      ],
    },
    {
      id: "decisions",
      number: "03",
      label: "Three decisions",
      statement: "Decisions I would defend in any interview.",
      body: [
        {
          kind: "items",
          items: [
            {
              title: "AI cost in three waves",
              text: "Waste first: redundant calls and oversized context. Then small-model routing for five surfaces where quality held. Then prompt caching, with a usage-event table in Postgres that checks the cache metrics the provider reports. A cost optimization you cannot measure independently is a rumor.",
            },
            {
              title: "Philosophy as a schema constraint",
              text: "The database stores what happened, never a grade. Unlimited grace is automatic, so a missed day is recorded honestly and never becomes a punishment mechanic. Deciding what the database refuses to know was the most interesting design problem in the product.",
            },
            {
              title: "The process is the second engineer",
              text: "Additive-only migrations so nothing is ever un-shippable. Snapshot-tested prompt fallbacks so an AI regression fails a test instead of a user. Features dark-shipped behind flags with written flip runbooks, so turning something on is a decision, not an event.",
            },
          ],
        },
      ],
    },
    {
      id: "back-office",
      number: "04",
      label: "The back office",
      statement: "Eleven internal tools nobody sees.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "The Prompt Lab versions every system prompt behind the thirteen AI surfaces and shows history, diffs, and drift between the database and the in-code fallback. The Profile Simulator builds a user from life contexts and runs the selection algorithm, scores included, so tuning the matcher takes an afternoon instead of a release cycle.",
          ],
        },
        {
          kind: "figures",
          figures: [
            {
              media: {
                kind: "image",
                src: pravaCockpit,
                alt: "Prava's admin home: a grid of eleven internal tool cards including Analytics, Commitments, Memory Verse, Prayers and Creeds, Lectionary, Teaching, Discovery, Prompt Lab, and more.",
              },
              caption: "The cockpit: eleven tools, one stack.",
            },
          ],
        },
        {
          kind: "figures",
          figures: [
            {
              media: {
                kind: "image",
                src: pravaPromptLab,
                alt: "The Prompt Lab: versioned system prompt surfaces with history, diffs, and drift between database and in-code fallback.",
              },
              caption:
                "Prompt Lab: versioned prompts, diffed and drift-checked.",
            },
            {
              media: {
                kind: "image",
                src: pravaSimulator,
                alt: "The Profile Simulator: a built user profile on the left, simulation results and a scored daily selection preview on the right.",
              },
              caption:
                "Profile Simulator: the matching algorithm, testable in an afternoon.",
            },
          ],
        },
      ],
    },
    {
      id: "outcome",
      number: "05",
      label: "Outcome",
      statement: "Live, used across a dozen denominations, paying for itself.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "On the App Store since Easter 2026, with paying subscribers on monthly and annual plans. The specific numbers stay off the internet on purpose and are available in an interview.",
          ],
        },
      ],
    },
  ],
  links: {
    primary: { label: "App Store listing", href: APP_STORE_URL },
    more: [{ label: "joinprava.com", href: PRAVA_SITE_URL }],
  },
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
        slug: "prava",
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
        verify: { label: "App Store", href: APP_STORE_URL },
        depth: "full",
        page: PRAVA_PAGE,
      },
      {
        id: "prompt-lab",
        slug: "prompt-lab",
        depth: "note",
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
        slug: "analytics-dashboard",
        depth: "note",
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
        slug: "lectionary-authoring-tool",
        depth: "note",
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
        slug: "commitment-library",
        depth: "note",
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
        slug: "marketplace-extension",
        depth: "note",
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
        slug: "pricing-portal",
        depth: "note",
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
        slug: "live-odds-console",
        depth: "note",
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
        slug: "arbitrage-detector",
        depth: "note",
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
        page: {
          kind: "Trading desk tool",
          fact: "About fifty books",
          spec: [
            { label: "Role", value: "Built alone, evenings, while trading" },
            { label: "Stack", value: "Node · Socket.io · MySQL · GCP" },
            {
              label: "Write-up",
              value: [
                {
                  text: "Arbitrage-Public",
                  href: writeUpUrl("Arbitrage-Public"),
                },
              ],
            },
          ],
        },
      },
      {
        id: "trading-schedule",
        slug: "trading-schedule",
        depth: "note",
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

