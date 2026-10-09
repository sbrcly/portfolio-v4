# Caesars facts

Collected 9 October 2026, read-only. No other file was changed. Everything quoted is verbatim. Where a string appears in many mockups, it is quoted once and the files are listed.

Sources:

- `components/work/employers.ts` on `main` at `3a4202f`, plus `components/work/pages.ts` (`unwritten()`), `components/work/links.ts` and `components/work/VideoPlate.tsx`.
- The public GitHub repos, fetched through `gh api` on 9 October 2026. Each one holds a single file, `README.md`.
- `reports/PORTFOLIO_DISCOVERY.md` and `reports/COPY_INVENTORY.md`.
- **`reports/LEGACY_PORTFOLIO_DISCOVERY.md` does not exist.** It is not in the working tree, and no branch in git history has it. The only other file with "DISCOVERY" in its name under `portfolio/` is `design/prava-back-office/BACK_OFFICE_DISCOVERY.md`, which never mentions the three tools.
- The old site's copy, taken from git at `0949307^` (the commit before "overhaul phase 1: strip old site"): `app/experience/page.tsx`, `app/about/page.tsx` and `app/page.tsx`.
- `public/Scott-Barclay-Resume.pdf`, extracted with `pdftotext`.
- Every file under `design/` that mentions the tools.

---

## Shared: the employer

### employers.ts (lines 1712 to 1718)

```ts
    id: "03",
    name: "Caesars Sportsbook",
    // Placeholder role line and years.
    role: "Developer analyst, promoted from trader",
    years: "2018 to 2022",
```

### Write-up links (`components/work/links.ts`)

```ts
/** A public repo that holds a write-up of proprietary work, not its code. */
export const writeUpUrl = (repo: string) => `https://github.com/sbrcly/${repo}`;
```

### Note pages with no `page` object (`components/work/pages.ts`, `unwritten()`)

When a project has no `page` object, or a page that leaves fields out, these values fill the gaps:

- lede: "Placeholder. One sentence on what it is and who it was for."
- spec: Role (`employer.role`), Stack (`stack.items`), Write-up (`writeUp`, linked to `writeUpUrl(writeUp)`).
- paragraphs: `[sentence, "Placeholder. What was hard about it: the one problem that took the most iteration, and how it was settled. Three or four sentences, in the first person, with the detail an engineer would ask about.", "Placeholder. How it was used and what came of it: who ran it and when, what it changed for them, and where the work can be checked or walked through."]`
- links: note `"Walkthrough on request"` (the `WALKTHROUGH` constant), primary `` `Write-up: ${writeUp}` ``.

### Current site copy outside employers.ts

`app/page.tsx` lines 178 to 192 (the tags are removed here; each tool name is a `TextLink` to `#work-live-odds-console`, `#work-arbitrage-detector` or `#work-trading-schedule`):

> The trading desk tools are still here too: a live odds console, an arbitrage detector that caught the gaps sharp bettors were picking off, and a trader schedule. Each was built alone, and together they saved traders hours a week.

`app/page.tsx:148`: "From sports trader on a Las Vegas trading floor to full-stack"

`app/layout.tsx:73`: "Software engineer. Trading desk tools, a marketplace Chrome extension, and an iOS app designed, built, and shipped alone."

### Resume (`public/Scott-Barclay-Resume.pdf`)

```
Developer Analyst (promoted from Trader) · William Hill / Caesars                                 2018–2022 · Las Vegas, NV
 • Set live in-game betting lines; taught myself to code on the trading floor and was promoted to build the tools the desk
   was missing.
 • Built a live odds display streaming roughly fifty competitor sportsbooks' prices to traders over Socket.io from a
   BigQuery pipeline, updating every five seconds with market movement coloring.
 • Built an arbitrage detector flagging exploitable price gaps against competitors before bettors could take them, and a
   scheduling system assigning traders to every offered game from BetRadar and BetGenius feeds.
 • Built customer and pricing models in SQL and BigQuery with Looker dashboards used daily by traders and analysts.
```

### Old site, shared copy (git `0949307^`)

`app/experience/page.tsx` metadata description: "Before founding Prava, I built internal tools and revenue systems in sports betting and ticketing. Every tool exists because my team and I needed it."

OG description: "Internal tools and revenue systems in sports betting and ticketing."

Page title: "Proprietary work, told in prose."

Lede: "Before founding Prava, I built internal tools and revenue systems in sports betting and ticketing. I came to engineering from the trading desk. Every tool below exists because my team and I needed it. Some of this work is proprietary; where a sanitized public repo exists, it's linked."

