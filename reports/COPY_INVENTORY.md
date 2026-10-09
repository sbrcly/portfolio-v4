# Copy inventory

Read-only pass on 9 October 2026. The checkout started on `main` at 46be0f9 (clean) and, while this pass ran, was switched by another session to branch `hide-pending` with one uncommitted change to `components/work/employers.ts`: a `Shown.hidden` flag, set on Ask the reading, that drops it from Work, the Work index, the featured row, the sitemap, and the page routes (its page is then not found). The copy itself is identical in both states; where the two differ in what renders, the entry says so. Nothing was changed by this pass; this file is the only one written.

What was walked: `components/work/employers.ts`, `components/work/pages.ts`, `app/page.tsx`, the project page route and template (`app/work/[slug]/`, `components/project-page/ProjectPage.tsx`), every component that renders text (`components/work/*`, `frame`, `footer`, `margin`, `social`, `lightbox`, `chapter-opener`), `app/layout.tsx`, the share-card generators (`app/opengraph-image.tsx`, `app/work/[slug]/opengraph-image.tsx`, `app/og/buyer-extension.png/route.tsx`, `lib/*`), `app/not-found.tsx`, `app/sitemap.ts`, `app/robots.ts`, the text inside every drawing in `public/diagrams/*.svg`, `README.md`, and the text of `public/resume.pdf`.

A string is listed if it begins with "Placeholder", is flagged by a `placeholder` field or a `// Placeholder` comment in the source, is a labelled empty slot, or reads as unwritten. No "TODO", "TBD", "lorem", "20XX", empty sentence, or sample statistic was found anywhere in the source; every placeholder on the site is the word "Placeholder" or a flag.

How the placeholders reach the page:

- A **Note** page (depth `note`) with no written copy is filled by `unwritten()` in `pages.ts`: a placeholder lede, the project's Work sentence as paragraph one, and two placeholder paragraphs. Four projects are Notes; all four still carry those paragraphs.
- `Shown.placeholder: true` on a project in `employers.ts` is a mark only; nothing renders it. Three Etainement projects carry it with sentences that begin "Placeholder."
- `Stack.placeholder: true` renders a leading "Placeholder." token, but only through `WorkEntry` (the hero). The one project that sets it is a grid cell, so the token never renders.
- `pending: true` on a grid cell renders the slot label "Screenshot pending" in place of a plate.
- A project page's meta description and share-card description are `page.lede` where the page has one, else the Work sentence (`pages.ts`, `resolve`). So Buyer extension's placeholder lede is also its meta description; the Notes' placeholder ledes are not.

Site order for Work: Faith Platforms Inc. (Prava, Ask the reading, Prompt Lab, Analytics dashboard, Lectionary authoring tool, Commitment library), Etainement (Buyer extension, Pricing portal, On-sale monitor), Caesars Sportsbook (Live odds console, Arbitrage detector, Trading schedule).

---

## Home (`/`)

### Chapter II Work, employer headers (and the pinned running head that repeats each)

`components/work/employers.ts`, `EMPLOYERS[n].role` and `.years`. Each of the three is preceded in the source by the comment `// Placeholder role line and years.` They render as the tenure line under each company's title, and again in the running head.

1. **Faith Platforms Inc.** (`EMPLOYERS[0]`), role then years:
   > Sole engineer
   > 2025 to now
2. **Etainement** (`EMPLOYERS[1]`), role then years:
   > Full-stack engineer
   > 2022 to 2026
3. **Caesars Sportsbook** (`EMPLOYERS[2]`), role then years:
   > Developer analyst, promoted from trader
   > 2018 to 2022

The same role string is the "Role" spec row on every Note page of that employer (via `unwritten()`), and the years string is the top row's years on every page without its own (`resolve()`).

### Chapter II Work, Faith Platforms grid, "Ask the reading" cell

On `main` the cell renders as below. On `hide-pending` (uncommitted) `hidden: true` removes the cell, its Work index line, its sitemap entry, its share card, and its page; the strings stay in the source.

- `components/work/WorkCell.tsx`, slot label (`styles.slotLabel`), rendered because `employers.ts` sets `pending: true` on `ask-the-reading`. The cell's plate area reads:
  > Screenshot pending
