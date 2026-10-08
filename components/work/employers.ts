import type { StaticImageData } from "next/image";
import arbitrageTable from "@/public/images/arbitrage-table.png";
import adminHub from "@/public/images/captures/admin-hub-1920@2x.png";
import analyticsEngagement from "@/public/images/captures/analytics-engagement-16x10@2x.png";
import commitmentsCommitment from "@/public/images/captures/commitments-commitment-16x10@2x.png";
import lectionaryWeekReadings from "@/public/images/captures/lectionary-week-readings-16x10@2x.png";
import promptLabHistoryDiff from "@/public/images/captures/prompt-lab-history-diff-16x10@2x.png";
import pravaPromptLab from "@/public/images/prava-prompt-lab.png";
import pravaSimulator from "@/public/images/prava-simulator.png";
import tradingSchedule from "@/public/images/trading-schedule.png";
import type { DiagramName } from "@/components/diagram/Diagram";
import { APP_STORE_URL, PRAVA_SITE_URL, writeUpUrl } from "./links";
import { PRAVA_SCREENS } from "./prava-screens";

/**
 * Chapter II's content: employers, most recent first, each with the
 * projects built there in the order they are shown. The first is the hero,
 * a full entry in the measure; the rest are cells in the grid under it. A
 * cell has a screenshot or a drawing, or is marked pending and shows a
 * labeled slot in its place. Every project also has a page, and what the
 * page says is here with it. A hero that is a system of the employer's
 * other projects has none: it links to theirs.
 */
type ImagePlate = { kind: "image"; src: StaticImageData; alt: string };

/** A drawing inlined from public/diagrams (components/diagram). */
type DiagramPlate = { kind: "diagram"; name: DiagramName; label: string };

export type Plate =
  | ImagePlate
  /** Phone screens side by side: four, two on phone. */
  | { kind: "screens"; screens: { src: StaticImageData; alt: string }[] }
  /** The odds console recording (VideoPlate). */
  | { kind: "video" }
  | DiagramPlate
  /** The on-sale system's venue, looping from 960px up (VenueLoop). */
  | { kind: "venue"; label: string };

/** What a project is built with, one token each (StackTokens). A
    placeholder is a guess to correct; the row says so first. */
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

/** A row of the title block's spec. The stack is tokens, like a project's
    entry in Work. */
export type SpecRow =
  | {
      label: "Role" | "Where" | "Verify" | "Code" | "Write-up";
      value: Rich;
    }
  | { label: "Stack"; items: string[] };

/** A picture: a screenshot, or a diagram inlined as SVG so it is set in the
    page's mono, with a taller drawing for the phone if it has one. */
export type Media = ImagePlate | DiagramPlate;

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
  /** The top row's years, where they are the project's and not the
      employer's. */
  years?: string;
  lede: string;
  spec: SpecRow[];
  /** The closing row: a note in plain text, the primary link, any others. */
  links: { note?: string; primary?: PageLink; more?: PageLink[] };
  /** A picture to share in the card's place (app/og). */
  share?: ShareImage;
};

/** A share image that is made elsewhere than the page's own card. */
export type ShareImage = { src: string; alt: string };

export type SectionedPage = PageContent & {
  plate: PagePlate;
  sections: Section[];
};

export type NotePage = PageContent & { paragraphs: Rich[] };

type Paged =
  | { depth: "full" | "standard"; page: SectionedPage }
  /** Whatever a Note has not had written is filled in (pages.ts). */
  | { depth: "note"; page?: Partial<NotePage> };

/** What Work shows of a project. */
type Shown = {
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
  /** A public repo that holds a write-up of proprietary work, not its code. */
  writeUp?: string;
  /** Somewhere the work can be checked. */
  verify?: { label: string; href: string };
  /** Plain text on the links' line, after any links. */
  note?: string;
  /** The tokens under the sentence. */
  stack: Stack;
};

export type Project = Shown &
  Paged & {
    /** The page's route, /work/<slug>. */
    slug: string;
  };

/**
 * A hero that is no one project: the employer's other projects, together.
 * It has no page of its own, so its name is not a link, and its entry links
 * to their pages instead.
 */
export type System = Shown & { system: true };

export type Hero = (Project | System) & { plate: Plate; pending?: never };

export type Cell = Project &
  (
    | { plate: ImagePlate | DiagramPlate; pending?: never }
    | { plate?: never; pending: true }
  );