Section eyebrow: "Caesars (William Hill): Sports Trading"

Section opener: "I worked as a sports trader and taught myself to code by building the tools the desk was missing."

`app/about/page.tsx`: "I'm self-taught, and my route into engineering ran through a trading desk. At William Hill I priced sport for a living, got tired of the gap between what the desk needed and what it had, and started building the tools myself: an arbitrage calculator, a scheduling system, a live odds dashboard. Building for colleagues ten feet away is an unforgiving feedback loop, and it taught me to love it."

Old about metadata: "Self-taught engineer: trading desk at William Hill, then the tools the desk needed, then a year as the sole developer of Prava." OG: "Self-taught engineer, from the trading desk to solo founder of Prava."

`app/page.tsx` ledger row: `href: "/experience"`, `date: "2019–25"`, `name: "Caesars Sportsbook & Etainement"`, `status: "Internal tools"`.

The old Experience page had a fourth Caesars tool, the In-Play Odds Tracker. It is not one of the three, but its copy is listed under the Live odds console below, because the odds console linked to its repo.

### PORTFOLIO_DISCOVERY.md, shared mentions

- L25: "5. The strongest engineering proof is all one or two levels down. The home page does not name the odds console, the AI cost work, or the Chrome extension."
- L36: "| `/experience` | `app/experience/page.tsx` | Caesars trading tools (video plus three screenshots) and Etainement (prose only) |"
- L86: "- One page. Sections: header, Summary, Experience (Prava, Etainement, William Hill / Caesars), Skills, Education."
- L93: "- Summary: self-taught, came up through a sports trading desk, founder and sole developer of Prava "live on the App Store", strong in TypeScript and Python, "looking to bring solo-operator discipline to a team"."
- L96: "- Developer Analyst (promoted from Trader), William Hill / Caesars, 2018 to 2022, Las Vegas. Bullets: set live in-game lines; live odds display "streaming roughly fifty competitor sportsbooks' prices" over Socket.io from BigQuery every five seconds; arbitrage detector; scheduling system; SQL and BigQuery models with Looker dashboards."
- L144: "| "2019–25 · Caesars Sportsbook & Etainement" | Home ledger | Resume says William Hill / Caesars 2018 to 2022 and Etainement 2022 to 2026. Start year and end year both differ. | Scott |"
- L149: "| "I worked as a sports trader" | Experience | Resume title is "Developer Analyst (promoted from Trader)". The site undersells a real promotion into an engineering-adjacent role. | Scott |"
- L150: "| "Caesars (William Hill)" versus "At William Hill" versus "William Hill / Caesars" | Experience, About, resume | Three different namings of one employer. | Scott to choose one |"
- L216: "| Screenshots showing Caesars branding and real prices | Experience | The arbitrage and in-play images name Caesars and show real odds. These have been public on GitHub since 2022. Whether that is cleared is not knowable from the repo. | Scott |"
- L230: "… the three Caesars tool descriptions match what was published in 2022; …"
- L243: "- "2019–25 · Caesars Sportsbook & Etainement · Internal tools" compresses six or seven years of paid engineering, two employers, and the best systems work on the site into the least interesting row. "Internal tools" is the weakest possible label for a real-time odds console and a marketplace-rewriting browser extension."
- L292: "First five seconds: "Proprietary work, told in prose." That headline tells the reader to expect nothing they can see, which is both discouraging and no longer true, since the page opens onto a video of a live odds console."
- L294: "What lands once the reader scrolls: this is the most convincing page on the site. A 33-second video of a real trading tool updating live, a schedule screen, an arbitrage table with real books, concrete transport details (BigQuery, Socket.io, five-second and one-minute cycles). A senior engineer believes this page."
- L303: "- No scale anywhere: how many traders used the console, how many events a day, how much inventory the portal priced."
- L310: "Buried: this whole page. It is third in the ledger, labelled "Internal tools", third in the nav, under a title that undersells it. The odds console video is the only moving proof of engineering on the site and nobody sees it without two deliberate clicks."
- L314: "First five seconds: "From the trading desk to the App Store." Good line, clear arc."
- L344: "| Promotion from trader to developer analyst | Resume only | 2, plus a download | Not on the site. |"
- L458: "- The Caesars block on Experience is one `.section` containing four media bands and all the prose. At desktop container width it is roughly 3,300px tall, …"
- L460: "- Consequence when it happens: the entire Caesars section, which is the strongest evidence on the site, is invisible with no way to reveal it."
- L478: "4. No visible code. Prava is private. The four Caesars repos are READMEs. …"
- L486: "… how the Developer Analyst role interacted with the Caesars engineering organization. …"
- L488: "9. Dates on professional work. The Experience page has no years. A reader cannot tell the Caesars tools are from 2018 to 2022 or that Etainement ran to 2026 without downloading the resume."
- L508: "Lean: pick one set of facts and apply it everywhere: employer naming, the Caesars and Etainement years, …"
- L546: "Lean: split the combined row into Caesars and Etainement with a concrete label each (for example the live odds console and the marketplace extension), …"
- L613: "2. What are the true dates: Caesars start and end, Etainement start and end, …"
- L619: "8. Do you still have the Caesars tool source, and are you permitted to publish a sanitized version of any of it? Are the screenshots showing Caesars branding and prices cleared to stay public?"
- L624: "13. Is there anyone who worked with you at Caesars or Etainement whose words, or whose working relationship with you, could be described on the site?"