- `components/work/employers.ts`, `ask-the-reading.stack.placeholder: true`. The flag would prepend the token "Placeholder." (`components/work/StackTokens.tsx`) to the stack row, but `WorkCell` does not pass the flag, so the cell shows the four tokens with nothing marked. The stack is still a guess by the source's own comment ("A placeholder is a guess to correct").
- The cell's name links to `/work/ask-the-reading`, an unwritten Note (see below). The same name sits in the running margin's Work index (`components/margin/WorkIndex.tsx`) from 960px up.

### Chapter II Work, Etainement hero, "Buyer extension"

- `components/work/employers.ts`, `buyer-extension.sentence` (flagged `placeholder: true`). Rendered under the hero's loop plate:
  > Placeholder. A Chrome extension that ran inside Ticketmaster for over a hundred buyers at one of the larger US brokers: it painted the manager's rules onto the venue map, recorded the purchase as it happened, and brought a verification code to the screen it was needed on. Sole engineer, five systems, one rule.

### Chapter II Work, Etainement grid, "Pricing portal" cell

- `components/work/employers.ts`, `pricing-portal.sentence` (flagged `placeholder: true`):
  > Placeholder. Where analysts price inventory against the market and on-sale managers draw the rules. A team system; my parts are named on its page.

### Chapter II Work, Etainement grid, "On-sale monitor" cell

- `components/work/employers.ts`, `on-sale-monitor.sentence` (flagged `placeholder: true`):
  > Placeholder. The extension's telemetry as live tables, with the waiting room rebuilt per buyer and per event. Built alone.

### Chapter I About, featured row

Nothing placeholder. The row shows Buyer extension alone, using `featuredSentence` (which is not placeholder). "Ask the reading" is `featuredHidden`, so its featured plate and label do not render.

### Hero loop drawing (chapter II, Etainement hero plate)

- `public/diagrams/buyer-extension.svg`, the note box's second line. Inlined by `components/work/ExtensionLoop.tsx` on the home hero and on the Buyer extension page's title plate:
  > Message · placeholder manager note

---

## Prava (`/work/prava`)

No placeholder strings. See the final list for counts that may drift.

## Ask the reading (`/work/ask-the-reading`)

Rendered on `main`; a 404 on `hide-pending` (uncommitted), where the project is `hidden`. A Note with no `page` object at all: every field comes from `unwritten()` in `components/work/pages.ts`. The top row shows the employer's years ("2025 to now") and no kind or fact.

- `pages.ts`, `unwritten().lede`, the lede under the name:
  > Placeholder. One sentence on what it is and who it was for.
- `pages.ts`, `unwritten().paragraphs[0]` (from `employers.ts`, `ask-the-reading.sentence`), paragraph one. Not placeholder, but it is the only written line on the page:
  > A question asked after the day's reading, answered only from the passage retrieved for it, with the citation shown.
- `pages.ts`, `unwritten().paragraphs[1]`, paragraph two:
  > Placeholder. What was hard about it: the one problem that took the most iteration, and how it was settled. Three or four sentences, in the first person, with the detail an engineer would ask about.
- `pages.ts`, `unwritten().paragraphs[2]`, paragraph three:
  > Placeholder. How it was used and what came of it: who ran it and when, what it changed for them, and where the work can be checked or walked through.
- `pages.ts`, `unwritten().spec`, the "Stack" row: the same guessed stack as the cell (`TypeScript`, `Next.js`, `Postgres`, `Anthropic API`); `ProjectPage.tsx` does not pass the placeholder flag, so no token marks it.
- `pages.ts`, `unwritten().spec`, the "Code" row and `links.note`, for a project the source says is "not built yet":
  > Walkthrough on request

## Prompt Lab (`/work/prompt-lab`)

No placeholder strings.

## Analytics dashboard (`/work/analytics-dashboard`)

No placeholder strings.

## Lectionary authoring tool (`/work/lectionary-authoring-tool`)

No placeholder strings.

## Commitment library (`/work/commitment-library`)

No placeholder strings.