/** Whether what Work shows has a page: everything but a system. */
export const hasPage = <T extends Project | System>(
  project: T
): project is Exclude<T, System> => !("system" in project);

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
      items: [
        "TypeScript",
        "Next.js",
        "Capacitor",
        "Postgres",
        "Prisma",
        "Anthropic API",
      ],
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
            "What I wanted already existed, and had for two thousand years: the Church's week, its lectionary, its prayers, its creeds. Prava puts that at the center across twelve traditions, in each tradition's own words.",
            [
              "The founding rule is ",
              { em: "record, not score" },
              ". That sounds like a slogan. It turned out to be an engineering constraint that shaped the schema, the prompts, and what the app refuses to measure.",
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
            "A native-feeling iOS app with a daily journal, prayer and scripture surfaces, a weekly lectionary, and a People tab for praying for others by name. The AI teaches and reflects. It never touches the Church's fixed texts: creeds and historic prayers render exactly as written, enforced by CI scanners rather than good intentions. Outside the code, a team of UGC creators I recruit and manage, each with tracked links into the app.",
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
                "Eleven grounded surfaces, each reading versioned system prompts with snapshot-tested fallbacks (thirteen at launch)",
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
              term: "Growth",
              detail:
                "A creator program of UGC creators, recruited and managed directly, with per-creator links tracked in the analytics dashboard",
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
              text: "Waste first: redundant calls and oversized context. Then routing the surfaces where quality held to a smaller model. Then prompt caching, with every call's token counts (input, output, cache written, cache read) written to a usage table in Postgres so the savings could be checked against the provider's bill rather than taken on faith.",
            },
            {
              title: "Philosophy as a schema constraint",
              text: "The database stores what happened, never a grade. Unlimited grace is automatic, so a missed day is recorded honestly and never becomes a punishment mechanic. Deciding what the database refuses to know was the most interesting design problem in the product.",
            },
            {
              title: "The process is the second engineer",
              text: "Additive-only migrations so nothing is ever un-shippable. Snapshot-tested prompt fallbacks so an AI regression fails a test instead of a user. Features dark-shipped behind flags with written flip runbooks, so turning something on is a decision, not an event. And since late 2025, AI coding agents working under direction: a read-only discovery before any change, rulings written down and numbered, builds scoped small and checked on a device, and a chain of structural checks that pins what the agents produce rather than trusting it.",
            },
          ],
        },
      ],
    },
    {
      id: "back-office",
      number: "04",
      label: "The back office",
      statement: "Twelve internal tools nobody sees.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            [
              "Twelve tools on one hub, over 140 admin routes. The ",
              { text: "Prompt Lab", href: "/work/prompt-lab" },
              " versions the system prompts, voice fragments, and theology groundings behind the eleven governed surfaces, and shows history, diffs, and a flag when the live version has diverged from the shipped fallback. The lectionary authoring tool turns a citation typed the way a missal prints it into readings the app can serve, with a horizon that shows what is ready for the weeks ahead. The Profile Simulator inside the commitment library builds a user from life contexts and runs the selection algorithm, scores included, so tuning the matcher takes an afternoon instead of a release cycle.",
            ],
            [
              "Four of the twelve have pages of their own: the Prompt Lab, the ",
              { text: "analytics dashboard", href: "/work/analytics-dashboard" },
              ", the ",
              { text: "lectionary authoring tool", href: "/work/lectionary-authoring-tool" },
              ", and the ",
              { text: "commitment library", href: "/work/commitment-library" },
              ".",
            ],
          ],
        },
        {
          kind: "figures",
          figures: [
            {
              media: {
                kind: "image",
                src: adminHub,
                alt: "Prava's admin home, Tools for managing Prava: a grid of twelve internal tool cards, Analytics, Commitments, Memory Verse, Prayers and Creeds, Lectionary, Teaching, Discovery, Prompt Lab, AI Outputs, Target profiles, Paywall test, and Design system.",
              },
              caption: "The hub: twelve tools, one stack.",
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
            "On the App Store since Easter 2026, with paying subscribers on monthly and annual plans.",
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

export const WALKTHROUGH = "Walkthrough on request";
const BROKER = "Etainement, one of the larger US brokers";
const ETAINEMENT = `${BROKER} · proprietary`;

/** What the on-sale system's venue shows: the hero's plate in Work, and the
    still its three projects share (app/og/on-sale-system.png). */
const VENUE =
  "A synthetic venue map in the pricing portal: a rule dragged across section 105 lights the seats in its band and appears in the rules panel; the buyer extension paints the same seats on a Ticketmaster event page.";
const VENUE_STILL: ShareImage = { src: "/og/on-sale-system.png", alt: VENUE };

const PRICING_PORTAL_PAGE: SectionedPage = {
  kind: "Web app and API",
  fact: "A team system",
  lede: "The internal web app where a ticket brokerage prices its inventory against current marketplace listings and plans its buying. A team system; these are the parts I built inside it over three years.",
  spec: [
    {
      label: "Role",
      value: "Full-stack engineer, one of about eight contributors",
    },
    {
      label: "Stack",
      items: [
        "React",
        "Redux",
        "Node",
        "Express",
        "BigQuery",
        "MySQL",
        "Redis",
        "Sentry",
      ],
    },
    { label: "Where", value: ETAINEMENT },
    { label: "Code", value: WALKTHROUGH },
  ],
  plate: {
    media: {
      kind: "diagram",
      name: "on-sale-system-still",
      label:
        "A synthetic venue map in the portal's Shader: a rule dragged across section 105 lights the seats in its band and appears in the rules panel; the buyer extension paints the same seats on a Ticketmaster event page.",
    },
    caption:
      "The Shader: a rule drawn across a section, resolved to seat IDs at save, and painted by the extension. Synthetic venue, synthetic rules.",
  },
  sections: [
    {
      id: "problem",
      number: "01",
      label: "The problem",
      statement:
        "Two jobs under one roof: pricing what is held, and planning what to buy.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Placeholder. Analysts work through events where the company holds tickets, see their own listings beside the current market, and change prices by hand or by rule. On-sale managers plan what to buy and draw, on a venue map, the seats the business wants. That drawing is what the buyer extension paints.",
            "Placeholder. The portal has no data of its own. Everything comes from, and is written to, a backend that reads three point-of-sale systems live, keeps its record in a warehouse, and caches what it can.",
            "Placeholder. Eight people built it over two years. What follows is the part of it that is mine.",
          ],
        },
      ],
    },
    {
      id: "built",
      number: "02",
      label: "What was built",
      statement: "My parts, named.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Placeholder. Second of about eight contributors by commits, with the clearest ownership in the rule-authoring panel the extension consumes, the first generation of the analysts' worklist, and the platform work on the backend.",
          ],
        },
        {
          kind: "facts",
          facts: [
            {
              term: "Shader",
              detail:
                "The rule-authoring panel: gestures on the map, typed entry, the switches, resolution to seat IDs at save",
            },
            {
              term: "Stale sheet",
              detail:
                "The first generation of the analysts' virtualised worklist",
            },
            {
              term: "Pricer",
              detail:
                "The original page; cross-panel filters; the price-drop guard",
            },
            {
              term: "App",
              detail:
                "The original Settings page, route guarding, the pricing dashboard, Sentry",
            },
            {
              term: "Backend",
              detail:
                "The manual price-update path and its audit trail; the rules service and stop alerts; the service-account split with per-query page tagging; the telemetry write buffer",
            },
          ],
        },
      ],
    },
    {
      id: "lifecycle",
      number: "03",
      label: "The rule lifecycle",
      statement: "From a gesture to a list of seat IDs.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Placeholder. A manager needs to say \"these sections, these rows, up to this price\" in seconds, during an on-sale. Control-click picks a seat and starts a rule for its section. Control-drag draws a line, not a box: the seats within a band around it are collected by a point-in-polygon test. Every rule can also be typed.",
            "Placeholder. On submit the browser walks every seat in the venue and resolves each active rule to concrete IDs, applying the three filters. The saved record carries both the readable criteria and the resolved list, which is why the extension never has to filter.",
          ],
        },
        {
          kind: "figures",
          figures: [
            {
              media: {
                kind: "diagram",
                name: "rule-lifecycle",
                label:
                  "The rule lifecycle: gesture, panel, resolve to seat IDs, save, append-only store, latest-row view, and two read paths, the portal with a freshness check and the extension direct.",
              },
              caption:
                "The rule lifecycle. Every save is a new row; \"current\" is whatever the latest-row view says.",
            },
          ],
        },
      ],
    },
    {
      id: "screens",
      number: "04",
      label: "The screens",
      statement: "Four panels that filter each other.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Placeholder. One event in four resizable panels. Clicking a section on the map filters the market table; with Control it filters own listings too; hovering a row lights its section. Section and row filters accept single values, lists, and ranges, with a fallback when names differ between sources.",
            "Placeholder. Edits are staged, not sent, and saved in one bulk request. A price far enough under the market's lowest comparable opens a blocking popup first, where the price can be corrected before confirming. It is the one action here that costs money immediately if it is wrong.",
          ],
        },
        {
          kind: "figures",
          figures: [
            {
              media: {
                kind: "diagram",
                name: "pricer-wireframe",
                label:
                  "The Pricer as a wireframe: four panels, market history and sales, the venue map, own listings, and marketplace listings, with the filter links drawn between them and the price-drop guard under them.",
              },
              caption:
                "The Pricer, as a wireframe. Brass lines are the filter links.",
            },
            {
              media: {
                kind: "diagram",
                name: "sheet-anatomy",
                label:
                  "Anatomy of the virtualised stale-inventory sheet: pinned columns, a sticky header, a rendered window of rows inside a taller list, a sparkline per cell, and a totals row synced to the scroll.",
              },
              caption:
                "The analysts' worklist: what is rendered and what is only height.",
            },
          ],
        },
      ],
    },
    {
      id: "hard",
      number: "05",
      label: "The hard parts",
      statement: "A warehouse asked to behave like a database.",
      body: [
        {
          kind: "items",
          items: [
            {
              title: "The manual price update and its audit trail",
              text: "Placeholder. The backend looks up which point of sale owns the event and pushes the change. Only if the whole push succeeds does it append an audit row per listing: who, when, old price, new price. The partial-failure branch is the honest part of the drawing.",
            },
            {
              title: "The rules service and the stop alert",
              text: "Placeholder. A save sanitises the record, posts an alert if the stop flag is set, appends a row, writes per-seat notifications, and warms the cache. The portal reads through a freshness check; the extension reads the latest-row view directly.",
            },
            {
              title: "Cost attribution by service account and page",
              text: "Placeholder. Four warehouse clients, one per product area, and a metadata comment on every query naming the tool and page, so warehouse cost can be read per page from the job log. The most transferable technique in the repo.",
            },
            {
              title: "The telemetry write buffer",
              text: "Placeholder. Login telemetry batched into the warehouse every ten seconds or a hundred records, with retry and a flush on shutdown, so a stream of single-row writes never reaches a store built for the opposite.",
            },
          ],
        },
      ],
    },
    {
      id: "differently",
      number: "06",
      label: "What I would do differently",
      statement: "Enforce on the server what the browser only suggests.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Placeholder. The role model is real and well normalised and is enforced only in the browser. The price guard, likewise. Two managers editing one event overwrite each other, last write wins. And five table libraries where one would do.",
            "Placeholder. What stood in for tests was a staging environment and, from 2025, Sentry with replay and source maps, which I wired. The first thing it found is a story for an interview.",
          ],
        },
      ],
    },
  ],
  links: { note: WALKTHROUGH },
  share: VENUE_STILL,
};