Line 2 of the discovery report says: "Read-only pass over `scott-barclay-v4`." It also says (L21): "The four GitHub repos linked from Experience as "sanitized public repos" each contain one README and no code. Last pushed in 2022."

### COPY_INVENTORY.md, shared mentions

- L17: "… Caesars Sportsbook (Live odds console, Arbitrage detector, Trading schedule)."
- L33 to L34: "3. **Caesars Sportsbook** (`EMPLOYERS[2]`), role then years: > Developer analyst, promoted from trader"
- L370: "- "Developer Analyst (promoted from Trader) · William Hill / Caesars" versus the site's "Caesars Sportsbook"."

### Design handoffs, shared copy

- "I priced sport for a living at a Las Vegas sportsbook. In the evenings I built a live odds console streamed over Socket.io from BigQuery, an arbitrage detector across about fifty books, and a schedule that assigned traders to games. The company moved me into an engineering role." Appears in 20 files: `design_handoff_index/home-{1024,1440,1440x620}`, `design_handoff_margin/home-{1024,1440}`, `design_handoff_phone/{home-390-a-grid2,home-390-a,home-390-b,home-430-a,home-430-b,landscape-844x390,storyboard}`, `design_handoff_vigil/design/round-2/vigil/home-{1024,1440,1920}` and `design_handoff_work/{a-ledger-1024,a-ledger-1440,a-ledger-390,b-folio-1440,b-folio-390}`.
- The 390 variant ("… I built a live odds console, an arbitrage detector across about fifty books, and a schedule that assigned traders to games. The company moved me into an engineering role.") appears in `design_handoff_margin/home-390` and `design_handoff_vigil/…/home-390`.
- "Software engineer. Trading desk tools for a Las Vegas sportsbook, a pricing portal and Chrome extension for a ticket brokerage, and an iOS app designed, built, and shipped alone." Appears in the margin and vigil home mockups.
- "Self-taught, starting from a trading desk." Appears in the margin and vigil home mockups.
- "The trading desk tools are still here too:" … "a live odds console" … "an arbitrage detector" appear in `design_handoff_featured_row/home-{390,844x390,1024,1440,1920}`.
- `design_handoff_index/storyboard.dc.html`: `{ name: 'Caesars Sportsbook', projects: ['Live odds console', 'Arbitrage detector', 'Trading schedule'] },`
- `design_handoff_work/README.md`: "- The hero at scroll zero with the name's centre on the midline; chapter padding 225; the 776 measure; T3 titles at 44; the Prava case-study link; "Write-up:" links on the three Caesars tools."
- `design_handoff_work/spec.dc.html`: "Unchanged: nearest centre, inside the 25svh band, 10% hysteresis, scroll-end settle. Only the candidate set changes: plates in III now number six (Prava, Prompt Lab, the extension diagram, the console, the arbitrage table, the schedule). Spec blocks and text-only entries are not candidates."
- `design_handoff_pages/spec.dc.html`: "lib/og-image.tsx as it is: … "II Work · 03 Caesars Sportsbook" (Arbitrage detector)."
- `design_handoff_phone/README.md`: "- The Caesars running head stays pinned while chapter III's top is on screen until the block's bottom passes the row, as on main at every width; worth a look at the end of the page on a phone."

---

## 1. Live odds console

### employers.ts (lines 1719 to 1730)

```ts
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
```