## Buyer extension (`/work/buyer-extension`)

`components/work/employers.ts`, `BUYER_EXTENSION_PAGE`. Every running paragraph and every numbered item on the page begins "Placeholder." The statements, facts, figure labels, and captions do not.

### Title block

- `lede`. Also the page's `<meta name="description">` and share-card description (`pages.ts` `resolve`, `app/work/[slug]/page.tsx` `generateMetadata`):
  > Placeholder. A Chrome extension that runs inside Ticketmaster during an on-sale: it paints a manager's buy rules onto the venue map a buyer is already looking at, records the purchase as it happens, and brings a verification code to the screen it is needed on.

### Title plate (the loop) and the share image

- `public/diagrams/buyer-extension.svg` (the loop, `ExtensionLoop.tsx`) and `public/diagrams/buyer-extension-still.svg` (the still under reduced motion and below 960px, and the share image at `/og/buyer-extension.png`), the note box's second line:
  > Message · placeholder manager note

### 01 The problem, paragraphs

- paragraph i:
  > Placeholder. During an on-sale a buyer has a venue map on screen and a few minutes to act. The rules for what to buy live in another tool, on another origin, written by a manager who is watching twenty buyers at once. Reading them from a second window costs the seconds the sale is decided in.
- paragraph ii:
  > Placeholder. The page is not built to be read by anyone but the marketplace: seat elements carry no usable ID, the map renders late and re-renders on zoom, the markup changes under you, and the response bodies that would settle every question are off limits to an extension under Manifest V3.
- paragraph iii:
  > Placeholder. The job was to put the rule where the buyer is looking, keep a record of what happened without asking anyone to type it, and get a verification code onto that screen when the page asks for one, all without owning the page, a login, or a store listing.

### 02 The system, paragraphs

- paragraph i:
  > Placeholder. The pricing portal is where managers wrote the buy rules, a maximum number of tickets per event, and limits per account. The extension is the only part that touches everything else: inside Ticketmaster it painted the rules on the map, recorded the purchase journey, and surfaced verification codes; inside the approval desk it highlighted the carted tickets that matched a rule, showed how close an event was to its maximum, and added a bonus button that posted to Slack.
- paragraph ii:
  > Placeholder. Behind the code relay sat an Express service and a Python mail hook. Between them they got a verification code from an inbox or from a bank of phone lines behind an SMS gateway to the buyer's screen and clipboard. None of the five could see the others directly; everything that passed between them is on one edge of the map below.

### 03 The rule's path, paragraphs

- paragraph i (above the two drawings):
  > Placeholder. A rule crosses five JavaScript worlds between the portal and the paint: the portal page where the session lives, the extension's worker, the marketplace's isolated world where the content script runs, the marketplace's own page world where the seats can be read, and the identity iframe on a third origin. None of them can see the others directly.
- paragraph ii (below the drawings):
  > Placeholder. The poll runs every 15 seconds while the tab is visible and stops when it is hidden. A pass that finds nothing changed stops before the paint. Panning or zooming repaints from the last rules, one second after movement stops, with no network call. If no portal tab is open the fetch fails and the badge turns red; the buyer knows before the sale does.

### 04 The code relay, paragraphs

- paragraph i:
  > Placeholder. When the page asks for a verification code, the content script asks the worker, the worker asks an Express service, and the HTTP response is held open until the code exists. The service checks first: a code for that line from the last fifteen minutes is returned without opening anything. Otherwise, for a phone line, it opens that line's port on the SMS gateway and polls the store every ten seconds for up to ninety; when the text lands, the gateway's webhook writes the code to Firestore, keyed by line. For an inbox, a Python mail hook runs once per email, parses it with every field in its own try block, and upserts the latest code per address into Postgres.
- paragraph ii:
  > Placeholder. Either way the held response returns the code and the port is released, on a code and on a timeout alike. The worker hands it to the page and puts it on the clipboard, so the buyer sees it where they are and can paste it. Nothing on this path reads a password or touches the account itself; the relay moves one six-digit string from where it landed to where it was needed.
