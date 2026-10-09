import type { StaticImageData } from "next/image";
import arbitrageTable from "@/public/images/arbitrage-table.png";
import adminHub from "@/public/images/captures/admin-hub-1920@2x.png";
import analyticsEngagement from "@/public/images/captures/analytics-engagement-16x10@2x.png";
import commitmentsSimulator from "@/public/images/captures/commitments-simulator-16x10@2x.png";
import lectionaryEditSheet from "@/public/images/captures/lectionary-edit-sheet-16x10@2x.png";
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
 * other projects would have none, and would link to theirs; none is one
 * now.
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
  /** The buyer extension's venue, looping from 960px up (ExtensionLoop). */
  | { kind: "loop"; label: string };

/** What a project is built with, one token each (StackTokens). A
    placeholder is a guess to correct; the row says so first. */
export type Stack = { items: string[]; placeholder?: true };

/**
 * A project's page (app/work/[slug]), at one of four depths. Featured: Full
 * with a plate that moves, a system section, two drawings where one would
 * not do, and a closing outcome section; nine sections. Full: the title
 * block, a plate, five or six numbered sections. Standard: the same with
 * two sections. Note: the title block and three paragraphs.
 */
export type Depth = "featured" | "full" | "standard" | "note";

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

/** The plate under the title block. Screens carry their own captions. A
    Featured page's plate is the loop (ExtensionLoop), with a caption. */
export type PagePlate =
  | {
      kind: "screens";
      screens: { src: StaticImageData; alt: string; caption: string }[];
    }
  | { kind: "loop"; label: string; caption: string }
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
  /** "01" to "09": the running margin's numeral. */
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
  | { depth: "featured" | "full" | "standard"; page: SectionedPage }
  /** Whatever a Note has not had written is filled in (pages.ts). */
  | { depth: "note"; page?: Partial<NotePage> };

/** The home page's featured row (app/page.tsx): a project is featured as
    the engineering one or the AI one, the label's second word. */
export type Featured = "engineering" | "ai";

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
  /** Left out everywhere for now (EMPLOYERS below): Work, the index, the
      featured row, the sitemap, and its page, which is not found. Its
      content stays here for when it is shown. */
  hidden?: boolean;
  /** On the home page's featured row, as which of its two. One project
      each, checked below. */
  featured?: Featured;
  /** Off the row for now, keeping its word: the check below still counts
      it, so a second project cannot take the word meanwhile. */
  featuredHidden?: boolean;
  /** The row's sentence, where Work's is not it. */
  featuredSentence?: string;
  /** The row's plate, where the project has none in Work yet. */
  featuredPlate?: DiagramPlate;
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
              text: "Placeholder. A save sanitises the record, posts an alert if the stop switch is set, appends a row, writes per-seat notifications, and warms the cache. The portal reads through a freshness check; the extension reads the latest-row view directly.",
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
};

/** What the buyer extension's loop shows: the hero's plate in Work and the
    page's title plate; the still is the share image (app/og). */
const EXTENSION_PLATE =
  "A synthetic venue map on a buyer's Ticketmaster screen with the extension's overlay painted: rings on the seats rule 01 names in section 105, a fill on the section, a note with the count and the criteria, and the stop overlay that replaces the paint when the rule set says stop.";
const EXTENSION_STILL: ShareImage = {
  src: "/og/buyer-extension.png",
  alt: EXTENSION_PLATE,
};