There is no `page` object, so the page comes entirely from `unwritten()` (see Shared). COPY_INVENTORY.md L278: "A Note with no `page` object; filled by `unwritten()` in `components/work/pages.ts`. The top row shows "2018 to 2022" and no kind or fact. The spec is Role (the employer's placeholder role line, "Developer analyst, promoted from trader"), Stack, and Write-up (Odds-Display-Public). The links row is "Walkthrough on request" and "Write-up: Odds-Display-Public"."

### The video

- File: `public/videos/odds-display-demo.mp4`. `VideoPlate.tsx:10` has `const SRC = "/videos/odds-display-demo.mp4";`
- Length: 33.133333 s, measured with `ffprobe`. Size is 856,046 bytes.
- PORTFOLIO_DISCOVERY.md L78 describes it as: "| `videos/odds-display-demo.mp4` | 2062 x 1080, 33 s, H.264, no audio | 856 KB | Experience |"
- Posters: `public/images/odds-console-poster.webp` and `odds-console-poster-1200.webp` (imported in `VideoPlate.tsx`). `odds-console-poster.jpg` also exists.
- Labels in `VideoPlate.tsx`:
  - L189: "Pause the odds console recording"
  - L190: "Play the odds console recording, 33 seconds, silent"
  - L251: "View the odds console recording full size"
  - L261: "The odds console recording"

### Write-up: github.com/sbrcly/Odds-Display-Public

- Repo description: "Public repository for Odds Display"
- Files: `README.md` only.
- Last commit: 2022-08-15T03:09:40Z.

README.md, verbatim:

```markdown
# Odds-Display-Public
Public repository for Odds Display

### This application pulls in sports betting odds from an assortment of different sportsbooks.

### Server Side:
#### Another tool I built (https://github.com/sbrcly/Odds-Tracker-Public) pulls in the data using API's. It then parses and stores that data into a Google BigQuery table.
#### This tool then pulls that data from the BigQuery table using SQL and sends the data to the client utilizing Socket.io.

### Client Side:
#### The client receives, processes and stores the data into a live updating table.
#### Sports traders use this data to determine where the market is for a particular bet.
#### This tool gives them a live view of where our betting odds are compared to some of the other big books in the market.
#### Traders can choose between the MoneyLine, Spread and total. They can also filter the table using the filters in the navbar, or by clicking on the stars to add games to their favorites, then clicking the "Favorites" tab.

### Here is a brief video of how it works:

#### Odds are updated automatically every 5 seconds.
#### Green: The odds have moved in favor of the bettor.
#### Red: The odds have moved against the bettor.


https://user-images.githubusercontent.com/93163082/184570620-46ff6ebe-c6bc-4cdf-a2be-6a80276b2c04.mp4
```

### The repo that README links to: github.com/sbrcly/Odds-Tracker-Public

- Repo description: "In-Game Odds Tracker"
- Files: `README.md` only.

README.md, verbatim:

```markdown
# In-Game Odds Tracker

Below is a screenshot of the final data visualization.

![odds_visual](https://user-images.githubusercontent.com/93163082/169906659-62fc3547-9e4f-42fa-a0fa-bde14ecf8abd.png)
```

### Old site copy (git `0949307^`, `app/experience/page.tsx`)

- Subheading: "Live Odds Display"
- Body: "A real-time market view for the trading desk. An ingestion service I built separately pulls competitor odds via APIs into Google BigQuery; the display streams that data to traders over Socket.io, updating every five seconds with movement coloring: green when a line moves toward the bettor, red when it moves away. Traders used it to see exactly where our lines sat against the market on moneyline, spread, and total."
- Repo links: `github.com/sbrcly/Odds-Display-Public · github.com/sbrcly/Odds-Tracker-Public`
- Caption: "Live market view: green toward the bettor, red against. Click to play."
- Video aria-label: "Demo video of the live odds display updating in real time"

The old In-Play Odds Tracker band (a separate tool, kept here for completeness):

- Subheading: "In-Play Odds Tracker"
- Body: "A Python tool charting in-play implied probability across the course of a game: our line against DraftKings, FanDuel, Pinnacle, and Unibet, update by update."
- Caption: "Implied probability, Brewers @ Cubs: our line vs. the market."
- Alt: "Chart of in-play implied probability for a Brewers at Cubs game, comparing Caesars' line against four competitors over two hours of updates."
- Image: `public/images/inplay-odds.png`. It is still in the repo but not referenced.

### PORTFOLIO_DISCOVERY.md