- paragraph iii (between the two drawings):
  > Placeholder. The gateway holds hundreds of ports, grouped under gateway IDs, and a group can have only one port open at a time; a text only arrives on an open port. So the service is also a scheduler: a port-state map, a queue per group, and a record of which line each group is serving. A request whose group is busy waits in the queue with its response still open; when the current port closes, the next request opens the next port. The list of lines is refreshed from the gateway once a day. The drawing below is what the service is doing while the buyer waits.

### 05 The approval desk, paragraphs

- paragraph i:
  > Placeholder. Managers approved purchases in a third-party tool: a table of carted tickets, one row per cart, re-rendered constantly. The extension runs there too. It groups the rows by event, fetches each event's rules once, and shades every row whose seats match a rule, so a manager scanning two hundred rows sees the ones the plan asked for.
- paragraph ii:
  > Placeholder. Each event's maximum from the portal becomes a gauge: how many tickets are carted or approved against it, and a full gauge turns lit. One button is added to each matching row. A click posts the event, the seats, and the buyer to a Slack channel, which is how a bonus was recorded; the button's state is kept in extension storage so every open tab agrees.

### 06 The telemetry, paragraphs

- paragraph i:
  > Placeholder. The event page loading, the waiting room position, the sign-in, the cart, a failed cart, a checkout error, the confirmation: each is noticed on the page, stamped with the browser's clock, and sent through the worker to two places. The warehouse keeps it for good. Firestore keeps it for the next hour, which is where the on-sale monitor reads it.
- paragraph ii:
  > Placeholder. The ingestion endpoint stamps a second time on arrival, and the monitor orders rows by that one. The gap between the two clocks can be measured from stored data; the gap from document to screen cannot, so no latency figure is quoted anywhere on this site.

### 07 Hard parts, items (titles are written; every body begins "Placeholder.")

- item i, "Matching rules to seats on a map you do not own":
  > Placeholder. Three approaches over time: seat numbers, then grid coordinates, then the site's own seat IDs read from the React internals on each element, which is only possible from the page's world. The earlier logic stayed as the fallback.
- item ii, "Reading the page's own network responses":
  > Placeholder. Manifest V3 cannot read response bodies, so a page-world script wraps fetch and XMLHttpRequest and copies one response. The race: the page could make the call before the extension was ready. The fix moved the interceptor to a manifest-declared script at document start and added a buffer drained once the service starts.
- item iii, "Timing on a late-rendering single-page app":
  > Placeholder. Content scripts start before the body exists; the map arrives seconds later and re-renders on zoom. Observers wait for one specific element and fire once, a debounce absorbs the zoom, a re-entrancy guard keeps two passes from overlapping, and everything pauses while the tab is hidden.
- item iv, "The cross-origin identity iframe":
  > Placeholder. Verification happens in a frame the parent cannot read. A content script inside it reports to the parent by window message with explicit target origins, and the parent checks the sender. Detection is redundant on purpose: an observer, a periodic check, and a short burst after submit.
- item v, "Auth without a login":
  > Placeholder. The extension has no sign-in. It reads the portal's token from an open portal tab, treats it as good for a fixed window, and reloads the tab when it is stale so the portal's own app refreshes it. The backend accepts one pinned extension ID.
- item vi, "Markup that changes under you":
  > Placeholder. Sixty of the site's test hooks are targeted, each written three ways because the site has spelled the attribute three ways over time. Parsers prefer the page's embedded data and fall back to the DOM; order confirmation has three layers, the last of them a human.
- item vii, "The two-tier cache on the approval desk":
  > Placeholder. The desk re-renders its table constantly. The first version refetched rules per row. The current one scopes the observer, debounces, groups rows by event, shares one in-flight request per event, and caches in memory and then in extension storage.
- item viii, "Recording a purchase nobody typed in":
  > Placeholder. A cart, a failed cart, a checkout error, and a confirmation each look different on the page and none of them announces itself. Each is read from the page's embedded data first and the DOM second, keyed to the browser tab so one buyer's three tabs stay three purchases, and sent with a reference the buyer sees in a toast. The popup is the third layer: the captured cart, pre-filled, for a human to correct.
