# Portfolio discovery: Etainement pricing portal (web front end)

Prepared 2026-10-05 from a read-only pass over this repository: the source under `src/`, the build and deploy configuration, the readme, and the full git history of `main`. Nothing was built, installed, or changed. This report is working material for a portfolio write-up and is not meant to be published as is.

State of the working tree. Git reports 162 modified files. Almost all of that is line-ending noise. Three files in the Shader screen carry real uncommitted edits (debug logging and a mocked save call, see "Other observations"). Everything below describes the committed code at the head of `main` unless it says otherwise.

Sources outside this repo. To place the portal in the wider system I read the extension's and the Assist dashboard's discovery reports. Where a statement rests on one of those instead of this repo, it says so. The backend's report did not exist yet when this was written, so nothing here has been checked against the backend.

Naming used in this report. Ticketmaster is named because the public portfolio already names it. The other marketplaces, the point-of-sale and inventory platforms, hostnames, endpoints, keys, permission strings, payload field names, staff names, venue names, and pricing thresholds are described but never reproduced. Other developers are not named.

One-line summary of the findings. The portal is a real, large, team-built internal tool, and "pricing portal" describes about half of it. The other half runs the brokerage's buying: on-sale planning, the seat-rule screen that feeds the extension, buyer dispatch, and buying accounts. Scott is one of about eight contributors and wrote roughly 15% of the commits. His clearest ownership is the rule-authoring panel that the extension consumes, the first generation of the stale inventory sheet, the Pricer's filter system and price guard, the original Pricer and Settings pages, and the Sentry integration. The market data on the pricing screen is a snapshot loaded when an event is opened, not a live feed.

---

## Committed credentials and secrets

Two real credentials are in the repository. Neither value is reproduced here.

1. **A Sentry auth token** is in `.sentryclirc`, tracked in git since 2025-04-07. The file is listed in `.gitignore`, but it was committed before or despite that, so the ignore rule has no effect and the token is in history. It should be rotated and the file removed from tracking.
2. **An API key for a third-party IP geolocation service** is hardcoded in a URL three times in `src/config/api.js`. Because this is front-end code, the key also ships in every built bundle, and the site is deployed to accept unauthenticated requests, so anyone who can reach the login page can read it.

Not secrets, but identifying, and none of it should appear in a screenshot or quote:

- The Sentry DSN in `src/instrument.js` (public by design) and the Sentry organisation name in `package.json`.
- A Google OAuth client ID committed in an early `.env` in November 2023. The file is no longer tracked. A client ID is a public identifier, not a secret.
- A cloud project number in `envVerification.mjs`, staging hostnames in the readme, the production front-end hostname hardcoded in about ten source files, and two external redirect hosts in `src/App.js`.
- The brokerage's own seller account IDs on one marketplace, hardcoded in the Pricer.
- Slack channel names in the Pricer, Shader, and Puller screens.
- Real staff names used as feature gates in three places: one in the Pricer, a list of four in the Shader, and a list of nine distribution names in the Onsale screen.
- `src/common/options/flaggedValues.js`: lists of real venue names marked for caution, plus flagged states and dates.
- Real Ticketmaster event IDs in unused test functions in `src/config/api.js`, and an offer code and a token-shaped value in a sample response file under `src/pages/Onsale/options/`.

No passwords, account emails, or customer records are hardcoded. The backend address and the Google client ID come from environment variables supplied at build time.

---

## 1. What it is

The pricing portal is an internal single-page web application for a ticket brokerage. Staff sign in with Google and get a set of screens decided by their role. Pricing analysts use it to work through events where the company holds tickets: they open an event, see their own listings beside the current listings on several marketplaces, change prices by hand or set auto-pricing rules, and switch listings on and off. On-sale managers use it to plan what to buy: they mark upcoming sales as buy or do not buy, write buy criteria, and open a venue map on which they select the seats, sections, rows, and price limits the business wants. That selection is the rule set the Chrome extension later paints on Ticketmaster's venue map for buyers. Administrators use it to assign buying accounts and events to buyers, manage users and roles, and read sales and purchase reports. Buyers themselves see very little of it: a page listing their assigned accounts and event links. The portal has no data of its own. Everything comes from, and is written to, the portal backend over a JSON API.

Who uses it, from the code:

- **Pricing analysts**, in four tiers the code names junior pricer, senior pricer, pricing manager, and admin. Day to day: the stale inventory sheet as a worklist, then the Pricer for one event at a time.
- **On-sale managers and approvers.** Day to day: the Onsale sheet to plan, the Shader to draw rules and watch availability, Slack messages sent from both.
- **Buyers**, called pullers or VAs in the code, in tiers by experience. Day to day: the Puller page for their accounts and links. They do not author rules.
- **Administrators.** Accounts, Puller dispatch, Settings, Reports.

The repo cannot say how many people hold each role.

---

## 2. Architecture

### Framework and structure

- React 18 on Create React App (`react-scripts` 5). Plain JavaScript and JSX. The only TypeScript is generated code.
- One bundle. There is no code splitting, no lazy loading, and no error boundary of the app's own. Sentry's router wrapper is the only boundary-like layer.
- Source is organised by screen under `src/pages/`, with shared widgets in `src/common/`, one API module, and a small Redux store.

### Routing

- React Router 6 with a browser router. Besides the root, sixteen routes are declared in `src/App.js`, two of which only redirect to other sites (the Assist dashboard and an external reports page).
- A `ProtectedRoute` wrapper checks two things: a token exists, and the user holds at least one permission that a static map (`src/common/PageNavigation/PagePermissions.jsx`) lists for that path. Otherwise it sends the user to the login view with the intended address as a query parameter.
- After login the user returns to the address they asked for. The address is kept in session storage and in the redirect parameter, so a deep link to an event survives a login.
- The Offers routes are declared without the wrapper. See "Other observations".
- A navigation drawer lists only the pages the user's permissions allow. For senior roles it also holds an event search.

### State management

- Redux Toolkit with seven slices: auth, layout sizes, three Pricer slices (staged edits and filters, auto-pricing criteria, interface toggles and map highlights), a small slice for the queue dashboard, and navigation search state.
- `redux-persist` writes two slices to the browser's local storage: auth and layout sizes. Nothing else survives a reload.
- `redux-state-sync` broadcasts auth and layout actions to other open tabs of the portal, so a refreshed token or a resized panel appears in every tab.
- Fetched data does not live in Redux. Each screen holds it in component state and passes it down as props. The Pricer's top component has 65 state hooks, the Shader's has 80.
- In the Pricer, Redux is also used as a command bus: a toolbar button or keyboard shortcut flips a "save requested" flag, and an effect inside the table component performs the save.
- No selector library is used. All selectors are inline.