const BUYER_EXTENSION_PAGE: SectionedPage = {
  kind: "Chrome extension",
  fact: "Over a hundred buyers",
  lede: "A Chrome extension that ran inside Ticketmaster during on-sales. It painted a manager’s buy rules onto the seat map a buyer already had open, recorded the purchase as it happened, and brought a verification code to the screen that asked for it. Behind it sat a relay service and a mail hook that I also built.",
  spec: [
    { label: "Role", value: "Sole engineer; handed off before leaving" },
    {
      label: "Stack",
      items: [
        "Chrome MV3",
        "JavaScript",
        "React",
        "Vite",
        "Node and Express",
        "Python",
        "Postgres",
        "Firestore",
        "BigQuery",
      ],
    },
    // The Code row says it is proprietary, so Where does not.
    { label: "Where", value: BROKER },
    { label: "Code", value: "Proprietary, walkthrough on request" },
  ],
  plate: {
    kind: "loop",
    label: EXTENSION_PLATE,
    caption:
      "What a buyer sees, in the order the extension paints it: rings, the section fill, the note, and, when the rule set says stop, the overlay. Loops at fourteen seconds; still under reduced motion. Synthetic venue, synthetic rule.",
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
            "A ticket broker buys tickets the moment they go on sale and resells them. On the morning of a big on-sale, a hundred buyers sit at Ticketmaster seat maps, each with a few seconds to pick seats before they are gone. A manager decides which seats are worth buying and at what price. Before this tool, those decisions reached the buyers as Slack messages, sent as the sale moved and the criteria changed. Buyers missed them, or read them late, and carted the wrong seats over and over. Every wrong cart cost money.",
            "The obvious fix is to show the rules on the seat map itself. The difficulty is that the seat map belongs to Ticketmaster. We do not control its code, we cannot change its HTML, and it was never designed for another program to read it. Seat elements carry no usable ID. The map renders seconds after the page loads and redraws itself on every zoom. The markup changes from month to month. And a Chrome extension, which is the only kind of program that can run inside someone else’s web page, is not allowed to read the network responses that would answer most questions directly.",
            "So the job was: put the manager’s rule on the seat the buyer is looking at, record what the buyer bought without asking anyone to type it in, and when Ticketmaster asks for a verification code, get that code onto the buyer’s screen. All of it inside a page we did not own, with no login of our own, and without publishing to the Chrome Web Store.",
          ],
        },
      ],
    },
    {
      id: "system",
      number: "02",
      label: "The system",
      statement: "Five things that talked to each other for ninety minutes.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "The company’s pricing portal, a separate internal web app, is where managers wrote the buy rules: which sections and rows, up to what price, with a maximum number of tickets per event and per account. The extension was the only piece of software that touched everything else. Inside Ticketmaster it painted those rules on the map, recorded the purchase as it moved from cart to confirmation, and surfaced verification codes. Inside the company’s approval desk, a third-party tool where managers approved each cart, it highlighted the carted tickets that matched a rule, showed how close an event was to its maximum, and added a button that posted a bonus to Slack.",
            "Verification codes came from two places: an email inbox, or one of a bank of phone lines connected to an SMS gateway. Two small services I wrote moved a code from where it landed to the buyer’s screen: an Express service that the extension called, and a Python script that ran once for every email that arrived. The five parts (portal, extension, approval desk, relay service, mail hook) could not talk to each other directly. Everything that passed between them is drawn on the map below.",
          ],
        },
        {
          kind: "figures",
          figures: [
            {
              media: {
                kind: "diagram",
                name: "system-map",
                label:
                  "The system map: the buyer extension at the centre; the pricing portal to its left sending rules and lending its token; Ticketmaster pages above, read for seats and the cart and painted with rings, fill, note, and the stop; the approval desk to its right receiving highlighted rows, the per-event maximum, and the bonus button; the code relay below, asked for a code and returning it to screen and clipboard.",
              },
              caption:
                "The five parts, one labelled flow on each edge. Brass is what the extension carries; grey is what it reads.",
            },
          ],
        },
        {
          kind: "facts",
          facts: [
            {
              term: "Pricing portal",
              detail:
                "Buy rules, a maximum per event, limits per account; lends the extension its session",
            },
            {
              term: "Extension",
              detail:
                "Paints, records, surfaces codes; the only part that touches all four others",
            },
            {
              term: "Ticketmaster",
              detail:
                "The event page, the map, the cart, the confirmation; read and decorated, never changed",
            },
            {
              term: "Approval desk",
              detail:
                "Where managers approved carted tickets; the extension shades its rows and adds one button",
            },
            {
              term: "Code relay",
              detail:
                "Express and a Python mail hook; an inbox and an SMS gateway with hundreds of ports. The same service carries the telemetry into the warehouse",
            },
          ],
        },
      ],
    },
    {
      id: "path",
      number: "03",
      label: "The rule's path",
      statement: "Five origins, seven steps, one rule.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "A rule written in the portal has to travel a long way to become paint on a seat. Chrome keeps every extension in separate compartments on purpose, so a rule crosses five of them: the portal’s web page, where the manager’s login lives; the extension’s background worker, a script with no page of its own; the extension’s content script, which runs inside the Ticketmaster tab but in a sandbox that cannot see Ticketmaster’s own JavaScript; a second script injected into Ticketmaster’s own JavaScript world, which is the only place the seat IDs can be read; and the identity frame, an embedded page on a third domain where Ticketmaster asks for verification codes. None of these can call the others. Every hop is a message, and the drawing shows each one.",
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
            {
              media: {
                kind: "diagram",
                name: "rule-path",
                label:
                  "The rule's path in seven steps: the map appears, the content script asks, the worker fetches with the borrowed token, the poll runs every fifteen seconds while the tab is visible, the rules are handed into the page world, seat IDs are read from React internals, the seats are painted.",
              },
              caption:
                "Seven steps from the map appearing to the paint. No long-lived ports anywhere: one-shot messages with a reply, and window messages across the world boundary.",
            },
          ],
        },
        {
          kind: "paragraphs",
          paragraphs: [
            "The extension checks the portal for new rules every fifteen seconds while the Ticketmaster tab is visible and stops when the tab is hidden. If nothing changed, it stops before repainting. When the buyer pans or zooms the map, it repaints from the rules it already has, one second after the movement stops, with no network call. If no portal tab is open, the check fails and the extension’s icon turns red, so the buyer knows before the sale starts.",
          ],
        },
      ],
    },
    {
      id: "relay",
      number: "04",
      label: "The code relay",
      statement: "A code arrives on the screen it is needed on.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Ticketmaster sometimes asks a buyer for a one-time verification code before letting them into the queue or through checkout. The code is sent by text message or email to the account’s phone number or address, which for a broker means one of many company lines and inboxes, none of them on the buyer’s desk. The relay gets that code to the buyer.",
            "When the page asks for a code, the content script tells the worker, the worker calls the Express service, and the service holds the HTTP response open until the code exists. It checks first: if a code for that line arrived in the last fifteen minutes, it returns that one. Otherwise, for a phone line, it opens that line’s port on the SMS gateway and checks the code store every ten seconds for up to ninety; when the text arrives, the gateway calls a webhook that writes the code to Firestore, keyed by line. For an email address, the Python mail hook has already done its part: the mail server pipes every incoming message into the script, which parses it with each field in its own try block (so one bad header never loses the code) and writes the latest code for that address into Postgres.",
            "Either way the held response returns the code, and the port is released whether a code came or the wait timed out. The worker hands the code to the page and copies it to the clipboard, so the buyer sees it where they are and can paste it. Nothing on this path reads a password or touches the account itself. The relay moves one six-digit string from where it landed to where it was needed.",
          ],
        },
        {
          kind: "figures",
          figures: [
            {
              media: {
                kind: "diagram",
                name: "code-relay",
                label:
                  "The code relay as a sequence: the page asks the worker, the worker asks the service, the service opens a port on the SMS gateway; the SMS lands and the webhook posts the code, or the mail hook reads it from an inbox; the code is stored; the worker polls until it is there and hands it to the page and the clipboard.",
              },
              caption:
                "The sequence, page to clipboard. Brass is the code; grey is the asking. Two ways in, two stores, one poll, and a release on every exit.",
            },
          ],
        },
        {
          kind: "paragraphs",
          paragraphs: [
            "The gateway holds hundreds of ports grouped under gateway IDs, and only one port in a group can be open at a time; a text message only arrives on an open port. So the service is also a scheduler. It keeps a map of which ports are open, a queue of waiting requests per group, and a record of which line each group is serving. A request whose group is busy waits in the queue with its response still held open; when the current port closes, the next request opens the next port. The list of lines is refreshed from the gateway once a day. The drawing below is what the service is doing while the buyer waits.",
          ],
        },
        {
          kind: "figures",
          figures: [
            {
              media: {
                kind: "diagram",
                name: "port-scheduler",
                label:
                  "The port scheduler: three SMS gateways, each with groups of sixteen ports, one port open per group, and a queue of waiting requests beside each group.",
              },
              caption:
                "Gateways, groups, one open port, the queue. Check first, bounded poll, release on every exit. Counts and IDs are invented.",
            },
          ],
        },
      ],
    },
    {
      id: "desk",
      number: "05",
      label: "The approval desk",
      statement: "The same rule, read from the manager's side.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Managers approved purchases in a third-party tool: a table of carted tickets, one row per cart, that re-rendered itself constantly. The extension ran there too. It grouped the rows by event, fetched each event’s rules from the portal once, and shaded every row whose seats matched a rule, so a manager scanning two hundred rows could see at a glance which ones the plan had asked for.",
            "Each event’s maximum from the portal became a gauge showing how many tickets had been carted or approved against it, lit when full. One button was added to each matching row. A click posted the event, the seats, and the buyer’s name to a Slack channel, which is how a buyer’s bonus got recorded. The button’s state lived in extension storage so every open tab agreed on what had been clicked.",
          ],
        },
        {
          kind: "figures",
          figures: [
            {
              media: {
                kind: "diagram",
                name: "approval-desk",
                label:
                  "The approval desk as the extension leaves it: a table of carted tickets with the rows that match a rule highlighted, a gauge per event showing how close it is to its maximum, and a bonus button whose click posts to Slack. Synthetic rows.",
              },
              caption:
                "The table as the extension leaves it: matching rows, the gauge, the button, its post. Every row is invented; the tool is not named.",
            },
          ],
        },
      ],
    },
    {
      id: "telemetry",
      number: "06",
      label: "The telemetry",
      statement: "Every step of the purchase, recorded without a keystroke.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "As a buyer moves through a sale, the extension notices each step on the page: the event page loading, the position in the waiting room, the sign-in, the cart, a failed cart, a checkout error, the confirmation. Each is stamped with the browser’s clock and sent through the worker to two places. BigQuery, the company’s data warehouse, keeps it for good. Firestore keeps it for the next hour, which is where the on-sale monitor reads it to show managers what every buyer is doing right now.",
            "The ingestion endpoint stamps a second time on arrival, and the monitor orders rows by that one. The gap between the two clocks can be measured from stored data; the gap from stored document to a manager’s screen cannot, so I quote no latency figure anywhere on this site.",
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
                "Which clock stamps the record where. The live half is push; nothing on it polls.",
            },
          ],
        },
      ],
    },
    {
      id: "hard",
      number: "07",
      label: "Hard parts",
      statement: "Nine, in the order they were met.",
      body: [
        {
          kind: "items",
          items: [
            {
              title: "Matching rules to seats on a map you do not own",
              text: "A rule says “section 112, rows A to J”. The map shows circles with no section or row on them. Three approaches over time: reading seat numbers from nearby labels, then mapping grid coordinates, then reading Ticketmaster’s own seat IDs out of the React internals attached to each element, which is only possible from inside the page’s own JavaScript world. The earlier two stayed as fallbacks.",
            },
            {
              title: "Reading the page's own network responses",
              text: "Chrome’s current extension platform, Manifest V3, cannot read the body of a response the page receives. The workaround is a script injected into the page’s own world that wraps fetch and XMLHttpRequest and copies the one response that matters. The race: the page could make that call before the wrapper was in place. The fix moved the wrapper to a script Chrome injects at document start, before any page code runs, plus a buffer that holds early responses until the rest of the extension is up.",
            },
            {
              title: "Timing on a late-rendering single-page app",
              text: "The extension’s scripts start before the page body exists; the map arrives seconds later and redraws on every zoom. Observers wait for one specific element and fire once, a debounce absorbs the zoom, a re-entrancy guard keeps two passes from overlapping, and everything pauses while the tab is hidden.",
            },
            {
              title: "The cross-origin identity frame",
              text: "Ticketmaster asks for verification codes inside an embedded frame on a different domain, which the surrounding page cannot read. A content script inside the frame reports to the parent by window message with an explicit target origin, and the parent checks who sent it. Spotting the prompt is deliberately redundant: an observer, a periodic check, and a short burst of checks after the buyer submits.",
            },
            {
              title: "Auth without a login",
              text: "The extension has no sign-in of its own. It reads the portal’s session token from an open portal tab, treats it as good for a fixed window, and reloads the tab when it goes stale so the portal’s own app refreshes it. The backend accepts requests only from one pinned extension ID.",
            },
            {
              title: "Markup that changes under you",
              text: "The extension targets sixty of Ticketmaster’s own test attributes, each written three ways because the site has spelled the attribute three ways over the years. Parsers prefer the data the page embeds in its JavaScript and fall back to the HTML. Order confirmation has three layers of detection, the last of them a human.",
            },
            {
              title: "The two-tier cache on the approval desk",
              text: "The desk redraws its table constantly, and a naive extension would refetch rules for every row every time. The first version did. The current one scopes the observer to the table, debounces, groups rows by event, shares one in-flight request per event, and caches in memory first and extension storage second.",
            },
            {
              title: "Recording a purchase nobody typed in",
              text: "A cart, a failed cart, a checkout error, and a confirmation each look different on the page and none of them announces itself. Each is read from the page’s embedded data first and the HTML second, keyed to the browser tab so one buyer’s three tabs stay three purchases, and sent with a reference the buyer sees in a small notification. The extension’s popup is the last layer: the captured cart, pre-filled, for a human to correct.",
            },
            {
              title: "The port scheduler",
              text: "Hundreds of ports, only one open per group at a time, so two requests in a group must never fight over it. The discipline: check the store before opening anything, hold the caller’s response open while it waits in the group’s queue, bound the wait, and release the port on every exit path, failure included, so one bad line can never hold a group. A status route showed the port map and the queues live during a sale.",
            },
          ],
        },
      ],
    },
    {
      id: "differently",
      number: "08",
      label: "What I would do differently",
      statement: "Four things, in order of regret.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "A guard for the day Ticketmaster’s internals change shape. Today a break paints zero seats, and the only signal is a note that reads zero. Then a test suite, which the codebase never had, around twenty-one observers spread over eleven files. Then one shared rules cache on the Ticketmaster side instead of one poll per tab.",
            "Last, the port scheduler’s state. The codes themselves moved to Firestore so a restart mid-sale would not lose them, but the port map and the queues stayed in process memory. A restart starts them empty with buyers still waiting on held responses. It never happened during a sale. Given enough sales, it would have.",
          ],
        },
      ],
    },
    {
      id: "outcome",
      number: "09",
      label: "Outcome",
      statement:
        "Over a hundred buyers, two seasons of on-sales, handed off running.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "The extension grew from a three-hundred-line prototype into the one thing every buyer had open during an on-sale, and the only part of the system that touched the portal, Ticketmaster, the approval desk, and the code relay at once. Buyers stopped carting seats the manager had not asked for. Managers stopped typing rules into Slack. The company’s tools, which had never talked to each other, finally did. I handed it off before I left with the service, the mail hook, and the scheduler documented and running.",
          ],
        },
      ],
    },
  ],
  links: { note: WALKTHROUGH },
  share: EXTENSION_STILL,
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
};