- item ix, "The port scheduler":
  > Placeholder. Hundreds of ports, grouped under gateway IDs, and only one port open per group at a time, so two requests in a group must never fight over it. The discipline: check the store before opening anything, hold the caller's response open while it waits in the group's queue, bound the poll at ninety seconds, and release the port on every exit path, failure included, so one bad line can never hold a group. A status route showed the map and the queues live during a sale.

### 08 What I would do differently, paragraphs

- paragraph i:
  > Placeholder. A guard for the day the site's internals change shape: today a break paints zero seats and the only signal is a note that reads zero. Then tests, of which there are none, in a codebase with twenty-one observers across eleven files. Then one shared rules cache on the marketplace side instead of one poll per tab.
- paragraph ii:
  > Placeholder. Last, the port scheduler's state. The codes themselves moved to Firestore so a restart mid-sale would not lose them; the port map and the queues stayed in process memory, so a restart starts them empty with buyers still waiting on held responses. It never bit during a sale. It would have.

### 09 Outcome, paragraphs

- paragraph i:
  > Placeholder. The extension went from a three-hundred-line prototype to the part of the on-sale every buyer had open, and the only part that touched the portal, the marketplace, the approval desk, and the code relay at once. It was handed off before I left with the service, the hook, and the scheduler documented and running.
- paragraph ii:
  > Placeholder. The numbers behind that, purchases tracked, events covered, codes relayed, stay off the internet on purpose and are available in an interview.

## Pricing portal (`/work/pricing-portal`)

`components/work/employers.ts`, `PRICING_PORTAL_PAGE`. The lede, spec, plate, statements, facts, drawings, and captions are written. Every running paragraph and every numbered item body begins "Placeholder."

### 01 The problem, paragraphs

- paragraph i:
  > Placeholder. Analysts work through events where the company holds tickets, see their own listings beside the current market, and change prices by hand or by rule. On-sale managers plan what to buy and draw, on a venue map, the seats the business wants. That drawing is what the buyer extension paints.
- paragraph ii:
  > Placeholder. The portal has no data of its own. Everything comes from, and is written to, a backend that reads three point-of-sale systems live, keeps its record in a warehouse, and caches what it can.
- paragraph iii:
  > Placeholder. Eight people built it over two years. What follows is the part of it that is mine.

### 02 What was built, paragraph

- paragraph i (above the five facts):
  > Placeholder. Second of about eight contributors by commits, with the clearest ownership in the rule-authoring panel the extension consumes, the first generation of the analysts' worklist, and the platform work on the backend.

### 03 The rule lifecycle, paragraphs

- paragraph i:
  > Placeholder. A manager needs to say "these sections, these rows, up to this price" in seconds, during an on-sale. Control-click picks a seat and starts a rule for its section. Control-drag draws a line, not a box: the seats within a band around it are collected by a point-in-polygon test. Every rule can also be typed.
- paragraph ii:
  > Placeholder. On submit the browser walks every seat in the venue and resolves each active rule to concrete IDs, applying the three filters. The saved record carries both the readable criteria and the resolved list, which is why the extension never has to filter.

### 04 The screens, paragraphs

- paragraph i:
  > Placeholder. One event in four resizable panels. Clicking a section on the map filters the market table; with Control it filters own listings too; hovering a row lights its section. Section and row filters accept single values, lists, and ranges, with a fallback when names differ between sources.
- paragraph ii:
  > Placeholder. Edits are staged, not sent, and saved in one bulk request. A price far enough under the market's lowest comparable opens a blocking popup first, where the price can be corrected before confirming. It is the one action here that costs money immediately if it is wrong.

### 05 The hard parts, items

- item i, "The manual price update and its audit trail":
  > Placeholder. The backend looks up which point of sale owns the event and pushes the change. Only if the whole push succeeds does it append an audit row per listing: who, when, old price, new price. The partial-failure branch is the honest part of the drawing.
- item ii, "The rules service and the stop alert":
  > Placeholder. A save sanitises the record, posts an alert if the stop switch is set, appends a row, writes per-seat notifications, and warms the cache. The portal reads through a freshness check; the extension reads the latest-row view directly.