### Data fetching

- One axios instance and one module, `src/config/api.js`, with about 140 functions grouped by screen (86 GET calls and about 60 POST, PUT, or DELETE calls).
- No query or cache library. Each screen calls the API from effects and keeps the result in state.
- No request is ever cancelled. There is no abort controller or cancel token anywhere in `src/`, so a slow response for a previous event can land after the user has moved on.
- A response interceptor reports every failed call to Sentry with the address, method, and status.
- Some payloads arrive compressed (venue map geometry is deflated and base64 encoded, and inflated in the browser with pako). Some arrive in Ticketmaster's own binary formats and are decoded in the browser. See hard part 4.3.

### Auth, and the session the extension borrows

Sign-in:

1. The user clicks a Google button. The Google OAuth authorization-code flow returns a code to the page.
2. The page posts the code to the backend's login endpoint, along with a device fingerprint, an IP-based location from a third-party lookup, and the machine's monitor layout if present.
3. The backend answers with its own JSON Web Token and the user's role, permissions, tags, name, and email. A user who is not in the Settings user list is refused.
4. The page stores all of that in the Redux auth slice, which `redux-persist` writes to local storage on the portal's origin.

The login view is not a separate page. It is an overlay component mounted at the top of the app that renders nothing while a token exists and covers the screen when it does not. It replaced a standalone sign-in page in late 2024.

Token refresh:

- Refresh is lazy and rides on ordinary traffic. A request interceptor runs before every API call. If more than five minutes have passed since the last refresh (a timestamp kept in local storage), it first posts to the refresh endpoint with the current token and the email decoded from it.
- Concurrent calls share one in-flight refresh promise, so a burst of requests triggers one refresh, not many.
- The refresh response replaces the token and also the role, permissions, tags, and name. A permission change made in Settings therefore reaches an active user within five minutes without a new login.
- If the refresh call fails, the old token is used silently. If any call returns "unauthorized" with a specific flag from the backend, the token is cleared and the login overlay returns.
- Token lifetime is set by the backend and is not visible here.

What the extension relies on (the extension side is from its own report):

- The extension has no login. Its worker reads the token and the last-refresh timestamp from the portal page's local storage in an open portal tab.
- Because refresh only happens when the portal makes a request, an idle portal tab never refreshes. That is why the extension reloads the portal tab when the token looks stale: the reload makes the app fetch, and the fetch triggers the refresh.
- The extension writes the machine's monitor layout into the portal's local storage. The portal forwards it to the backend at the next login. This is the only data that flows from the extension into the portal front end.
- The extension's report mentions a "login modal flag" in portal storage. I found no such flag in this repo. The overlay is driven only by the absence of a token.

### Real-time features

There is no push channel between the portal and its own backend. `socket.io-client` is a dependency but is imported nowhere.

| Screen | Mechanism | Detail |
|---|---|---|
| Pricer | None | Five requests run once when an event is opened. A banner appears when the backend flags the market data as an old snapshot. |
| Onsale | Polling | The whole sheet is refetched every 60 seconds when the date range is near today. A timestamp guard discards a poll that would overwrite edits still being saved. |
| Onsale | Direct WebSocket | Shortly before each hour the browser opens up to ten sockets straight to Ticketmaster's seat availability feed for the sales about to start. A September 2025 commit removed part of this code; the scheduler is still mounted. |
| Shader | Direct WebSocket | One socket to the same availability feed for the open event, throttled to one message per five seconds, with reconnect and backoff. Since a June 2025 change the seat-patching step no longer runs, so the socket only drives the "connected" indicator. |
| Shader | Polling | Queue statistics every 60 seconds, paused when the tab is hidden, stopped after five empty answers. |
| Reports | Cache with age | Each tab's data is cached in memory for five minutes and the tab button changes colour as it ages. |
| ID update | Polling | Hourly refetch. |

### Build and hosting

- `npm run build` runs the CRA production build, then uploads source maps to Sentry.
- A two-stage Dockerfile builds on Node 20 and copies the static output into an nginx image. nginx serves the files and falls back to the index page for any path, which is what makes client-side routes work on reload.
- Google Cloud Build builds the image, pushes it to Artifact Registry, and deploys it to Cloud Run. Build-time values (backend address, Google client ID, Sentry token) come from Secret Manager.
- Two environments, staging and production, each with its own Cloud Run service, selected by a build substitution. The readme describes the flow as branch, pull request into `staging`, deploy, then promote. A small label in the corner of the screen says DEV or STAGING outside production.
- The service is deployed to allow unauthenticated requests. The static site is public. Protection is the in-app login plus whatever the backend enforces.
- All three Cloud Build steps are marked as allowed to fail. There is no lint or test step.
- Sentry is wired for errors, performance tracing, session replay (a tenth of sessions, and every session with an error), and browser profiling.

---

## 3. The screens

Markers used in the table:

- **RULES**: authors something the extension consumes.
- **MARKET**: shows the company's pricing or position against a marketplace.
- **PURCHASES**: shows purchases coming back. The front end cannot see where the backend gets them, so whether they originate from the extension's warehouse records is a question for the backend report.

"Scott" is his share of non-merge commits that touch the screen's folder.