/** The back-office pages share a top row, a role, and a way back. */
const BACK_OFFICE = "Prava's back office · one of twelve tools over 140 admin routes";
const SOLE_ENGINEER = "Sole engineer";
const INTERNAL = "Internal tool";

const PROMPT_LAB_PAGE: SectionedPage = {
  kind: INTERNAL,
  fact: "Eleven AI surfaces",
  lede: "Where the system prompts behind Prava's eleven AI surfaces are versioned, published, and checked against the code they fall back to.",
  spec: [
    { label: "Role", value: SOLE_ENGINEER },
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
            "Every AI surface in the app reads its system prompt through one resolver instead of from a constant. The resolver keys on the surface and the person's tradition, answers from a sixty-second cache when it can, and otherwise does one cold read under a time budget. The prompt is assembled from three parts: the surface's own text, a grounding chosen for the tradition, and the shared voice every surface speaks in.",
            "If anything on that path fails, for any of nine named reasons, the call falls back to the in-code version of the same prompt, pinned byte for byte to the seeded prompts by snapshot checks. Either way the generation ledger records the version served or the reason it fell back.",
          ],
        },
        {
          kind: "facts",
          facts: [
            { term: "Surfaces", detail: "Eleven governed; thirteen at launch" },
            {
              term: "Identity",
              detail:
                "A 143-cell matrix (surface by denomination) proving the seed equals the code",
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
      statement: "One edit can change what eleven surfaces say.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "A prompt is an entity with a pointer to its published version; versions accumulate underneath it and never change. One draft at a time is edited in place, diffed against what is published, and published by moving the pointer. A rollback is the same move, pointed at an older version.",
            "The shared voice and the groundings are shared, so an edit to either fans out. When it does, publishing passes through an impact review that lists every dependent surface with what it reads now and what it will read after. A digest of that review is checked again inside the publish, so what was reviewed is what ships. The version history and diff in the screenshot at the top of the page are the same comparison, kept for every version.",
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
                "One pointer per entity, versions only ever added, and an impact review between a fan-out edit and its publish.",
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
    { label: "Role", value: SOLE_ENGINEER },
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
      statement: "Present means one of eight things happened that day.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Eight kinds of record can show that a person was there: the prayer and scripture logs, a journal entry, a Sunday reading, a weekday reading, a Bible chapter read to its end, a mark on a verse, a request to the people a person prays for, and the ledger of surfaces opened. Opening the app is not one of them. The dashboard folds all eight into one presence per person per day, and every widget reads that fold. None reads a source directly; a source scan in the check chain fails if one tries.",
            "The day is one day for everyone. Activity rows also carry a date written in the person's own timezone, and filtering on it silently drops anyone east of UTC, so the dashboard filters only true timestamps and buckets every one of them to a Pacific day before the union. That rule came after two timezone bugs, not before.",
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
                "Every capture on this page is demo data",
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
                  "The presence union: eight sources, one per kind of record, bucketed to the Pacific day and folded into one presence per person per day, read by many widgets.",
              },
              caption:
                "Eight sources, one fold, many widgets. The dashed box is the timezone step, which happens first.",
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
            "When the definition of present widened from four sources to eight, every chart would have shown a jump that was not growth. The fix was a marker: the day the definition changed is drawn on the chart as a dashed line, the aggregate cards carry a chip, and the note is printed once under the view. Nothing is backfilled; history is kept broken at a dated line rather than rewritten.",
            "The second hard part was showing the dashboard at all. A demo mode answers every route from one seeded synthetic world with a frozen clock, and a check script loads its modules with a database stand-in that throws on any access. Every number in the captures on this page is generated.",
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
    { label: "Role", value: SOLE_ENGINEER },
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
      src: lectionaryEditSheet,
      alt: "The lectionary tool's edit sheet for a Sunday psalm: the citation, the text cached in five translations, and a teaching note",
    },
    caption:
      "One reading's edit sheet: citation, cached text per translation, and the teaching note.",
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
            "A date goes through two engines. The Sunday engine finds the season, the Sunday within it, and the year's cycle. The day engine builds the whole liturgical year, settles feasts on a thirteen-level precedence scale, and transfers one that lands on a day it cannot outrank. A Revised Common weekday keys to its nearest Sunday. The result is one slot key that names the day without naming the year, so a row written once serves every time the calendar comes round.",
            "The person's tradition maps to an ordered list of lectionaries (Roman, Revised Common, or one and then the other) and the first with readings for that key wins. A day with none returns nothing rather than something wrong. Checks sweep every Sunday to 2034 in both traditions, and the day engine's check runs 9,002 assertions, one winner per day among them, so a change to either engine fails before it moves a feast.",
            "Every reading can carry a short teaching note, and every week a theme. Both are drafted with Claude: the model is sent the passage in the public-domain translation (never a licensed one) and returns a draft into the sheet, where it is read, edited, and saved by hand. A draft that is not saved is never stored, and the app serves only what was saved.",
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
            "A week is not ready because its readings are named. A reading is ready when its row is active, its citation parses into verse ranges, the text of every range is cached in the public-domain translation the app can always show, and the rights to show it are cleared. The tool draws that as a horizon: how many consecutive weeks ahead are whole, and for each week what is missing. Each missing unit opens the sheet that fixes it.",
            "The horizon ends at the first week with anything missing. Beyond it the app serves nothing for that day rather than a guess: the home card does not render, and the morning push has nothing to send. Text is fetched once at write time, under a provider's daily cap, so the read path never waits on anyone.",
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
      statement: "Two traditions, one key, 9,002 assertions.",
      body: [
        {
          kind: "paragraphs",
          paragraphs: [
            "The readings, authored week by week, have taken longer than the engines. The precedence and transfer tables still carry a note that they await a line-by-line pass against the missal, and the check scripts say so rather than hide it.",
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
                "Two, the Roman Lectionary for Mass and the Revised Common Lectionary; each of the app's traditions maps to one or both",
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
            {
              term: "Drafting",
              detail:
                "Teaching notes and week themes drafted with Claude from the public-domain text, saved only after review",
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
  lede: "The acts the app offers, written and kept in one place, with the funnel that chooses one for each person each day.",
  spec: [
    { label: "Role", value: SOLE_ENGINEER },
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
      src: commitmentsSimulator,
      alt: "The commitment library's Profile Simulator: a built profile, the scored table with one breakdown open, and the day's four acts",
    },
    caption:
      "The Profile Simulator: a built person, the score sheet, and the day's four acts.",
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
            "An act is a small, concrete commitment the app can offer: a thing to do today, in a category, at a difficulty, for a life context. The library holds about four hundred, each with its text, its steps, its tags, an approval status, and a preview of how it reads in the app. A rough idea and a target profile go to the model and come back as a filled form, and a duplicate finder reads the approved rows for pairs that say the same thing.",
            "Choosing one is the funnel. Eligibility, a split into universal acts and personalized ones, an exclusion of what was done lately or shown yesterday, hard gates on life context and the rest, a weighted score and its penalties, and a pick that takes the top act eighty-five times in a hundred and another at random otherwise. If all four of the day share a category the last is swapped out, and the set is cached per person per day and logged with its score sheet. The Profile Simulator in the screenshot above replays all of it for a built person, score sheet included.",
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
            "The Act pillar was removed from the shipped client in July 2026. The server side remains: the library, the funnel, the logs, and this tool. The feature is returning.",
            "Taking a pillar out without breaking what was built on it meant cutting the client and leaving the server whole. The backend ships ahead of the app, so an older build on someone's phone can still ask for its daily set and be answered. The schema is additive-only, so nothing was dropped; the client simply stopped asking.",
          ],
        },
      ],
    },
  ],
  links: { note: WALKTHROUGH },
};