- L76: "| `images/inplay-odds.png` | 1336 x 590 | 124 KB | Experience |"
- L210: "| Odds display: "updating every five seconds", Socket.io, BigQuery, green and red coloring | Experience | Checked against the repo README: consistent. | Checked |"
- L212: "| Odds display "streaming roughly fifty competitor sportsbooks' prices" | Resume | The site and the README attach "fifty" to the arbitrage tool, and describe the odds display as comparing against "some of the other big books". The resume moves the number onto the other tool. | Scott |"
- L304: "- The In-Play Odds Tracker is described as "a Python tool" that makes a chart. It is the slightest of the four and dilutes the three stronger ones."
- L339: "| Caesars live odds console (video) | Experience, first band | 1, via a ledger row labelled "Internal tools" | No. Below the header and two paragraphs. |"

### Design handoffs

- Sentence, as in employers.ts, in 16 files (index, margin 1024/1440, phone, vigil and work mockups): "Competitor prices pulled into BigQuery and streamed to the trading desk over Socket.io every five seconds. Green when a line moves toward the bettor, red when it moves away. This is the console running live on the desk."
- A shorter sentence without the last line appears in `design_handoff_work/{a-ledger-390,b-folio-390}`: "Competitor prices pulled into BigQuery and streamed to the trading desk over Socket.io every five seconds. Green when a line moves toward the bettor, red when it moves away."
- Detail lines:
  - "sportsbook trading desk · 33 s recording" in the index and phone mockups.
  - "2022 · sportsbook trading desk · 33 s recording" in the vigil 1024/1440/1920 mockups.
  - "2022 · trading desk · 33 s recording" in the `design_handoff_work` a-ledger and b-folio mockups.
  - "2022 · trading desk · 33 s" in `design_handoff_margin/home-{1024,1440}`.
- Position labels:
  - "02 Live odds console" in `design_handoff_margin/spec`, `storyboards` and `vigil/README.md`.
  - `design_handoff_margin/storyboards.dc.html`: "“02 Live odds console”, mono 12, #A89F90. The margin only names what the light is on."
- `design_handoff_vigil/README.md`:
  - "**Placeholder** for copy (realistic length; Scott's words to come), verify links (`#`), the resume PDF, and the video poster (first frame of `public/videos/odds-display-demo.mp4`, which exists in the repo)."
  - "- 02 Live odds console (video): see states below."
  - "`<video poster muted playsinline preload="metadata">` wrapped in a button labeled "Play the odds console recording, 33 seconds, silent" (label becomes "Pause" while playing)."
  - "- Resting: poster at full brightness; 72px play ring …; mono meta bottom-left "odds-display-demo.mp4" bone, "· 33 s · silent" muted; rim resting."
  - "In repo but not in this bundle: `public/videos/odds-display-demo.mp4` (33 s, silent); export its first frame as the poster."
- `design_handoff_vigil/design/round-2/vigil/video-states.dc.html`:
  - "The poster is the first frame of odds-display-demo.mp4 (the file is on main but larger than this tool can import; the striped field stands in for it here and is labeled). …"
  - "Frame 0:12 of odds-display-demo.mp4"
  - "Accessibility: the plate is a button labeled "Play the odds console recording, 33 seconds, silent"; while playing the label changes to "Pause". Captions are not needed (no audio), stated in the label."
- `design_handoff_vigil/design/round-2/vigil/README.md`: "- Poster frame for the odds console (first second of `odds-display-demo.mp4`)."
- `design_handoff_margin/README.md`: "- Poster frame for the odds console."
- The margin and vigil mockups have the line "Poster: first frame of odds-display-demo.mp4".
- `design_handoff_index/spec.dc.html`: "Hero lines go to work-prava, work-marketplace-extension, work-live-odds-console (the employer's title lands, as on main)."
- `design_handoff_work/spec.dc.html`: `writeUp?: { repo: string }; // "Write-up: Odds-Display-Public"`

---

## 2. Arbitrage detector

### employers.ts (lines 1731 to 1763)

```ts
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
```

Image: `public/images/arbitrage-table.png`. COPY_INVENTORY.md L290: "A Note whose `page` in `employers.ts` overrides only `kind` ("Trading desk tool"), `fact` ("About fifty books"), and `spec` (Role "Built alone, evenings, while trading"; Stack; Write-up). The lede and paragraphs two and three still come from `unwritten()`."

### Source of "About fifty books"

The only primary source is the Arbitrage-Public README: "This tool uses a couple different API's to pull in Live betting data from Caesars Sportsbook, as well as approximately 50 other sportsbooks."

Secondary mentions:

- The old site called it "roughly fifty competitor sportsbooks" (body) and "~50 books" (caption).
- PORTFOLIO_DISCOVERY.md L211 checks the number against the README.
- The resume attaches the number to the odds display instead: "streaming roughly fifty competitor sportsbooks' prices". PORTFOLIO_DISCOVERY.md L212 flags this.

### Write-up: github.com/sbrcly/Arbitrage-Public

- Repo description: "Public repo for Arbitrage"
- Files: `README.md` only.
- Last commit: 2022-05-24T16:34:34Z.

README.md, verbatim:

```markdown
# This is an internal Sports Trading tool for Caesars Sportsbook.

## What is arbitrage betting?
Arbitrage betting (otherwise known as ‘arb betting’) is an increasingly popular sports betting strategy where the bettor covers all possible outcomes. Regardless of the outcome of a match, you can guarantee a profit.

If you get it right, it essentially means that your bet cannot lose. 

## How does the tool work?
This tool uses a couple different API's to pull in Live betting data from Caesars Sportsbook, as well as approximately 50 other sportsbooks.

It then compares our odds (Caesars) for every different bet that we offer and compares it against the equivalent market of the other sportsbooks.

If our odds compared against the odds of our competitor offer an arbitrage opportunity, that bet and the details around it will be shown in the table.

The table automatically updates every minute.

## How is the code structured?

### Server Side
I use Axios on the server side to pull in the data from the appropriate API's.

Socket.io will then emit that data to the client side of all open sockets. This is sent on a 1 minute interval.

### Client Side
The client side JavaScript will then update the table with the new data.



Below are a couple screenshots of the application. Thank you for your time!



![with_arbs3](https://user-images.githubusercontent.com/93163082/169880288-3cb09e61-2a11-4940-8607-8a3625321c0f.png)


![with_arbs](https://user-images.githubusercontent.com/93163082/169875822-77eef13f-27ed-45f2-af33-0599492534ea.png)


![checking](https://user-images.githubusercontent.com/93163082/169905553-b0518a34-114a-4ee4-8841-b170cebd7338.gif)
```

### Old site copy (git `0949307^`, `app/experience/page.tsx`)

- Subheading: "Arbitrage Calculator"
- Body: "Compared every market we offered against roughly fifty competitor sportsbooks, live. Server side pulls the books' odds via APIs and emits over Socket.io on a one-minute cycle; the client flags any price of ours that opens an arbitrage a bettor could lock in, so traders could correct the line before it was exploited."
- Repo link: `github.com/sbrcly/Arbitrage-Public`
- Caption: "Live arb detection across ~50 books."
- Alt: "The arbitrage calculator's live table, with flagged arbitrage opportunities against competitor sportsbooks."
- Old About page: "an arbitrage calculator" (see Shared).

### PORTFOLIO_DISCOVERY.md

- L77: "| `images/arbitrage-table.png` | 3840 x 1983 | 210 KB | Experience |"
- L211: "| Arbitrage: "roughly fifty competitor sportsbooks", "one-minute cycle" | Experience | Checked against the repo README: consistent. | Checked |"
- L340: "| Arbitrage detector across about fifty books | Experience, fourth band | 1 | No. Bottom of the first section. |"
- L212 and L216 are quoted above, under "Source of "About fifty books"" and in Shared.

### COPY_INVENTORY.md

- L288: "## Arbitrage detector (`/work/arbitrage-detector`)"
- L290 is quoted above.
- L376: "- Assets: "`arbitrage-table.png`, `trading-schedule.png`: work entries 03 and 04" (they are grid cells under Caesars now); …"

### Design handoffs

- Sentence, as in employers.ts, in 18 files (index, margin 1024/1440, phone, vigil and work mockups): "Every market the book offered, compared against about fifty competitors. Any price a bettor could lock in from both sides is flagged so a trader can move the line first."
- Margin and vigil 390 variant: "Every market compared against about fifty competitors on a one-minute cycle. Lockable prices are flagged so a trader can move the line first."
- Detail lines:
  - "2022 · about fifty books · one-minute cycle" in the vigil 1024/1440/1920 mockups and in `design_handoff_work` a-ledger-1024/1440 and b-folio-1440.
  - "2022 · about fifty books" in margin 1024/1440 and in work a-ledger-390 and b-folio-390.
  - "03 · 2022 · about fifty books" in the margin and vigil 390 mockups.