- item iii, "Cost attribution by service account and page":
  > Placeholder. Four warehouse clients, one per product area, and a metadata comment on every query naming the tool and page, so warehouse cost can be read per page from the job log. The most transferable technique in the repo.
- item iv, "The telemetry write buffer":
  > Placeholder. Login telemetry batched into the warehouse every ten seconds or a hundred records, with retry and a flush on shutdown, so a stream of single-row writes never reaches a store built for the opposite.

### 06 What I would do differently, paragraphs

- paragraph i:
  > Placeholder. The role model is real and well normalised and is enforced only in the browser. The price guard, likewise. Two managers editing one event overwrite each other, last write wins. And five table libraries where one would do.
- paragraph ii:
  > Placeholder. What stood in for tests was a staging environment and, from 2025, Sentry with replay and source maps, which I wired. The first thing it found is a story for an interview.

## On-sale monitor (`/work/on-sale-monitor`)

`components/work/employers.ts`, `ON_SALE_MONITOR_PAGE`. The lede, plate, statements, drawings, and captions are written. Every running paragraph begins "Placeholder."

- `spec`, the "Role" row. Not marked, but it is the one Role value on the site written in the third person with a full stop, and reads as a stand-in:
  > Built by Scott.

### 01 What it does, paragraphs

- paragraph i:
  > Placeholder. The extension records each step of a purchase: event page load, sign-in, waiting-room position, cart attempt, checkout error, order confirmation. A copy of every record lands as a document in Firestore. The monitor signs a viewer in, listens to one collection at a time, and renders the newest records as rows, one tab per record type.
- paragraph ii:
  > Placeholder. Nothing is polled and nothing is written back. A row appears when its document does. A keyword filter and a pause button are the only controls.

### 02 What was hard, paragraphs

- paragraph i:
  > Placeholder. The waiting room produces a stream of position records per browser tab. The monitor has to turn that into "who is in which queue right now, and how well placed are they". Group by buyer, account, and event and keep the newest; count the groups seen in the last three minutes as active; track count, lowest, highest, and average over thirty; and the lowest users-ahead within the hour, because on-sales start on the hour.
- paragraph ii:
  > Placeholder. This took the most iteration of anything in the project, and was pulled out into pure functions in the 2026 rewrite. Its honest limit: the key leaves out the tab, so one buyer with two tabs on one account collapses into one queue.

## Live odds console (`/work/live-odds-console`)