const BUYER_EXTENSION_PAGE: SectionedPage = {
  kind: "Chrome extension",
  fact: "Over a hundred buyers",
  lede: "A Chrome extension that runs inside Ticketmaster, reads the buy rules an on-sale manager saved in the portal, and paints them onto the venue map a buyer is already looking at.",
  spec: [
    {
      label: "Role",
      value: "Built and owned by Scott; handed off before leaving.",
    },
    {
      label: "Stack",
      items: ["Chrome MV3", "JavaScript", "React (popup)", "Vite"],
    },
    // The Code row says it is proprietary, so Where does not.
    { label: "Where", value: BROKER },
    { label: "Code", value: "proprietary · walkthrough on request" },
  ],
  plate: {
    media: {
      kind: "diagram",
      name: "buyer-extension-cell",
      label:
        "A synthetic venue map on a buyer's screen: the seats inside rule 01's band ringed in light, the rule's note beside them.",
    },
    caption:
      "What a buyer sees. The map is the marketplace's; the rings, the note, and the stop sign are the extension's. Synthetic venue, synthetic rule.",
  },
  sections: [
    {
      id: "problem",
      number: "01",
      label: "The problem",
      statement: "The buyer's screen belongs to someone else.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Placeholder. During an on-sale a buyer has a venue map on screen and a few minutes to act. The rules for what to buy live in another tool, on another origin, written by someone else. Reading them from a second window costs the seconds the sale is decided in.",
            "Placeholder. The marketplace's page is not built to be read by anyone but the marketplace: seat elements carry no usable ID, the map renders late and re-renders on zoom, the markup changes under you, and the response bodies that would settle every question are off limits to an extension under Manifest V3.",
            "Placeholder. The job was to put the rule where the buyer is looking, without owning the page, a login, or a store listing.",
          ],
        },
      ],
    },
    {
      id: "origins",
      number: "02",
      label: "Where the rule crosses",
      statement: "Five origins, one rule.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Placeholder. A rule crosses five JavaScript worlds between the portal and the paint: the portal page where the session lives, the extension's worker, the marketplace's isolated world where the content script runs, the marketplace's own page world where the seats can be read, and the identity iframe on a third origin. None of them can see the others directly.",
          ],
        },
        {
          kind: "figures",
          figures: [
            {
              media: {
                kind: "diagram",
                name: "five-origins",
                label:
                  "Five origins: the portal page, the extension worker, the marketplace isolated world, the marketplace page world, and the identity iframe, with the rule travelling from the worker through the isolated world into the page world.",
              },
              caption:
                "The five origins. Brass is the rule; grey is what has to happen for it to move.",
            },
          ],
        },
        {
          kind: "facts",
          facts: [
            {
              term: "Worker",
              detail:
                "Routes every message; borrows the portal token; the badge is its status light",
            },
            {
              term: "Content script",
              detail:
                "Detects the page type, waits for the map, polls, compares, hands on",
            },
            {
              term: "Page world",
              detail:
                "Reads seat IDs from the site's own React internals and paints",
            },
            {
              term: "Identity iframe",
              detail:
                "A content script inside the cross-origin frame, reporting by origin-checked message",
            },
            {
              term: "Popup",
              detail:
                "One React form, pre-filled with the captured cart for a human to correct",
            },
          ],
        },
      ],
    },
    {
      id: "path",
      number: "03",
      label: "The rule's path",
      statement: "From the map appearing to the paint, in seven steps.",
      body: [
        {
          kind: "figures",
          figures: [
            {
              media: {
                kind: "diagram",
                name: "rule-path",
                label:
                  "The rule's path in seven steps: the map appears, the content script asks, the worker fetches with the borrowed token, the poll runs every fifteen seconds while the tab is visible, the rules are handed into the page world, seat IDs are read from React internals, the seats are painted.",
              },
              caption:
                "No long-lived ports anywhere: one-shot messages with a reply, and window messages across the world boundary.",
            },
          ],
        },
        {
          kind: "paragraphs",
          paragraphs: [
            "Placeholder. The poll runs every 15 seconds while the tab is visible and stops when it is hidden. A pass that finds nothing changed stops before the paint. Panning or zooming repaints from the last rules, one second after movement stops, with no network call.",
            "Placeholder. If no portal tab is open the fetch fails and the badge turns red; the buyer knows before the sale does.",
          ],
        },
      ],
    },
    {
      id: "hard",
      number: "04",
      label: "The hard parts",
      statement: "In the order they were met.",
      body: [
        {
          kind: "items",
          items: [
            {
              title: "Matching rules to seats on a map you do not own",
              text: "Placeholder. Three approaches over time: seat numbers, then grid coordinates, then the site's own seat IDs read from the React internals on each element, which is only possible from the page's world. The earlier logic stayed as the fallback.",
            },
            {
              title: "Reading the page's own network responses",
              text: "Placeholder. Manifest V3 cannot read response bodies, so a page-world script wraps fetch and XMLHttpRequest and copies one response. The race: the page could make the call before the extension was ready. The fix moved the interceptor to a manifest-declared script at document start and added a buffer drained once the service starts.",
            },
            {
              title: "Timing on a late-rendering single-page app",
              text: "Placeholder. Content scripts start before the body exists; the map arrives seconds later and re-renders on zoom. Observers wait for one specific element and fire once, a debounce absorbs the zoom, a re-entrancy flag keeps two passes from overlapping, and everything pauses while the tab is hidden.",
            },
            {
              title: "The cross-origin identity iframe",
              text: "Placeholder. Verification happens in a frame the parent cannot read. A content script inside it reports to the parent by window message with explicit target origins, and the parent checks the sender. Detection is redundant on purpose: an observer, a periodic check, and a short burst after submit.",
            },
            {
              title: "Auth without a login",
              text: "Placeholder. The extension has no sign-in. It reads the portal's token from an open portal tab, treats it as good for a fixed window, and reloads the tab when it is stale so the portal's own app refreshes it. The backend accepts one pinned extension ID.",
            },
            {
              title: "Markup that changes under you",
              text: "Placeholder. Sixty of the site's test hooks are targeted, each written three ways because the site has spelled the attribute three ways over time. Parsers prefer the page's embedded data and fall back to the DOM; order confirmation has three layers, the last of them a human.",
            },
            {
              title: "The two-tier cache on the distribution portal",
              text: "Placeholder. A second surface re-renders its table constantly. The first version refetched rules per row. The current one scopes the observer, debounces, groups rows by event, shares one in-flight request per event, and caches in memory and then in extension storage.",
            },
          ],
        },
      ],
    },
    {
      id: "differently",
      number: "05",
      label: "What I would do differently",
      statement: "Three things, in order of regret.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Placeholder. A guard for the day the site's internals change shape: today a break paints zero seats and the only signal is a note that reads zero. Then tests, of which there are none. Then one shared rules cache on the marketplace side instead of one poll per tab.",
            "Placeholder. Over a hundred buyers used it through two seasons of on-sales. The numbers behind that stay off the internet on purpose and are available in an interview.",
          ],
        },
      ],
    },
  ],
  links: { note: WALKTHROUGH },
  share: VENUE_STILL,
};