- `design_handoff_vigil/README.md`: "- 03 Arbitrage detector, 04 Trading schedule: image plates." It also lists the asset: "arbitrage-table (3840x1983)".
- `design_handoff_pages/README.md`: "- `arbitrage-1440.dc.html`, `arbitrage-390.dc.html`: Arbitrage detector, Note."
- `design_handoff_pages/spec.dc.html`: "Title block, three paragraphs in the measure, stack in the title block, "Walkthrough on request" and the way back as the links. Arbitrage detector. No plate, no sections: the margin has nothing to read and stays empty for the whole page; the icons stay. On the phone the bar holds only the nav. Still a page, so no link in Work is dead."
- Page mockup text, `design_handoff_pages/arbitrage-1440.dc.html`, in order with the nav removed. The 390 version has the same copy, but its top row omits "Trading desk tool" and "About fifty books".

  > II Work / 03 Caesars Sportsbook · 2018 to 2022 / Trading desk tool / About fifty books
  >
  > Arbitrage detector
  >
  > Every market the book offered, compared against about fifty competitors on a one-minute cycle. Any price a bettor could lock in from both sides is flagged so a trader can move the line first.
  >
  > Role: Built alone, evenings, while trading · Stack: Node · Socket.io · MySQL · GCP · Write-up: Arbitrage-Public
  >
  > Placeholder. The feed of competitor prices already existed for the odds console. The detector reads the same table once a minute, pairs each of the book's markets with the best opposing price anywhere else, and computes whether a bettor taking both sides would come out ahead. Anything above zero is a row.
  >
  > Placeholder. The hard part was not the arithmetic. It was matching markets across books that name teams, periods, and lines differently, and deciding how stale a competitor's price could be before a flag was noise. Both are settled by tables a trader can edit, not by code.
  >
  > Placeholder. The table ran on the desk beside the odds console. A flagged row is a line that is about to be hit; the trader moves it, and the row disappears on the next cycle. The write-up on GitHub describes the matching rules and the schema; the code itself was the book's.
  >
  > Walkthrough on request · Write-up: Arbitrage-Public · Back to Caesars Sportsbook in II Work

---

## 3. Trading schedule

### employers.ts (lines 1764 to 1777)

```ts
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
```

There is no `detail` and no `page` object. Image: `public/images/trading-schedule.png`. COPY_INVENTORY.md L302: "A Note with no `page` object; filled by `unwritten()`. Top row "2018 to 2022", no kind or fact; spec Role (the employer's placeholder role line), Stack, Write-up (Trading-Schedule-Public); links "Walkthrough on request" and "Write-up: Trading-Schedule-Public"."

### Write-up: github.com/sbrcly/Trading-Schedule-Public

- Repo description: "Public repo for Trading Schedule"
- Files: `README.md` only.
- Last commit: 2022-05-23T17:14:26Z.

README.md, verbatim:

```markdown
# Trading-Schedule-Public

This is an internal tool that I built for Caesars Sportsbook.

This is a scheduling tool. It pulls in all of the different games that we offer for a variety of sports and assigns traders to those games. Traders can view their own schedule, filter by date, keyword, or league.

When a trader goes to their page, stats are given on the bottom and they can access their "trader dashboard" (still in development).

There are a number of other features to this application. Below, you'll find multiple screenshots and video walk-throughs of everything the application can do.

Enjoy!


## Home Screen




![home_screen](https://user-images.githubusercontent.com/93163082/169713029-5ebd3564-bc1a-432f-801f-53b1d80c54ee.png)

### Where does the match data come from?
The data is being pulled in using API's from BetRadar and BetGenius. I'm using axios on the server side to make these requests, and sending that data to the client side.
I am then parsing that data and appending it to the table you see.

### How are traders assigned?
Traders are assigned based on their schedules and the Leagues they have been assigned.

### How do traders view their personal schedule?

![choose_trader](https://user-images.githubusercontent.com/93163082/169714710-533996f0-4629-4f38-99fe-67a4f22c06d8.gif)




## Features



### 1. Edit Traders Assigned to games

![change_trader](https://user-images.githubusercontent.com/93163082/169714868-bde8eb2c-b5ec-4a50-8e95-9505e8759316.gif)

### 2. Filter by Date

![date_filter](https://user-images.githubusercontent.com/93163082/169715010-25687427-7922-45be-abeb-b6cc405ae947.gif)

### 3. Search by Keyword

![search_filter](https://user-images.githubusercontent.com/93163082/169715362-83b72097-2642-4dd6-abf1-e0b8e6e4ebd0.gif)

### 4. Refresh table

![refresh_table](https://user-images.githubusercontent.com/93163082/169715428-2c5745ac-16a9-48ee-abaa-98d5f3c8b62c.gif)

### 5. League Filters (these filters won't be affected by the "Refresh" button)

  Step 1: Click arrow in upper right corner of screen
  
![leagues1](https://user-images.githubusercontent.com/93163082/169716133-efa9516b-447e-4636-ace8-cf9dff88c5c6.png)

  Step 2: On left top of screen, Choose Sport > Country > League

![leagues2](https://user-images.githubusercontent.com/93163082/169716256-f2df8c17-3b22-4cb0-bc1d-10b189283a6e.png)

![leagues3](https://user-images.githubusercontent.com/93163082/169716261-63ed2bb2-42ed-4cc0-8e37-8258f26f5870.png)

![leagues4](https://user-images.githubusercontent.com/93163082/169716268-a62b3fbe-8cf2-4683-80e3-dbdde128bb21.png)

  Step 3: Click "Filter" button on right side of screen
  
![leagues5](https://user-images.githubusercontent.com/93163082/169716276-f0702923-da90-4f89-a8ce-48591f0a20ac.png)

![leagues6](https://user-images.githubusercontent.com/93163082/169716278-93335281-8249-48c0-98a5-0cc6a3101987.png)

### 6. Game Details on click + hover

![game_details](https://user-images.githubusercontent.com/93163082/169716428-7db711e3-b9f1-4b20-8abd-5cbfed5c30ff.gif)

### 7. Duplicates Button (filters table to show only the games that are listed twice, once by each feed provider)

![duplicates](https://user-images.githubusercontent.com/93163082/169871690-e51d0ae5-ccc4-4695-b69f-9fc13e962cc7.gif)

### 8. Notifications (a notification will be shown for any game without a trader attached to it. When a trader is attached, the notification will go away)

![notifications](https://user-images.githubusercontent.com/93163082/169872424-f0944c36-a3af-402b-9571-181ddbc90b07.gif)

### 9. Trader Stats and Dashboard (still in development)

![trader_stats](https://user-images.githubusercontent.com/93163082/169872908-6dd6f140-758a-41b2-86aa-b0cbbae05263.gif)
```

### Old site copy (git `0949307^`, `app/experience/page.tsx`)

- Subheading: "Trading Schedule"
- Body: "A scheduling system that pulls every game we offered across sports from BetRadar and BetGenius feeds and assigns traders to them based on their schedules and league coverage. Traders filter by date, keyword, or league; games without an assigned trader are flagged until someone owns them."
- Repo link: `github.com/sbrcly/Trading-Schedule-Public`
- Caption: "Every game we offered, with an owner."
- Alt: "The trading schedule home screen: a table of upcoming games across sports with assigned traders."
- Old About page: "a scheduling system" (see Shared).

### PORTFOLIO_DISCOVERY.md

- L75: "| `images/trading-schedule.png` | 2551 x 1366 | 268 KB | Experience |"
- L213: "| Trading schedule: BetRadar and BetGenius feeds, assignment by schedule and league | Experience | Checked against the repo README: consistent. | Checked |"
- L294 ("a schedule screen") is quoted in Shared.

### COPY_INVENTORY.md

- L300: "## Trading schedule (`/work/trading-schedule`)"
- L302 is quoted above. L376 is quoted under Arbitrage detector.

### Design handoffs

- Sentence, as in employers.ts, in 18 files (index, margin 1024/1440, phone, vigil 1024/1440/1920, and work a-ledger and b-folio): "Pulls every game from the data feeds and assigns traders by shift and league coverage. A game nobody owns stays flagged until someone takes it."
- Margin and vigil 390 variant: "Every game offered, assigned to a trader by shift and league. Unowned games stay flagged."
- Detail lines:
  - "2022 · every game offered, with an owner" in the vigil 1024/1440/1920 mockups and in work a-ledger-1024/1440 and b-folio-1440.
  - "2022 · every game, with an owner" in margin 1024/1440 and in work a-ledger-390 and b-folio-390.
- Position labels:
  - "04 Trading schedule" in `design_handoff_margin/position-options` and in the margin and vigil home mockups.
  - "03.3 Trading schedule" in `design_handoff_work` a-ledger mockups.
- `design_handoff_vigil/README.md` lists the asset: "trading-schedule (2551x1366)".
- `design_handoff_work/storyboard.dc.html`: "Entering from below. Scrolling up out of IV, line two arrives with 03 Caesars Sportsbook as the III opener's turn completes (the header's top is above the midline from the moment III is current), and line three lights the trading schedule when its plate settles. Nothing is shown in IV: leaving III empties both lines on the 400 out."
- Current site link text (`app/page.tsx`): "a trader schedule".