| Screen | What it shows | Who uses it | What it writes | Markers | Scott |
|---|---|---|---|---|---|
| Login overlay | Google sign-in button. | Everyone | Login, with device fingerprint and location. | | Shared file, small |
| Navigation drawer | Permitted pages. For senior pricing roles, an event search whose results show price range and, per event, quantity purchased with cost, quantity sold, profit, and margin. | Everyone | An offers on/off toggle per event. | PURCHASES (per-event totals) | Created it in February 2024; mostly rewritten by others since |
| Pricer | One event in four resizable panels: market history charts and a sales table; the company's own listings; an interactive venue map; and current listings from Ticketmaster (primary and resale) and two other marketplaces. Hovering a listing's tags shows which buyer bought it, for senior roles. | Pricing analysts | Bulk price changes with an audit trail, broadcast on and off (single and bulk), auto-pricing rules per group, event tags and strategy, notes that also post to Slack, marketplace ID corrections. | MARKET, PURCHASES (buyer per listing) | 11% |
| Shader | A canvas venue map with every seat coloured by availability, price, and source; a panel of buy rules laid over it; an event sidebar with queue statistics and merged listings; a strip with buy criteria, a note, and a Slack composer; price and quantity history charts. | On-sale managers | The full rule set on Submit; stop and on/off switches (immediate); buy criteria and note (autosave); per-seat alerts; venue notes; Slack messages; offers toggle. | RULES, MARKET (resale prices on the map, own inventory and sales overlays) | 15% |
| Shader, approver view | The saved rules as a read-only table beside a static map image. | Users with the limited Shader permission | Nothing | | Part of the above |
| Onsale | A spreadsheet of upcoming Ticketmaster sales, one row per event and sale: capacity, price levels, demand signals, queue sizes, a marketplace's lowest price, and the team's decisions. A second view rolls rows up by artist. | On-sale planners | Inline, per cell and in bulk: buy decision, buy criteria, codes, account and buyer notes, percentage of buyers to assign. Saved views. | RULES (buy criteria text), PURCHASES (quantity purchased per row) | 18% |
| Stale inventory | The analysts' worklist: every event where the company holds tickets, with listings, cost, average and lowest price, percent sold, sales velocity over several windows, and marketplace lowest prices with sparklines. Tabs act as preset filters, including one for recently purchased events. | Pricing analysts, with tabs by tier | Table layouts per user and tab, tags and strategies in bulk, messages, a bulk "initial pricing" action. | MARKET, PURCHASES (per-event quantity and last purchase date) | 39% |
| Stale inventory, pricing dashboard tab | Analyst performance: inventory value, events checked, visits per day, comparison between analysts, against targets. | Admin only | Nothing | | Scott built it in June and July 2025 |
| Offers | A monitor for an automated offers feature: per event, coverage, price range, error against the recommended price, whether the company's offer is the highest. Drill-down per offer. A per-artist multiplier page. | Senior pricing roles | Per-event toggle and multiplier, per-artist multiplier (autosave). | MARKET | 0% |
| Dynamics | Events where Ticketmaster's dynamic pricing changed, with counts over time and expected value. | Senior pricing roles | Nothing | MARKET (primary price movement) | 0% |
| Brokers | Competitor analysis: what another seller lists on one marketplace, by event and over time, with pie charts that cross-filter. | Holders of a brokers permission | Alias, tags, and notes for a seller. | MARKET (competitors, not own pricing) | 0% |
| Reports | Five read-only tables with CSV export: all sales, purchases as weekly cohorts with profit by sale phase, offers inventory, lead times, and inventory missing on Ticketmaster. | Holders of a reports permission | One "check event" action. | PURCHASES (weekly cohort totals) | Under 5% |
| TM queues | Ticketmaster waiting-room positions per buying account, per buyer, and per event, with percentiles and charts. | Holders of a reports permission | Nothing | Queue data, not purchases. It matches what the extension records, but the source is not visible here. | 0% |
| Accounts | The inventory of Ticketmaster buying accounts and the payment cards on them, assigned to buyers. Paste-and-map bulk import with a preview. | Administrators | Bulk add, assign, unassign, delete; inline card edits; Excel export. | | 0% |
| Puller | Admin view: today's on-sale events and a button that distributes them across buyers by tier and load, then announces links in Slack. Buyer view: my accounts and my event links with buy criteria. | Administrators and buyers | Event assignments, buy criteria and codes (autosave), delete all assignments. | RULES (buy criteria text, same store as Onsale) | 0% |
| ID update | A work queue for matching one event across marketplaces by entering its IDs. | Holders of a zones permission | Bulk autosave of completed rows. | | 0% |
| Zones | A read-only list of zone sales still needing real tickets. Looks unfinished: columns are flagged editable but nothing edits them. | Holders of a zones permission | Nothing | | 0% |
| Settings | Users, roles, a permission grid per role and per user, tags, strategies, and a proxy health table. | Administrators | Create, bulk create, import, update, and delete users; edit role and user permissions; add and delete tags, strategies, roles, permissions. | | 14%. Scott built the first working version in November 2023 |
| Assist dashboard link | A redirect to the separate Assist dashboard, shown only to holders of an assist permission. | Managers | Nothing | | |

Where each thing the extension consumes is authored:

| Rule-set field (from the extension's report) | Authored in |
|---|---|
| Rules: seat IDs, sections, row ranges, price ranges | Shader rules panel |
| Per-rule active flag, per-rule and per-event maximum quantity | Shader rules panel |
| Stop flag, master on/off switch | Shader rules panel, sent immediately when toggled |
| Obstructed, singles, platinum flags | Shader rules panel, applied in the browser when rules are resolved to seats, and also sent |
| Buy criteria text | Three places that write the same store: the strip at the top of the Shader, a cell in the Onsale sheet, and a cell in the Puller admin table |
| Message | Unclear. Candidates are the note saved beside buy criteria, the venue note, the per-seat alert message, and the Slack message log. Scott or the backend report should settle which one the extension receives. |

---

## 4. The hard parts

Evidence note that applies to all ten. The repo has no tests of any kind. Evidence of deliberate work is in commit messages, the shape of the code, and what was rebuilt. Because this was a team project, each section says who did the work. "Scott" means commits under his name. "Others" means the rest of the team.

### 4.1 Authoring buy rules on a venue map

The Shader's rules panel is the source of what the extension paints. A manager needs to say "these sections, these rows, up to this price" in seconds, during an on-sale.

Approach:

- **Gestures on the map.** Control-click picks the nearest seat and starts a rule for its section, with the price limit seeded from that seat's price plus a margin. Control-drag draws a line, not a box: seats within a band around the line are collected by a point-in-polygon test, and their sections and rows become a new rule. Adding Shift merges the selection into the rule already selected.
- **Typed entry.** Every rule can also be typed: sections (including numeric ranges), rows, seat numbers, minimum and maximum price, maximum quantity.
- **Switches.** A master on/off, a stop switch, an active flag per rule, and three filters (obstructed view, single seats, platinum).
- **Resolution at save time.** On Submit, the browser walks every seat in the venue and resolves each active rule to a concrete list of seat IDs, applying the three filters. The saved rule set carries both the human-readable criteria and the resolved IDs. This is why the extension's map script can ignore the three filter flags: the filtering has already happened here. A May 2025 commit of Scott's makes the save include every matching seat, not only the ones currently visible on the map.
- **Feedback.** The map outlines matching seats live as rules change, and totals the count and cost.

What it does not do: there is no autosave, no undo, no version history, and no conflict handling. Two managers editing the same event overwrite each other, last write wins. The stop and on/off switches change on screen before the request and do not revert if it fails.

Who did it. This is the most clearly Scott's part of the repo. The rules panel was split out of the map component in his March 2025 restructure, and about 92% of its lines at the head of `main` are his. His commits from October 2024 to August 2025 add the obstructed, singles, and platinum toggles, the main switch, per-rule on/off, section ranges, the seat filter, maximum quantity, and the active flag sent to the server. The first link between the Shader and the extension was merged by another developer in July 2024.

A senior engineer would ask: why resolve rules to seat IDs in the browser instead of on the server, and what happens when availability changes after the save; what happens when two people edit at once; how a rule written against one seat-numbering scheme is tested against another. Honest gaps: the matching logic exists twice in the map component, once for the live outline and once for the save, and the two copies parse seat numbers differently, so the outline and the saved list could disagree.

### 4.2 Drawing a whole venue's seats

A stadium map means tens of thousands of seats, each coloured by status, price, and source, redrawn as the user pans and as rules change.

Approach:

- The first map, in March 2024, was SVG with one element per seat. It was replaced within three months by a single 2D canvas.
- Seat geometry comes from the backend as compressed map data. Dot size steps down as seat count rises, at about ten and twenty thousand seats. Above about forty thousand the live feed is switched off.
- Lookup tables for sections, rows, and price statistics are precomputed and memoised, as are colour ramps for price.
- Seats are drawn as different shapes by type, with an outline pass for rule matches and pie charts for general admission areas.

What it does not do: every pan movement redraws every seat. There is no frame scheduling, no handling of high-density displays, no layered or offscreen canvas, and hit testing for hover and click scans all seats linearly. The code refers to a spatial index that is never built.

Who did it. The canvas rebuild and most later performance work are by others (commits titled for speed improvements in October 2024, and for map loading lag and hover performance in mid 2025). Scott's part is the March 2025 restructure, the "shader optimizations" commit the next day that added the lookup tables, and moving the map image fetch to the backend in April 2025. About a quarter of the map component's lines are his.

Questions: why redraw everything on pan instead of transforming a cached layer; what a quadtree would buy for hover; how frame time was measured. Evidence: the SVG-to-canvas change and four separate rounds of optimisation commits are in the history. No measurements are recorded.

### 4.3 Reading the marketplace's own data in the browser

The Shader and Onsale screens show Ticketmaster seat availability more directly than a scraped table would allow.

Approach:

- Availability arrives in the marketplace's binary format. The repo contains code generated by the FlatBuffers compiler from a schema (52 generated files, about 6,000 lines), and decodes seat sets stored as Roaring bitmaps using a WebAssembly build of that library.
- Seat IDs are base32 strings with prefix compression. The code expands and decodes them to recover section, row, and seat names. This decoder was written by hand and exists in three copies.
- For live updates, the browser subscribes to the marketplace's availability feed over a WebSocket, with a five-second throttle and reconnect with growing delays.
- The Pricer does a smaller version of the same thing: it expands compressed seat strings and collapses adjacent seats into listing rows.

Who did it. Almost entirely others. The generated code has one commit per folder, by another developer. Scott's commits here are about behaviour around the feed: pausing the change animation when a historical snapshot is selected, reconnecting when the selection changes, and remembering the live-feed setting per user and event.

Questions: why the browser and not the backend holds this connection; what the marketplace's terms say; what happens when the schema changes. Honest gaps: the live patch has been inert since June 2025, and one of the two decoders is called and its result discarded. This is the part of the portal least suited to a public page. See sections 7 and 10.

### 4.4 Dense tables, solved five different ways

Almost every screen is a wide table, and the team never settled on one grid.

| Implementation | Where |
|---|---|
| Custom grid on `react-window` | Stale sheet, Pricer market table, Accounts, Reports, Brokers, Offers, Zones |
| Hand-rolled row windowing on a plain table | Onsale |
| `react-virtuoso` | Pricer sales table, only above 500 rows |
| `material-react-table` | Shader listings tab |
| MUI DataGrid | Settings |
| Plain tables, every row rendered | Pricer inventory table, Dynamics, Puller, TM queues, ID update |

The stale sheet is the most complete: 84 named columns, pinned columns using sticky positioning, drag to reorder, drag to resize, a totals row with weighted averages kept aligned with the body by syncing scroll position, a sparkline chart per cell, and layouts saved to the backend per user and per tab. The Onsale sheet has 170 filterable columns and a default view of 118.

Who did it. Scott virtualised the Pricer's market table in March 2024 and built the first generation of the stale sheet from March to October 2024: column settings, draggable and resizable columns, sticky columns, line graphs in cells, overscan tuning, and a commit titled "stale sheet overhaul". In March to May 2025 another developer rebuilt the stale sheet from scratch and deleted the old files, so only about 5% of today's sheet and table files are Scott's lines even though 39% of the folder's commits are his. On the Onsale sheet about a third of the cell formatter is his. Performance commits on the Onsale sheet are by others.

Questions: why not one grid library; how row height, overscan, and sticky columns interact; how you kept header, body, and totals aligned; what the row count is and how you measured scroll performance. Honest gaps: several memoisations do not hold because their inputs are recreated on every render, and the Pricer's own-inventory table is not virtualised at all.

### 4.5 Filters as a small language, linked across panels

Approach:

- In the Pricer, a filter set on one panel drives the others. Clicking a map section filters the market table; with Control it filters the inventory table; with both modifiers, both. Dragging paints a multi-section selection. Hovering a table row highlights its sections on the map. Clicking a sale filters the map.
- Section and row filters accept single values, comma-separated lists, and ranges, with a fallback matching value when section names differ between sources.
- The Onsale sheet's header filters accept comparisons, ranges, negation, quoted phrases, blanks, hour of day, and days ago. Saved views store dates as offsets from today so a view stays meaningful tomorrow.
- The stale sheet has header filters on 63 columns in seven types plus a 24-input filter panel.

Who did it. Scott built the Pricer's inventory filters in November 2024 and spent roughly forty commits through February 2025 connecting section and row filters across the map, both tables, and sales. He also built the Onsale header filters and the artist roll-up view (August to October 2024) and the first-generation stale filters.

Questions: where the filter state lives and why; how you keep four panels consistent without re-filtering everything on each keystroke; why filter on the client. Honest gaps: the Pricer's filter reducer is copied whole for the inventory and market tables, and all filtering is client-side over the full dataset with no pagination.

### 4.6 Price editing with guards

Changing a price is the one action here that costs money immediately if it is wrong.

Approach:

- Edits are staged, not sent. Edited cells are held in Redux until the analyst saves with a button or Control-S, which sends one bulk request with the old and new values and the user.
- Two blocking popups stand between staging and saving. One opens when a staged price is more than a set percentage below the market's lowest comparable price. The other protects listings in the offers programme from dropping below a multiple of cost. In the first, prices can be corrected inside the popup before confirming.
- The auto-pricing form expresses a rule per group of listings: how many comparable listings to average, markup as a percentage or an amount, floor, ceiling, and a stagger ladder that spaces successive listings apart. Comparables default from a hierarchy of zone, section type, and row, and can be widened, narrowed, or hand-picked. An outlier rule keeps extreme listings out of the average.
- Broadcast changes go out in batches of fifteen with a pause between batches and a progress message.

Who did it. Scott wrote the original price-drop warning in September 2024 and extended it to auto-pricing with a minimum price check. The popup was later moved into its own file by others, and none of its current lines are his. The auto-pricing form and comparables logic are by others.

Questions: why the guard is in the browser and whether the server repeats it; what happens on a partial failure in a batched broadcast. Honest gaps: a failed price save still clears the staged edits, both guards are skipped when the save comes from the auto-pricer, and there is no floor or ceiling check on manual edits.

### 4.7 Optimistic updates, mostly absent

The brief asks about optimistic updates. The honest finding is that the portal mostly does not do them.

- **The one real case is the Onsale sheet.** A cell edit shows at once and turns yellow. The send is debounced by a few seconds and held back while the field has focus. Editing a cell in a selected row applies to all selected rows, and the bulk payload is deduplicated so the latest value per row wins. A timestamp guard throws away a 60-second poll result that would overwrite edits still in flight. On failure there is a message and no rollback.
- **Everywhere else** a write either waits for success before changing the screen (Accounts, Settings, Offers toggle, Pricer prices) or changes the screen first and hopes (Shader switches, Pricer tags and auto-pricing rule save).
- **Autosave** exists in several places with fixed delays: Shader buy criteria and notes, Puller cells, Offers multipliers, ID update rows.

Who did it. The Onsale editing model is by others.

Questions: what the user sees when a debounced save fails after they have moved on; how you stop a background refresh clobbering local edits; what "last write wins" costs with several planners on one sheet. This is a good interview topic because the gaps are easy to name and the fix (a query library with mutation rollback, or server versioning) is well understood.

### 4.8 A session that another program depends on

Approach: described in section 2. The parts that took thought are the single-flight refresh inside the request interceptor, refreshing permissions along with the token, syncing auth across tabs, and returning the user to a deep link after login.

Who did it. Scott added the reroute to sign-in on an expired token (January 2024), the return-to-event after login and the `ProtectedRoute` wrapper (March 2024), the fingerprint update on a new IP (December 2024), and the monitor layout at login (February 2025). The refresh interceptor and cross-tab sync are by others. A branch named for extension authentication exists on the remote.

Questions: the exposure of a token in local storage to any script on the page; why refresh on a five-minute timer instead of on expiry; what happens when the refresh fails quietly; why the extension must reload the tab and whether a background refresh timer would remove that need. Honest gaps: a failed refresh is swallowed, and an idle tab's token simply ages out.

### 4.9 Role-based UI

Approach:

- Roles, permissions, and tags are data, edited in Settings and delivered at login. A role has many permissions; a user has one role, many tags, and optional extra permissions.
- One static map from path to permission names drives both the navigation drawer and the route guard.
- Inside pages, checks change what is shown: the Shader gives full control to one permission and a read-only approver view to another; the Puller page is two different screens for administrators and buyers; the stale sheet shows different tabs per pricing tier; junior pricers see only events tagged to them and have cost and margin removed.

Who did it. Scott built the first working Settings page (November 2023), the navigation drawer (February 2024), the route guard (March 2024), and the junior pricer tab and stale permissions (April to May 2024). Settings has since been rebuilt three times by others.

Questions: whether the server enforces any of this; why cost is removed in the browser after the fetch instead of never being sent. Honest gaps: every check is client-side; cost and margin for junior pricers still arrive in the response; three features are gated on hardcoded staff names; and the Offers routes have no guard.

### 4.10 Rebuilding in place, without tests

What was rebuilt more than once, from the history:

- **Stale sheet**: first version January 2024, Scott's overhaul April 2024, a full rebuild by another developer in spring 2025.
- **Shader map**: SVG, then canvas, then a restructure, then two rounds of loading rework.
- **Onsale**: rebuilt from August 2024 on a set of "new onsale" branches. Field names left in the code suggest the buy-planning data previously lived in an external spreadsheet-style tool.
- **Settings**: four generations.
- **Pricer**: per-platform row components merged into one (Scott, February 2024), loading split into parallel per-feed calls (October 2024), one Redux slice split into three (March 2025).
- **Login**: a standalone page replaced by an overlay.

The history has 4,073 non-merge commits in 24 months, 141 of which mention a revert and about 1,000 a fix or bug. Many subjects appear twice because the same change was committed to both the staging and main lines. There are no tests, no type checking, and no lint step in the pipeline.

What stands in for tests: a staging environment, and from April 2025 Sentry with error capture, tracing, session replay, profiling, and uploaded source maps, all of which Scott integrated. There is also a script that reports which API functions are unused.

Questions: how regressions were caught before Sentry; what Sentry found in its first month; what you would test first if you had a week. Evidence: strong for the rebuilding, absent for any testing practice.

---

## 5. Timeline and scale

First commit 2023-11-01. Last commit 2025-10-30. 5,898 commits on `main`: 4,073 non-merge and 1,825 merges, over 24 months. No tags. About 40 branches remain, many named for task tracker tickets.

### Authors and credit

Fourteen git names map to about eight people and one organisation account once aliases are merged. The alias merging is my reading of the names and should be checked.

| Contributor | Non-merge commits | Share |
|---|---|---|
| One developer (two git names) | 2,380 | 58% |
| Scott | 619 | 15% |
| A third developer | 576 | 14% |
| A fourth | 268 | 7% |
| A fifth | 157 | 4% |
| Three others and an organisation account | 73 | 2% |

Scott's commits run from 2023-11-29 to 2025-08-26, all under one name and one company email. Counting merges he has 807 of 5,898 (14%). About 545 of his 619 are distinct once same-day duplicates across branches are removed. His busiest months were April and May 2024 and September 2024, at 60 or more each.

Scott's share by area (non-merge commits touching the folder, and his surviving lines where measured):

| Area | Commits touching it | Scott's | Share | Lines still his at head |
|---|---|---|---|---|
| Stale sheet | 691 | 270 | 39% | About 5% of the sheet and table files (rebuilt by another developer in 2025); all of the pricing dashboard tab |
| Onsale | 278 | 51 | 18% | About 9% of the main file, a third of the cell formatter, a fifth of the column summaries |
| Shader | 715 | 107 | 15% | Rules panel about 92%; map component about 26%; top-level file about 2% |
| Settings | 121 | 17 | 14% | Not measured; the file he wrote was renamed and rebuilt |
| Pricer | 1,555 | 170 | 11% | About 10% of the seven main files |
| API module | 317 | 41 | 13% | About 9% |
| Sentry setup, route guard | Small files | | | All of the Sentry setup file, half of the route guard |
| Accounts, Puller, TM queues, Brokers, Offers, Dynamics, ID update, Zones | 551 combined | 0 | 0% | None |

### Phases, read from the history

1. **November 2023 to January 2024. Foundations.** Sign-in, a first Settings page (Scott), and the first Pricer commit (Scott, December 2023). Low volume.
2. **February to May 2024. The Pricer and the stale sheet take shape.** Four-panel layout, market table virtualisation and map interactions (Scott), navigation and route guard (Scott), the first Shader with an SVG map, Accounts, Puller, the queue dashboard. Scott's stale sheet overhaul.
3. **June to September 2024. Peak activity, 340 to 550 commits a month counting merges.** Canvas map, the first Shader-to-extension link (July, by another developer; this lines up with seat shading arriving in the extension the same month), Onsale rebuild with Scott's header filters and artist view, the price-drop guard (Scott).
4. **October 2024 to February 2025. Linking and filtering.** Pricer loading split per feed, Scott's cross-panel filter work, obstructed, singles, and platinum rule toggles (Scott), Reports, Brokers, Offers.
5. **March to July 2025. Restructures.** Shader restructure and rule switches (Scott), Sentry (Scott), the stale sheet rebuilt by another developer, Redux slices split, Scott's pricing dashboard, map data compression.
6. **August to October 2025. Tail.** Under 100 commits in total. Scott's last commit is in August.

### Numbers the repo supports

| Measure | Value |
|---|---|
| Hand-written JavaScript and JSX | 64,418 lines in 150 files |
| Generated FlatBuffers code | 6,009 lines in 52 files |
| CSS | 2,685 lines |
| Pricer | 19,105 lines, 25 files |
| Shader | 11,336 lines, 16 files |
| Stale sheet | 8,033 lines, 16 files |
| Onsale | 5,915 lines, 12 files |
| Brokers, Settings, Accounts, Reports | 2,520, 2,294, 2,110, and 2,006 lines |
| Other screens combined | About 5,700 lines |
| Shared widgets, API module, store | 1,476, 1,122, and 1,334 lines |
| Largest single component | 3,850 lines (the Pricer's data panel) |
| Routes | 16, two of them external redirects |
| API functions | About 140 |
| Redux slices | 7 |
| Components over 2,000 lines | 7 |
| Tests | 0 |

### Numbers the repo cannot support

Users, events priced, listings, price changes per day, rules authored, on-sales covered, revenue or margin effect, page load or render times, error rates. The backend and warehouse would hold the first seven. Sentry would hold the last two from April 2025.

---

## 6. Stack

Exactly as the repo shows:

- **Language**: JavaScript with JSX. No TypeScript in hand-written code. Generated FlatBuffers code is committed in both TypeScript and JavaScript.
- **Framework**: React 18.2 on Create React App 5.
- **Routing**: React Router 6.18.
- **State**: Redux Toolkit 1.9, `redux-persist`, `redux-state-sync`.
- **HTTP**: axios with request and response interceptors.
- **UI**: MUI 5 (core, icons, lab, data grid, charts, date pickers), `material-react-table`, `rsuite` for one date range picker, `react-toastify`, `lucide-react`. Styling is a mix of plain CSS files, one CSS module, and MUI's inline style prop.
- **Tables**: `react-window` with `react-virtualized-auto-sizer`, `react-virtuoso`, `react-beautiful-dnd`, `react-resizable`.
- **Charts**: `recharts` in most places, MUI charts in the queue dashboard, `chart.js` for stale sheet sparklines.
- **Binary and data**: `flatbuffers`, `roaring-wasm`, `pako`, `websocket` (a W3C client), `xlsx`, `lodash-es`.
- **Auth**: `@react-oauth/google`, `jwt-decode`, `fingerprintjs2`.
- **Dates**: five libraries are imported (`date-fns` with its timezone add-on, `moment`, `dayjs`, `luxon`).
- **Monitoring**: Sentry for React, with replay and profiling, plus the Sentry command-line tool for source maps.
- **Declared but imported nowhere**: `socket.io-client`, `localforage`, `styled-components`, `framer-motion`, `victory`, `reselect`, `match-sorter`, `hi-base32`, `react-chartjs-2`. Also in dependencies for no runtime reason: `npm`, `install`, `request`.
- **Lint**: ESLint 8 with React and hooks plugins. Two configurations exist (a config file and the CRA default in `package.json`). There is no lint script, and the unused-variable rule is off.
- **Tests**: none. The testing libraries that ship with the CRA template are still listed. No test file exists.
- **Build**: `react-scripts build`, then Sentry source map injection and upload.
- **CI and deploy**: Google Cloud Build to Artifact Registry to Cloud Run, nginx serving static files, secrets from Secret Manager. No test or lint stage. Every step is allowed to fail.
- **Environments**: local, staging, production. A helper script pulls the local Google client ID from Secret Manager and starts the dev server.

The readme is partly stale (it refers to an environment template file by the wrong name and contains staging addresses), so the write-up should not quote it.

---

## 7. What can be shown

No screenshot, recording, or diagram exists in the repo. The only images are marketplace and tool logos and favicons.

There is no demo mode, no mock API layer, no seeded data, and no component gallery. Every screen needs a signed-in user and live backend responses, and the staging site labels itself STAGING in the corner. So any capture means one of three things: a demo account on staging with seeded or scrubbed data, a small mock of the API responses for one screen, or a redrawn mock-up. The table says which fits.

| Screen | Could it be captured? | What it would need |
|---|---|---|
| Shader rules panel and map | Yes, and it is the strongest visual in the system: a seat map with outlined selections and the rules panel beside it. | A synthetic venue (invented geometry, seats, and prices) served through a mock of four or five responses, or a redrawn mock. Not a real event: the map image, geometry, and availability are the marketplace's, and the rules are the brokerage's buying strategy. Hide the Slack composer, the venue note, queue statistics, and the top bar's code dialog. |
| Pricer | Yes with heavy seeding. The four-panel layout with a map, two tables, and charts reads well. | Invented event, listings, prices, and seller names. Blur or replace marketplace logos unless Scott chooses to name them. Hide broker names, buyer tooltips, tags, the message box, and the auto-pricing form's values. A wireframe of the four panels may serve better than a capture. |
| Stale sheet | Yes with seeding. A good "dense table" image: pinned columns, sparklines, totals row, coloured priority rows. | Invented events and numbers. Hide tag names, analyst names, and priority reason text, which are business rules. |
| Onsale sheet | Possible with seeding, visually similar to the stale sheet. | Invented sales. Hide buy criteria, codes, account and buyer columns, and the distribution names. |
| Column settings and saved views dialogs | Yes. Small, safe, and they show real UI work. | Generic column names. |
| Settings, roles and permissions grid | Yes with a demo tenant. | Invented users. Rename permissions to generic labels. Leave out the proxy table. |
| Login overlay | Yes as it is. | Nothing. Not visually interesting. |
| Reports, Dynamics, Offers | Possible with seeding, low value. | Invented figures. |

Must stay prose only, or be left out:

- **Accounts and the Puller buyer view.** Buying account identifiers and payment card details, including expiry dates and security codes.
- **TM queues.** Account emails and buyer names against waiting-room positions.
- **Brokers.** Intelligence on named competitors.
- **The pricing dashboard tab.** Individual staff performance against targets.
- **Proxy analytics in Settings.**
- **Auto-pricing thresholds, the guard percentages, comparables logic, flagged venue lists, and priority reasons.** These are the brokerage's pricing rules. Describe the mechanism, not the numbers.
- **The direct connection to the marketplace's availability feed and the binary decoding.** See question 13.
- **Device fingerprinting, location lookup, and page-visit timing at login and navigation.** Staff monitoring.
- **`src/config/api.js`, `.sentryclirc`, `src/instrument.js`, the readme, and the build files** should never appear in an image.

Diagrams the code supports:

1. **Rule lifecycle.** Gesture or typed entry, rule in panel, resolution to seat IDs in the browser, save, backend, extension poll, paint. This joins the portal's story to the extension's.
2. **The borrowed session.** Google sign-in, backend token, local storage, lazy refresh in the request interceptor, cross-tab sync, and the extension reading and reloading.
3. **Pricer data flow.** Five requests in parallel (two for own inventory and event settings, three for market data), normalisation onto a shared section-and-row group key, own listings matched into the market, comparables, anchor price, staged edit, guard, bulk save.
4. **Pricer layout wireframe.** Four panels and the arrows between them for filter and highlight links.
5. **Anatomy of a virtualised sheet.** Window of rows, pinned columns, header and totals rows synced to scroll, layout saved per user and tab.
6. **Roles to permissions to pages.** With generic names.
7. **Build and deploy.** Branch, staging, Cloud Build, container, Cloud Run, Sentry source maps.
8. **Screen map by job.** Which role uses which screens, split into pricing, buying, and administration. This is the picture that corrects the "pricing portal" framing.

---

## 8. Claims audit

**The portfolio says: "a pricing portal for inventory against the live market".**

- **"A pricing portal": true, and incomplete.** Four of the screens are about pricing (Pricer, stale sheet, Offers, Dynamics) and they hold about 45% of the code. The rest is buying operations (Shader, Onsale, Puller, Accounts, queue dashboard, ID matching) and administration. The system the extension depends on is the buying half.
- **"For inventory": true.** The Pricer and stale sheet are built around the company's own listings, cost, and sales.
- **"Against the market": true.** The Pricer shows current listings from Ticketmaster (primary and resale), two other marketplaces, and a broker trading platform beside the company's own, matches the company's listings into them, and computes comparable prices. The stale sheet shows marketplace lowest prices and trends per event.
- **"Live": partly true.** On the pricing screen, market data is fetched once when an event is opened. There is no polling and no push, and a banner warns when the snapshot is old. The stale sheet loads once per visit. What is closer to live is on the buying side: the Onsale sheet polls every minute, and the Shader subscribes to seat availability, although its live patching has not worked since June 2025. "Current market" is accurate. "Live market" overstates it for pricing.

**The accurate one line.** "An internal web app where a ticket brokerage prices its inventory against current marketplace listings and plans its buying: analysts set prices and auto-pricing rules per event, and on-sale managers draw the seat rules that the Chrome extension shows to buyers."

**Authorship, if the page implies it.** This is a team codebase. Scott wrote about 15% of the commits and is second of about eight contributors. A page that presents the portal as his project should say which parts are his: the rule-authoring panel, the first stale sheet, the Pricer's filters, market table, and price guard, the original Pricer and Settings pages, navigation and route guarding, the pricing dashboard, and monitoring.

**Two claims from the extension's diagram that this repo can now settle:**

- **"Buyer saves rules in the portal": wrong role.** Rules are authored in the Shader by users holding the map permission. Buyers have their own roles, see the Puller page, and have no rule-authoring screen. The correction is "an on-sale manager saves rules in the portal".
- **"State echoed back so the portal knows what was bought": partly supported from this side.** The portal does show purchases: totals per event in the navigation search, Onsale, and the stale sheet, weekly cohorts in Reports, and the buyer behind each listing in the Pricer. They arrive from the portal backend. Whether the backend gets them from the extension's warehouse records or from the point-of-sale system is not visible here.

---

## 9. The system picture

The front end's place in the flow, with the step owner in brackets:

1. **Plan.** A planner marks a sale as a buy and writes buy criteria in the Onsale sheet. [This repo: screen and write. Backend: storage.]
2. **Dispatch.** An administrator assigns the hour's events across buyers by tier and load, and assigns buying accounts. [This repo: the assignment algorithm runs in the browser. Backend: storage.]
3. **Author rules.** A manager opens the event in the Shader, draws or types rules, sets switches and limits, and submits. The browser resolves rules to seat IDs and sends the set. [This repo.]
4. **Serve rules.** The backend stores the set and serves it per event to the extension, checking the caller's token and extension ID. [Backend. Not seen here.]
5. **Lend the session.** A buyer keeps a portal tab open. The extension reads the token from that tab's storage and reloads the tab when the token ages. [This repo: storage and refresh. Extension: the reading.]
6. **Paint and record.** The extension highlights seats on Ticketmaster and records the purchase journey to the warehouse and to Firestore. [Extension, from its report.]
7. **Watch.** Managers follow the on-sale on the Assist dashboard, which the portal links to behind a permission. [Dashboard, from its report. This repo: only the link.]
8. **See what was bought.** Purchases and queue positions appear back in the portal: the queue dashboard, Reports, the stale sheet's recently purchased tab, per-event totals, and the buyer per listing in the Pricer. [This repo: display. Backend: the source.]
9. **Price.** An analyst works the stale sheet, opens the Pricer, compares with the market, and saves prices or an auto-pricing rule. [This repo: screens and guards. Backend and its jobs: applying prices to the point-of-sale platforms, running auto-pricing.]

What is unknown from this repo:

- Whether the purchases and queue data in step 8 come from the extension's warehouse records. The queue dashboard's fields match what the extension records, which suggests so, but the front end only sees an API response.
- Which stored text the extension receives as its "message".
- Whether the backend repeats any of the permission checks, price guards, or validation that the front end performs. If it does not, they are advisory.
- Whether the backend versions rule sets or keeps a history. The front end sends a whole set and shows a last-updated time.
- Token lifetime, and what the refresh endpoint verifies.
- What consumes the device fingerprint, location, monitor layout, and page-visit records.
- Who or what executes auto-pricing after a rule is saved.
- Whether the portal is still in daily use. The last commit is from October 2025 and activity fell sharply after July 2025.

---

## 10. Questions only Scott can answer

Users and outcomes

1. How many people use the portal, by role? Roughly how many events and listings does it carry?
2. What did analysts and on-sale managers use before each screen existed? The Onsale code suggests buy planning moved in from a spreadsheet-style tool. Is that right, and is the before-and-after worth telling?
3. Is there any measured outcome: time to price an event, events checked per analyst per day, rules authored per on-sale, errors caught by the price guard? The pricing dashboard you built implies some of these are tracked.
4. Is the portal still in use, and are you still working on it? Your last commit is August 2025.

Authorship and credit

5. The history shows you as second of about eight contributors, with 15% of commits. How do you want the team described, and which parts do you want to claim? The list in section 8 is what the history supports.
6. Your first-generation stale sheet was rebuilt by a colleague in 2025. Do you want to tell that as "built the first version and proved the design", and did the rebuild keep your design?
7. The price-drop guard: was it your idea, a response to an incident, or a ticket? An incident story would make it a strong section.
8. How much of the Shader's rule model did you design, as opposed to implement? Who decided that rules are resolved to seat IDs in the browser?
9. Did you do the Sentry work alone, and what did it surface first?

Facts the repo cannot settle

10. Who authors rules in practice: one on-sale manager, several at once? Has last-write-wins ever caused a problem?
11. Which text does the extension show as its "message"?
12. Does the purchase data shown in the portal come from the extension's records in the warehouse?
13. Why does the browser, and not the backend, connect to the marketplace's availability feed? Is the live patch known to be broken since June 2025, or was it turned off on purpose?
14. Was a single grid library ever considered instead of five table approaches?
15. Is there any testing or review practice the repo does not show (manual test plans, staging sign-off, pull request review)?

What may be shown

16. Is the employer comfortable with a public page about this portal at all, and may the company be named?
17. May the other marketplaces and the inventory platforms be named, or only Ticketmaster?
18. May a capture of the Shader appear with a synthetic venue, given that it shows a tool for planning purchases on a marketplace? This carries the same terms-of-use question as the extension's page.
19. Should the page mention buying accounts, payment cards, proxies, queue tracking, or competitor analysis at all? My suggestion is no.
20. Should the page mention the login fingerprinting and page-visit tracking? My suggestion is no.
21. Can you get a demo account on staging with scrubbed data, or would a mocked single screen be easier?

---

## Other observations

These fall outside the ten sections but affect the write-up or deserve attention.

1. **The working tree cannot save rules.** An uncommitted edit in the Shader's rules panel comments out the real save and substitutes a fake success, so the screen says "saved" and sends nothing. Three debug log lines sit beside it, one of which runs once per seat per redraw. It looks like someone debugging seat matching without writing to production. It should not be committed as it is.
2. **The Offers routes have no route guard.** Every other screen is wrapped in the permission check. The Offers pages are not, so they render for anyone who knows the address. Whether data loads without a token depends on the backend.
3. **Payment card data in the browser.** The Accounts and Puller screens display card expiry dates and security codes in clear text, and Accounts can copy and export them to a spreadsheet. Sentry session replay is enabled across the app, so these screens may be recorded unless replay masking covers them. This is worth raising with the team regardless of the portfolio.
4. **Proxy credentials reach the browser.** Code in the Onsale screen reads a proxy password from an API response and sends it back in a request header. That path is no longer reachable, but the same API call still runs on the Settings page, which implies the response includes credentials.
5. **The static site is public.** The bundle that anyone can download contains the IP lookup key, internal hostnames, the company's seller IDs, staff names, Slack channel names, and the flagged venue list.
6. **Client-side only controls.** Role checks, the junior pricer's hidden cost and margin, and the price guards are all enforced in the browser.
7. **Defects visible by reading**, which an interviewer who opened the code might find: a failed price save discards the user's edits; a "revert" on failed broadcast that restores nothing; a second stop switch in the Shader that sends the old value and is hidden by a misspelled prop; a delete-all action sent as a read request with no confirmation; user deletion that removes the row on screen even when the call fails; a buyer tier option that never matches because of a stray space.
8. **Build pipeline.** Every Cloud Build step is allowed to fail, so a broken build can report success.
9. **Dependency hygiene.** Nine declared libraries are unused, five date libraries are in use, and package managers are listed as runtime dependencies.
10. **How this differs from the extension's assumptions.** The extension's report guessed that rules were authored by "a manager or pricer". This repo confirms it is the holder of a map permission, and shows that the three filter flags the extension ignores are applied here at save time.