/** Every employer with every project, hidden ones too. */
const ALL_EMPLOYERS: Employer[] = [
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
        ratingCount: 53,
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
        // A grounded question surface for Prava, not built yet: its slot in
        // the grid and its place on the home page's featured row, with the
        // round 10 handoff's still (design/design_handoff_featured_row).
        // Hidden until it is built.
        id: "ask-the-reading",
        slug: "ask-the-reading",
        depth: "note",
        name: "Ask the reading",
        pending: true,
        sentence:
          "A question asked after the day's reading, answered only from the passage retrieved for it, with the citation shown.",
        stack: {
          items: ["TypeScript", "Next.js", "Postgres", "Anthropic API"],
          placeholder: true,
        },
        hidden: true,
        featured: "ai",
        featuredHidden: true,
        featuredPlate: {
          kind: "diagram",
          name: "ask-the-reading",
          label:
            "Ask the reading, a grounded question surface for Prava: a question asked after the reading, the passage retrieved for it with its source, and an answer that cites that passage and nothing else.",
        },
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
        sentence:
          "Where Prava's usage and its AI pipeline are measured rather than assumed.",
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
          src: lectionaryEditSheet,
          alt: "The lectionary tool's edit sheet for a Sunday psalm: the citation, the text cached in five translations, and a teaching note",
        },
        sentence:
          "Where the readings for the Church's week are entered and checked.",
        stack: {
          items: ["TypeScript", "Next.js", "Postgres", "Prisma", "Anthropic API"],
        },
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
          src: commitmentsSimulator,
          alt: "The commitment library's Profile Simulator: a built profile, the scored table with one breakdown open, and the day's four acts",
        },
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
        id: "buyer-extension",
        slug: "buyer-extension",
        depth: "featured",
        page: BUYER_EXTENSION_PAGE,
        name: "Buyer extension",
        detail: "Chrome extension · proprietary",
        plate: {
          kind: "loop",
          label:
            "A synthetic venue map on a buyer's Ticketmaster screen with the extension's overlay painted: rings on the seats rule 01 names in section 105, a fill on the section, a note with the count and the criteria, and the stop overlay.",
        },
        featured: "engineering",
        featuredSentence:
          "Inside Ticketmaster during an on-sale, painting a manager's buy rules onto the map a buyer is already looking at.",
        sentence:
          "A Chrome extension that ran inside Ticketmaster for over a hundred buyers at one of the larger ticket brokers in the country. It painted the manager’s buy rules onto Ticketmaster’s seat map, recorded each purchase as it happened, and brought the verification code to the screen that asked for it. I built every part of it.",
        stack: {
          items: [
            "Chrome MV3",
            "JavaScript",
            "React",
            "Node and Express",
            "Python",
            "Postgres",
            "Firestore",
            "BigQuery",
          ],
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
        sentence:
          "Where analysts priced inventory against the live market and on-sale managers drew the buy rules the extension painted. A team system; the parts I built are named on its page.",
        stack: { items: ["React", "Redux", "Node", "BigQuery", "Redis"] },
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
        sentence:
          "The extension’s telemetry as live tables: who is in which Ticketmaster queue, what they have carted, what failed, and what was bought. Built alone.",
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

/** What the site shows: each employer less its hidden projects. A hero
    cannot be hidden, so the hero stays first. */
export const EMPLOYERS: Employer[] = ALL_EMPLOYERS.map((employer) => {
  const [hero, ...cells] = employer.projects;
  if (hero.hidden) {
    throw new Error(`${employer.name}'s hero ${hero.id} cannot be hidden`);
  }
  return {
    ...employer,
    projects: [hero, ...cells.filter(({ hidden }) => !hidden)],
  };
});

export type FeaturedProject = Project & { featured: Featured };

/** The order the home page's opening line names the two halves. */
const FEATURED_ORDER: Featured[] = ["engineering", "ai"];

/** The featured projects on the row, engineering then AI (app/page.tsx),
    less any hidden from the row or the site. One project each word, hidden
    or not: a second with the same word fails the build here. */
export const FEATURED: FeaturedProject[] = FEATURED_ORDER.flatMap((featured) => {
  const projects: FeaturedProject[] = ALL_EMPLOYERS.flatMap(({ projects }) =>
    projects.filter(hasPage).flatMap((project) =>
      project.featured === featured ? [{ ...project, featured }] : []
    )
  );
  if (projects.length > 1) {
    throw new Error(
      `More than one project is featured as ${featured}: ${projects
        .map(({ id }) => id)
        .join(", ")}`
    );
  }
  return projects.filter(
    ({ hidden, featuredHidden }) => !hidden && !featuredHidden
  );
});

/** Whether a project is on the row, for its mark in the Work index. */
export const isFeatured = ({ id }: Pick<Project, "id">) =>
  FEATURED.some((project) => project.id === id);