const ON_SALE_MONITOR_PAGE: SectionedPage = {
  kind: "Web app",
  fact: "Built alone",
  years: "2023 to 2026",
  lede: "A read-only, real-time dashboard that turns the buyer extension's telemetry into live tables, with per-buyer and per-event waiting-room roll-ups for watching an on-sale as it happens.",
  spec: [
    { label: "Role", value: "Built by Scott." },
    {
      label: "Stack",
      items: ["React", "Firestore", "Firebase Auth and Hosting", "Vite"],
    },
    { label: "Where", value: ETAINEMENT },
    { label: "Code", value: WALKTHROUGH },
  ],
  plate: {
    media: {
      kind: "diagram",
      name: "on-sale-monitor-plate",
      label:
        "The monitor mid-sale: Queue: Events, one row per event with active queues, average starting position, the last thirty minutes, and the lowest users-ahead this hour; the buyer list open on the first row. Synthetic data.",
    },
    caption:
      "Queue: Events a few minutes into a seeded on-sale, the buyer list open on one row. Synthetic buyers, events, and venues.",
  },
  sections: [
    {
      id: "does",
      number: "01",
      label: "What it does",
      statement: "The last box in the flow, and a leaf.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Placeholder. The extension records each step of a purchase: event page load, sign-in, waiting-room position, cart attempt, checkout error, order confirmation. A copy of every record lands as a document in Firestore. The monitor signs a viewer in, listens to one collection at a time, and renders the newest records as rows, one tab per record type.",
            "Placeholder. Nothing is polled and nothing is written back. A row appears when its document does. A keyword filter and a pause button are the only controls.",
          ],
        },
        {
          kind: "figures",
          figures: [
            {
              media: {
                kind: "diagram",
                name: "telemetry-funnel",
                label:
                  "The telemetry funnel from a buyer's page to the monitor's screen: content script, worker, ingestion endpoint, Firestore, listener, reduce, table, with the two timestamps marked and the warehouse as the second destination.",
              },
              caption:
                "From a buyer's page to the screen. Two clocks stamp the record on the way; rows are ordered by the second.",
            },
          ],
        },
      ],
    },
    {
      id: "hard",
      number: "02",
      label: "What was hard",
      statement: "Rebuilding who is in which queue from a stream of positions.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Placeholder. The waiting room produces a stream of position records per browser tab. The monitor has to turn that into \"who is in which queue right now, and how well placed are they\". Group by buyer, account, and event and keep the newest; count the groups seen in the last three minutes as active; track count, lowest, highest, and average over thirty; and the lowest users-ahead within the hour, because on-sales start on the hour.",
            "Placeholder. This took the most iteration of anything in the project, and was pulled out into pure functions in the 2026 rewrite. Its honest limit: the key leaves out the tab, so one buyer with two tabs on one account collapses into one queue.",
          ],
        },
        {
          kind: "figures",
          figures: [
            {
              media: {
                kind: "diagram",
                name: "queue-reconstruction",
                label:
                  "Queue reconstruction: raw position records per buyer tab reduce to the latest record per buyer, account, and event, then roll up per buyer and per event; three time windows, the current hour, the last thirty minutes, and three minutes, drawn on the on-sale hour.",
              },
              caption:
                "Raw records to the latest per key to two roll-ups, with the three windows on the hour.",
            },
          ],
        },
      ],
    },
  ],
  links: { note: WALKTHROUGH },
  share: VENUE_STILL,
};