A Note with no `page` object; filled by `unwritten()` in `components/work/pages.ts`. The top row shows "2018 to 2022" and no kind or fact. The spec is Role (the employer's placeholder role line, "Developer analyst, promoted from trader"), Stack, and Write-up (Odds-Display-Public). The links row is "Walkthrough on request" and "Write-up: Odds-Display-Public".

- `pages.ts`, `unwritten().lede`:
  > Placeholder. One sentence on what it is and who it was for.
- paragraph one is the Work sentence (written).
- `pages.ts`, `unwritten().paragraphs[1]`, paragraph two:
  > Placeholder. What was hard about it: the one problem that took the most iteration, and how it was settled. Three or four sentences, in the first person, with the detail an engineer would ask about.
- `pages.ts`, `unwritten().paragraphs[2]`, paragraph three:
  > Placeholder. How it was used and what came of it: who ran it and when, what it changed for them, and where the work can be checked or walked through.

## Arbitrage detector (`/work/arbitrage-detector`)

A Note whose `page` in `employers.ts` overrides only `kind` ("Trading desk tool"), `fact` ("About fifty books"), and `spec` (Role "Built alone, evenings, while trading"; Stack; Write-up). The lede and paragraphs two and three still come from `unwritten()`.

- `pages.ts`, `unwritten().lede`:
  > Placeholder. One sentence on what it is and who it was for.
- paragraph one is the Work sentence (written).
- `pages.ts`, `unwritten().paragraphs[1]`, paragraph two:
  > Placeholder. What was hard about it: the one problem that took the most iteration, and how it was settled. Three or four sentences, in the first person, with the detail an engineer would ask about.
- `pages.ts`, `unwritten().paragraphs[2]`, paragraph three:
  > Placeholder. How it was used and what came of it: who ran it and when, what it changed for them, and where the work can be checked or walked through.

## Trading schedule (`/work/trading-schedule`)

A Note with no `page` object; filled by `unwritten()`. Top row "2018 to 2022", no kind or fact; spec Role (the employer's placeholder role line), Stack, Write-up (Trading-Schedule-Public); links "Walkthrough on request" and "Write-up: Trading-Schedule-Public".

- `pages.ts`, `unwritten().lede`:
  > Placeholder. One sentence on what it is and who it was for.
- paragraph one is the Work sentence (written).
- `pages.ts`, `unwritten().paragraphs[1]`, paragraph two:
  > Placeholder. What was hard about it: the one problem that took the most iteration, and how it was settled. Three or four sentences, in the first person, with the detail an engineer would ask about.
- `pages.ts`, `unwritten().paragraphs[2]`, paragraph three:
  > Placeholder. How it was used and what came of it: who ran it and when, what it changed for them, and where the work can be checked or walked through.

---

## Everything else

### Metadata and share cards

- `app/work/[slug]/page.tsx`, `generateMetadata`, description for `/work/buyer-extension`: the placeholder lede quoted above ("Placeholder. A Chrome extension that runs inside Ticketmaster…"). It is the only placeholder that reaches a `<meta>` tag or an Open Graph description; the Notes' descriptions fall back to their Work sentences.
- `app/og/buyer-extension.png/route.tsx` renders `public/diagrams/buyer-extension-still.svg`, so the share image for `/work/buyer-extension` carries the text "Message · placeholder manager note".
- `app/layout.tsx` (site title, template, description), `app/opengraph-image.tsx` ("Scott Barclay" / "Software engineer"), `app/work/[slug]/opengraph-image.tsx` (alt "The project's name over its employer in II Work"), `lib/open-graph.ts`: nothing placeholder.

### Chrome, 404, footer, nav, icons

`components/frame/*`, `components/footer/Footer.tsx`, `components/social/SocialIcons.tsx`, `components/margin/*`, `components/lightbox/*`, `components/work/VideoPlate.tsx`, `components/work/Rating.tsx`, `app/not-found.tsx`: nothing placeholder.

### Drawings (`public/diagrams/*.svg`)

Every drawing's text was read. The only placeholder text is the line above in `buyer-extension.svg` and `buyer-extension-still.svg`. All other invented data is labelled as synthetic in the drawing or its caption.

### README and resume

`README.md` and `public/resume.pdf` contain no placeholder strings. Both have stale references; see the list below.

---

## Not placeholder, but references something unfinished or a count that may be stale

**Links to pending or unwritten pages**

- `employers.ts` `ask-the-reading`: the source comment says "not built yet". On `main`, its cell in Work, its line in the Work index, `app/sitemap.ts` (which lists every page in `PAGES`), and `app/work/[slug]/opengraph-image.tsx` (which makes it a share card) all point at `/work/ask-the-reading`, whose body is the unwritten Note above, and its "Code" row and links note say "Walkthrough on request" for a product that does not exist yet. On `hide-pending` all of that is withheld by `hidden: true`, but the unwritten Note content and the guessed stack stay in the file for when the flag is cleared.
- `employers.ts` `ask-the-reading.featured: "ai"` with `featuredHidden: true`: the row's "Featured · AI" slot is reserved and its drawing (`public/diagrams/ask-the-reading.svg`) ships in `public/`, unused until the flag is cleared.
- `employers.ts` `PRAVA_PAGE` section 04 paragraph ii: "Four of the twelve have pages of their own" links to the four back-office pages. All four exist; the sentence goes stale if a fifth back-office page is added.

**Counts and dates that may have drifted**

- `employers.ts` `prava.rating: 5.0`, `ratingCount: 53`: rendered as stars and "5.0 · 53 ratings" in the Work hero's meta line and in Prava's page top row (`Rating.tsx`, aria-label "Rated 5 on the App Store from 53 ratings"). Pulled by hand from the App Store.
- `employers.ts` `BACK_OFFICE` ("Prava's back office · one of twelve tools over 140 admin routes"), `PRAVA_PAGE` section 04 ("Twelve tools on one hub, over 140 admin routes", statement "Twelve internal tools nobody sees", caption "The hub: twelve tools, one stack."), and the admin-hub alt text listing twelve cards: all hand-counted.
- `employers.ts` `PRAVA_PAGE` facts and `PROMPT_LAB_PAGE`: "Eleven grounded surfaces … (thirteen at launch)", "Eleven governed; thirteen at launch", "A 143-cell matrix (surface by denomination)", "nine named reasons". The resume PDF still says "thirteen grounded surfaces" and "eleven admin tools" (site says twelve).
- `employers.ts` `ANALYTICS_DASHBOARD_PAGE` facts, "Markers": "twenty-five are dated".
- `employers.ts` `LECTIONARY_TOOL_PAGE`: "9,002 assertions" (three places, plus the `date-to-slot.svg` drawing), "Checks sweep every Sunday to 2034", "five translations" (alt text, twice).
- `employers.ts` `COMMITMENT_LIBRARY_PAGE`: "about four hundred" acts (fact, statement, paragraph, and the `selection-funnel` drawings' "about 400 acts").
- `employers.ts` `PRAVA_PAGE` outcome: "On the App Store since Easter 2026, with paying subscribers on monthly and annual plans."
- `employers.ts` `EMPLOYERS[0].years` "2025 to now": "now" is relative.
- `app/page.tsx` `FOCUS`: "Running: Maui Oceanfront Marathon, 17 January 2027" and the four "Reading" titles are dated by nature.
- `components/footer/Footer.tsx`: "Scott Barclay · 2026".
- `app/sitemap.ts` `LAST_MODIFIED = new Date("2026-10-02")`, "set by hand when the content of the site changes"; the last content commit is 9 October.

**Copy that describes unfinished work in the products**

- `employers.ts` `LECTIONARY_TOOL_PAGE` section 03 paragraph: "The precedence and transfer tables still carry a note that they await a line-by-line pass against the missal, and the check scripts say so rather than hide it."
- `employers.ts` `COMMITMENT_LIBRARY_PAGE` section 02 paragraph i: "The Act pillar was removed from the shipped client in July 2026. The server side remains … The feature is returning."
- `employers.ts` `PRICING_PORTAL_PAGE` lede: "these are the parts I built inside it over three years" against the employer's years "2022 to 2026".
- `employers.ts` `ON_SALE_MONITOR_PAGE` `years: "2023 to 2026"` and section 02: "pulled out into pure functions in the 2026 rewrite".

**Resume (`public/resume.pdf`, linked as "IV Resume" in the nav and footer; last changed 27 July 2026)**

- Header: "Seattle, WA (relocating September 2026)". September has passed.
- "thirteen grounded surfaces" and "eleven admin tools" versus the site's eleven surfaces and twelve tools.
- "Full-Stack Developer · Etainement (ticket brokerage) 2022–2026 (part-time from 2025)" versus the site's "Full-stack engineer · 2022 to 2026".
- "Developer Analyst (promoted from Trader) · William Hill / Caesars" versus the site's "Caesars Sportsbook".

**README (`README.md`)**

- "a page for every project at `/work/<slug>`, from one template at three depths: Full (Prava), Standard, and Note": there are now four depths; Featured (Buyer extension) is missing.
- Structure block lists `icon.tsx, apple-icon.tsx` as generated icons; `app/` holds `icon.png`, `icon.svg`, `icon1.png`, `apple-icon.png`, and `app/og/` is not listed.
- Assets: "`arbitrage-table.png`, `trading-schedule.png`: work entries 03 and 04" (they are grid cells under Caesars now); `public/images/captures/`, `public/diagrams/`, `prava-commitment-library.png`, and `prava-lectionary-tool.png` are not listed; "Three images from the previous site are still in `public/images/`" (`incognito-after.png`, `incognito-before.png`, `inplay-odds.png`) is still true.
- "Chapter I's paragraphs link to six of the projects" is still true; "Nothing on the site links to the employers now" is no longer true (every project page's top row, nav cell, and closing link go to `/#employer-NN`).