/** The back-office pages share a top row, a role, and a way back. */
const BACK_OFFICE = "Prava's back office · one of twelve tools over 140 admin routes";
const ONE_PERSON = "Built and used by one person";
const INTERNAL = "Internal tool";

const PROMPT_LAB_PAGE: SectionedPage = {
  kind: INTERNAL,
  fact: "Eleven AI surfaces",
  lede: "Where the system prompts behind Prava's eleven AI surfaces are versioned, published, and checked against the code they would fall back to.",
  spec: [
    { label: "Role", value: ONE_PERSON },
    {
      label: "Stack",
      items: ["TypeScript", "Next.js", "Postgres", "Prisma", "Anthropic API"],
    },
    { label: "Where", value: BACK_OFFICE },
    { label: "Code", value: WALKTHROUGH },
  ],
  plate: {
    media: {
      kind: "image",
      src: promptLabHistoryDiff,
      alt: "The Prompt Lab's version history for the weekly-reflection surface, marked diverged: three versions, the newest active and the oldest the seed, with Edit from and Roll back actions, and a body diff between two versions of its system prompt, removed lines in red and added lines in green.",
    },
    caption:
      "History and diff for one surface. Prompts and groundings may be shown; nothing of a person's is.",
  },
  sections: [
    {
      id: "does",
      number: "01",
      label: "What it does",
      statement: "A prompt is a row before it is a string.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Placeholder. Every governed AI surface in the app reads its system prompt through one resolver rather than from a constant. The resolver keys on the surface and the person's tradition, answers from a sixty-second cache when it can, and otherwise does one cold read under a time budget. The prompt is assembled from its parts: the surface's own text, a grounding chosen for the tradition, and the shared voice every surface speaks in.",
            "Placeholder. If anything on that path fails, for any of nine named reasons, the call falls back to the in-code producer: the same prompt as shipped code, pinned byte for byte to the seeded prompts by snapshot checks. Either way the generation ledger is stamped with the version served or the reason it fell back, so a fallback is a fact in a table and not a guess.",
          ],
        },
        {
          kind: "facts",
          facts: [
            { term: "Surfaces", detail: "Eleven governed; thirteen at launch" },
            {
              term: "Identity",
              detail: "A 143-cell matrix, one cell per surface and denomination",
            },
            {
              term: "Cache",
              detail: "Sixty seconds per key; one cold read under budget on a miss",
            },
            {
              term: "Ledger",
              detail:
                "Every generation, with the version served or the reason it fell back",
            },
          ],
        },
        {
          kind: "figures",
          figures: [
            {
              media: {
                kind: "diagram",
                name: "prompt-read-path",
                label:
                  "The prompt read path: call site, resolver, sixty-second cache, cold read under budget, assembly, the nine-reason fallback to the in-code producer, and the ledger stamp.",
              },
              caption:
                "The read path, and the fallback beside it. Brass is the ledger, the one thing every read touches.",
            },
          ],
        },
      ],
    },
    {
      id: "hard",
      number: "02",
      label: "What was hard",
      statement: "Publishing one edit that eleven prompts can depend on.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Placeholder. A prompt is an entity with a pointer to its published version; versions accumulate underneath and never change. One draft at a time is edited in place, diffed against what is published, and published by moving the pointer. A rollback is the same move pointed at an older version, which is why there is no undo to write.",
            "Placeholder. The shared voice and the groundings are shared, so one edit can change what every surface says. When an edit fans out, publishing passes through an impact review that lists every dependent with what it reads now and what it will read after, and a digest of that review is checked again inside the publish, so what was reviewed is what ships. The history and diff on the plate is the same comparison, kept for every version.",
          ],
        },
        {
          kind: "figures",
          figures: [
            {
              media: {
                kind: "diagram",
                name: "entity-version-pointer",
                label:
                  "The entity, version, pointer model: an entity with a pointer to its published version, versions appended beneath it, the draft to published state machine with rollback, and the impact review a fan-out edit passes through.",
              },
              caption:
                "One pointer per entity; versions append; the impact review stands between a fan-out edit and publish.",
            },
          ],
        },
      ],
    },
  ],
  links: { note: WALKTHROUGH },
};

const ANALYTICS_DASHBOARD_PAGE: SectionedPage = {
  kind: INTERNAL,
  fact: "Demo data shown",
  lede: "Where Prava's usage and its AI pipeline are measured rather than assumed, from one definition of presence that every widget reads.",
  spec: [
    { label: "Role", value: ONE_PERSON },
    {
      label: "Stack",
      items: ["TypeScript", "Next.js", "Postgres", "PostHog", "Recharts"],
    },
    { label: "Where", value: BACK_OFFICE },
    { label: "Code", value: WALKTHROUGH },
  ],
  plate: {
    media: {
      kind: "image",
      src: analyticsEngagement,
      alt: "The analytics dashboard's Daily Engagement chart for a month, demo data: a presence line with Sundays shaded, a dashed line above it, a dashed marker on 09-25 labelled Presence + activity ledger, and under it per-pillar practicing users stacked by Journal, People, Pray, and Scripture.",
    },
    caption: "Engagement, with the definition-change marker. Demo data.",
  },
  sections: [
    {
      id: "does",
      number: "01",
      label: "What it does",
      statement: "Present means present on any of eight legs, once.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Placeholder. Eight kinds of record can show that a person was there: the prayer and scripture logs, a journal entry, a Sunday reading, a weekday reading, a Bible chapter read to its end, a mark on a verse, a request to the people a person prays for, and the ledger of surfaces opened. Opening the app is not one of them. The dashboard folds all eight into one presence per person per day, and every widget on it reads that fold. None reads a leg directly; a source scan in the check chain fails if one tries.",
            "Placeholder. The day is one day for everyone. Activity rows also carry a date written in the person's own timezone, and filtering on it silently drops anyone east of UTC, so the dashboard filters only true timestamps and buckets every one of them to a Pacific day before the union. Two timezone bugs taught it that.",
          ],
        },
        {
          kind: "facts",
          facts: [
            {
              term: "Pipeline",
              detail:
                "The generation ledger read back as counts, outcomes, and median latency per AI surface",
            },
            {
              term: "Markers",
              detail:
                "A definition change is drawn on the chart the day it lands; twenty-five are dated",
            },
            {
              term: "Data",
              detail:
                "Demo data in every capture; the real figures stay off the internet",
            },
          ],
        },
        {
          kind: "figures",
          figures: [
            {
              media: {
                kind: "diagram",
                name: "presence-union",
                label:
                  "The presence union: eight legs, one per kind of record, bucketed to the Pacific day and folded into one presence per person per day, read by many widgets.",
              },
              caption:
                "Eight legs, one fold, many widgets. The dashed box is the timezone step, which happens first.",
            },
          ],
        },
      ],
    },
    {
      id: "hard",
      number: "02",
      label: "What was hard",
      statement: "Changing what a number means without lying about the past.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Placeholder. When the definition of present widened from four sources to eight, every chart would have shown a jump that was not growth. The fix was a marker: the day the definition changed is drawn on the chart as a dashed line, the aggregate cards carry a chip, and the note is printed once under the view. Nothing is backfilled; history is kept broken at a dated line rather than rewritten.",
            "Placeholder. The second hard part was showing the dashboard at all. A demo mode answers every route from one seeded synthetic world with a frozen clock, and a check script loads its modules with a database stand-in that throws on any access, so the captures on this page could not contain a real person if they tried.",
          ],
        },
      ],
    },
  ],
  links: { note: WALKTHROUGH },
};

const LECTIONARY_TOOL_PAGE: SectionedPage = {
  kind: INTERNAL,
  fact: "Two lectionary traditions",
  lede: "Where the readings for the Church's week are entered, checked, and declared ready, for every day of the year across two lectionary traditions.",
  spec: [
    { label: "Role", value: ONE_PERSON },
    { label: "Stack", items: ["TypeScript", "Next.js", "Postgres", "Prisma"] },
    { label: "Where", value: BACK_OFFICE },
    { label: "Code", value: WALKTHROUGH },
  ],
  plate: {
    media: {
      kind: "image",
      src: lectionaryWeekReadings,
      alt: "The lectionary tool's week view: two Revised Common Lectionary weekday sets, A:P:22:MON and A:P:22:TUE, each with a first reading, a psalm, and a second reading as citations, every row with rights and active badges and an Edit button, and an Edit set button on each set.",
    },
    caption:
      "Two weekdays' readings in one tradition. Citations and badges; no scripture text.",
  },
  sections: [
    {
      id: "does",
      number: "01",
      label: "What it does",
      statement: "From a date to a set of readings, for any tradition.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Placeholder. A date goes through two engines. The Sunday engine finds the season, the Sunday within it, and the year's cycle; the day engine builds the whole liturgical year, settles feasts on a thirteen-level precedence scale, and transfers one that lands on a day it cannot outrank. A Revised Common weekday keys to its nearest Sunday. The result is one slot key that names the day without naming the year, so a row written once serves every time the calendar comes round.",
            "Placeholder. The person's tradition maps to an ordered list of lectionaries, Roman, Revised Common, or one and then the other, and the first with readings for that key wins. A day with none returns nothing rather than something wrong. Checks sweep every Sunday to 2034 in both traditions, and the day engine's check runs 9,002 assertions, one winner per day among them, so a change to either engine fails before it moves a feast.",
          ],
        },
        {
          kind: "figures",
          figures: [
            {
              media: {
                kind: "diagram",
                name: "date-to-slot",
                label:
                  "The date-to-slot pipeline: date, Sunday engine, day engine with precedence and transfers, the Revised Common weekday's Sunday, a year-independent slot key, and the ordered list of lectionaries tried until one has readings.",
              },
              caption:
                "Date to slot key to candidate chain. Brass is the first candidate with readings.",
            },
          ],
        },
      ],
    },
    {
      id: "hard",
      number: "02",
      label: "What was hard",
      statement: "Knowing which week is actually ready.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Placeholder. A week is not ready because its readings are named. A reading is ready when its row is active, its citation parses into verse ranges, the text of every range is cached in the floor translation the app can always show, and the rights to show it are cleared. The tool draws that as a horizon: how many consecutive weeks ahead are whole, and for each week what is missing, with the missing unit as the way in to fix it.",
            "Placeholder. The horizon ends at the first week any unit is missing. Beyond it the app serves nothing for that day rather than a guess: the home card does not render, and the morning push has nothing to send. Text is fetched once at write time, under a provider's daily cap, so the read path never waits on anyone.",
          ],
        },
        {
          kind: "figures",
          figures: [
            {
              media: {
                kind: "diagram",
                name: "readiness-horizon",
                label:
                  "The readiness horizon: sixteen weeks ahead as columns, a row each for an active row, parsed segments, the floor text cached, and rights cleared, and a Ready row filled only where every row above it is; a dashed line marks the first week with a unit missing.",
              },
              caption:
                "Sixteen weeks ahead, four rows of requirements, and Ready. The dashed line is the horizon.",
            },
          ],
        },
      ],
    },
    {
      id: "holds",
      number: "03",
      label: "What holds it",
      statement: "Two traditions, one key, 9,002 pinned days.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Placeholder. The tool was built and is used by one person, and the readings, authored week by week, took longer than the engines. The precedence and transfer tables still carry a note that they await a pass against the missal, and the check scripts say so rather than hide it.",
          ],
        },
        {
          kind: "facts",
          facts: [
            {
              term: "Readings",
              detail:
                "Authored week by week, Sundays and weekdays, as citations typed the way a missal prints them",
            },
            {
              term: "Traditions",
              detail:
                "Two: the Roman Lectionary for Mass and the Revised Common Lectionary; each of the app's traditions maps to one or both",
            },
            {
              term: "Assertions",
              detail:
                "9,002 in the day engine's check alone, run with every change",
            },
            {
              term: "Rights",
              detail: "Per reading, cleared before its week can be Ready",
            },
          ],
        },
      ],
    },
  ],
  links: { note: WALKTHROUGH },
};

const COMMITMENT_LIBRARY_PAGE: SectionedPage = {
  kind: INTERNAL,
  fact: "About four hundred acts",
  lede: "The acts the app offers, about four hundred of them, written and kept in one place, with the funnel that chooses one.",
  spec: [
    { label: "Role", value: ONE_PERSON },
    {
      label: "Stack",
      items: [
        "TypeScript",
        "Next.js",
        "Postgres",
        "Prisma",
        "Anthropic API",
        "TanStack Table",
      ],
    },
    { label: "Where", value: BACK_OFFICE },
    { label: "Code", value: WALKTHROUGH },
  ],
  plate: {
    media: {
      kind: "image",
      src: commitmentsCommitment,
      alt: "The commitment library's detail view for one act, Watch a young mom's kids for an hour: a painted image of a mother on the floor with two small children, Copy Details and Export JSON buttons, and the act's title, its category, Act of Faith, and its difficulty, Hard.",
    },
    caption:
      "One act, as written and as kept. The pillar is out of the client; the library is not.",
  },
  sections: [
    {
      id: "does",
      number: "01",
      label: "What it does",
      statement: "About four hundred acts, and the funnel that picks one.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Placeholder. An act is a small, concrete commitment the app can offer: a thing to do today, in a category, at a difficulty, for a life context. The library holds about four hundred, each with its text, its steps, its tags, an approval status, and a preview of how it reads in the app. Drafting them is helped: a rough idea and a target profile go to the model and come back as a filled form, and a duplicate finder reads the approved rows for pairs that say the same thing.",
            "Placeholder. Choosing one is the funnel. Eligibility, a split into universal acts and personalized ones, an exclusion of what was done lately or shown yesterday, hard gates on life context and the rest, a weighted score and its penalties, and a pick that takes the top act eighty-five times in a hundred and another at random otherwise. If all four of the day share a category the last is swapped out, and the set is cached per person per day and logged with its score sheet. The Profile Simulator on the Prava page replays this for a built person.",
          ],
        },
        {
          kind: "figures",
          figures: [
            {
              media: {
                kind: "diagram",
                name: "selection-funnel",
                label:
                  "The selection funnel: eligibility, the split into universal and personalized pools, recency exclusion, hard gates, weighted score, penalties, the 85/15 pick, the diversity nudge, and the cache and log.",
              },
              caption: "Each stage removes; none adds. Brass is the pick.",
            },
          ],
        },
      ],
    },
    {
      id: "hard",
      number: "02",
      label: "What was hard",
      statement:
        "Removing a pillar from the client and keeping it on the server.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Placeholder. The Act pillar was removed from the shipped client in July 2026. The server side remains: the library, the funnel, the logs, and this tool. The feature is returning.",
            "Placeholder. Taking a pillar out without breaking what was built on it meant cutting the client and leaving the server whole: the backend ships ahead of the app, so an older build on someone's phone can still ask for its daily set and be answered. The schema is additive-only, so nothing was dropped; the client simply stopped asking. That is the decision the Prava page calls the process being the second engineer, applied in reverse.",
          ],
        },
      ],
    },
  ],
  links: { note: WALKTHROUGH },
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
        ratingCount: 52,
        plate: {
          kind: "screens",
          screens: PRAVA_SCREENS.map(({ src, alt }) => ({ src, alt })),
        },
        sentence:
          "An iOS prayer and scripture app built around the Church's week rather than a streak. Every AI feature in it reads a versioned prompt with a tested fallback behind it. Designed, built, and shipped solo.",
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
        depth: "standard",
        page: PROMPT_LAB_PAGE,
        name: "Prompt Lab",
        detail: "back office · internal",
        plate: {
          kind: "image",
          src: promptLabHistoryDiff,
          alt: "The Prompt Lab's history and diff view for one surface: its versions listed, the active one marked, and a diff between two of them.",
        },
        placeholder: true,
        sentence:
          "Where Prava's prompts are versioned and checked against their fallbacks.",
        stack: {
          items: ["TypeScript", "Next.js", "Postgres", "Prisma", "Anthropic API"],
        },
      },
      {
        id: "analytics-dashboard",
        slug: "analytics-dashboard",
        depth: "standard",
        page: ANALYTICS_DASHBOARD_PAGE,
        name: "Analytics dashboard",
        detail: "back office · internal",
        plate: {
          kind: "image",
          src: analyticsEngagement,
          alt: "Prava's admin analytics dashboard: daily engagement with a definition-change marker, demo data",
        },
        placeholder: true,
        sentence:
          "Where Prava's usage and AI cost are measured rather than assumed.",
        note: "demo data",
        stack: {
          items: ["TypeScript", "Next.js", "Postgres", "PostHog", "Recharts"],
        },
      },
      {
        id: "lectionary-authoring-tool",
        slug: "lectionary-authoring-tool",
        depth: "standard",
        page: LECTIONARY_TOOL_PAGE,
        name: "Lectionary authoring tool",
        detail: "back office · internal",
        plate: {
          kind: "image",
          src: lectionaryWeekReadings,
          alt: "The lectionary authoring tool's week view: two weekday sets of readings as citations, each row with rights and active badges and an Edit button.",
        },
        placeholder: true,
        sentence:
          "Where the readings for the Church's week are entered and checked.",
        stack: { items: ["TypeScript", "Next.js", "Postgres", "Prisma"] },
      },
      {
        id: "commitment-library",
        slug: "commitment-library",
        depth: "standard",
        page: COMMITMENT_LIBRARY_PAGE,
        name: "Commitment library",
        detail: "back office · internal",
        plate: {
          kind: "image",
          src: commitmentsCommitment,
          alt: "The commitment library open on one act: its image, its title, its category, and its difficulty.",
        },
        placeholder: true,
        sentence: "The commitments the app offers, written and kept in one place.",
        stack: {
          items: [
            "TypeScript",
            "Next.js",
            "Postgres",
            "Prisma",
            "Anthropic API",
            "TanStack Table",
          ],
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
        id: "on-sale-system",
        system: true,
        name: "The on-sale system",
        detail: "ticket brokerage · three tools · proprietary",
        plate: {
          kind: "venue",
          label: VENUE,
        },
        placeholder: true,
        sentence:
          "Placeholder. A rule drawn on a venue map in the portal, resolved to seat IDs at save, served to a Chrome extension that paints it on a buyer's Ticketmaster screen, and watched live as the on-sale runs. Three tools, one rule, over a hundred buyers at one of the larger US brokers.",
        stack: {
          items: ["React", "Node", "BigQuery", "Chrome MV3", "Firestore"],
          placeholder: true,
        },
      },
      {
        id: "pricing-portal",
        slug: "pricing-portal",
        depth: "full",
        page: PRICING_PORTAL_PAGE,
        name: "Pricing portal",
        plate: {
          kind: "diagram",
          name: "pricing-portal-cell",
          label:
            "The pricing portal: a rules panel with three rules for one event.",
        },
        placeholder: true,
        sentence:
          "Placeholder. Where analysts price inventory against the market and on-sale managers draw the rules. A team system; my parts are named on its page.",
        stack: { items: ["React", "Redux", "Node", "BigQuery", "Redis"] },
      },
      {
        id: "buyer-extension",
        slug: "buyer-extension",
        depth: "full",
        page: BUYER_EXTENSION_PAGE,
        name: "Buyer extension",
        plate: {
          kind: "diagram",
          name: "buyer-extension-cell",
          label:
            "The buyer extension: seats in a rule's band ringed on a venue map, with the rule's note beside them.",
        },
        placeholder: true,
        sentence:
          "Placeholder. Runs inside Ticketmaster, borrows the portal's session, and paints the rules onto the map a buyer is looking at. Five origins, one rule.",
        stack: { items: ["Chrome MV3", "JavaScript", "React"] },
      },
      {
        id: "on-sale-monitor",
        slug: "on-sale-monitor",
        depth: "standard",
        page: ON_SALE_MONITOR_PAGE,
        name: "On-sale monitor",
        plate: {
          kind: "diagram",
          name: "on-sale-monitor-cell",
          label:
            "The on-sale monitor: the Queue: Events view, one row per event with active queues and positions.",
        },
        placeholder: true,
        sentence:
          "Placeholder. The extension's telemetry as live tables, with the waiting room rebuilt per buyer and per event. Built alone.",
        stack: { items: ["React", "Firestore", "Firebase"] },
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
            { label: "Stack", items: ["Node", "Socket.io", "MySQL", "GCP"] },
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

