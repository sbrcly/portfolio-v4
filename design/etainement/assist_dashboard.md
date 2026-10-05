# Portfolio discovery: Assist dashboard (live telemetry monitor)

Prepared 2026-10-05 from a read-only pass over this repository: every file under `src/`, the Firebase and build configuration, the functions folder, the CI workflow, the readme, and the full git history of `main`. Nothing was built, installed, or changed. This report is working material for a portfolio write-up and is not meant to be published as is.

Sources outside this repo. To place the dashboard in the wider system I also read the extension's discovery report and looked briefly at how the extension sends its records. Where a statement rests on the extension's repo instead of this one, it says so.

Naming used in this report. Ticketmaster is named because the public portfolio already names it. The Firebase project, the hosting address, the portal hostnames in the sidebar, collection names, and record field names are described but never reproduced. The tab labels are quoted as they appear on screen, including two abbreviations ("ECD" and "PTI") that the repo never expands.

One-line summary of the findings. This is a small, read-only React app that turns the extension's purchase telemetry into live tables by listening to Firestore. Its one piece of real modelling is the waiting room: it rebuilds each buyer's current queue state from a stream of position records and rolls it up per buyer and per event around the top of the hour. It has no server side of its own, writes nothing back, and does not read the warehouse.

---

## 1. What it is

The Assist dashboard is an internal single-page web app that shows, as it happens, what the brokerage's buyers are doing on Ticketmaster during an on-sale. The Assist Chrome extension records each step of a purchase (event page load, sign-in, waiting room position, cart attempt, checkout error, order confirmation) and sends a copy to a Firebase-backed endpoint, which stores each record as a document in Firestore. The dashboard signs a viewer in with Google, attaches a real-time listener to one collection at a time, and renders the newest records as rows in a table, one tab per record type. Three of the nine tabs are derived views of the waiting room: the latest position per buyer, account, and event, a roll-up per buyer, and a roll-up per event. A keyword filter and a pause button are the only controls. It is hosted as a static site on Firebase Hosting.

Who watches it, from the code: someone following many buyers at once. The per-event view counts active queues and lists which buyers are in them, the per-buyer view shows how many queues each buyer has open, and the cart tab shows success or failure with seat and cost. That reads as a manager or on-sale lead, and probably Scott himself as the extension's developer, since every row carries the extension version and a tab identifier. The repo cannot say who actually uses it or how many people.

What they can do with what they see: watch, filter, and pause. Nothing else. The cart tab draws Approve and Decline buttons on every row, but they have no click handler today and had none before the 2026 refactor.

What it ingests:

- The extension's records, through Firestore. Six of the seven collections it reads match record names the extension sends today.
- One collection the extension does not send: a log of account verification code attempts (the "ECD Logs" tab). Nothing in the extension's source produces it, so it comes from another service, most likely the one that handles verification codes.
- Not the warehouse. There is no BigQuery client, no HTTP call, and no API of any kind in the source.

What it writes back: nothing. The current source contains no Firestore write, and a search of the history for write calls found none. The functions folder holds one scheduled function that would have written aggregates, but its body is a stub that returns immediately.

---

## 2. Architecture

### Parts

| Part | File | What it does |
|---|---|---|
| App shell | `src/App.jsx` (216 lines) | Holds all state. Owns the live listener, the hourly queue fetch, the filter, the pause switch, and the tab bar. |
| Collection config | `src/data.js` (447 lines) | Declares the nine tabs: which collection each reads and which columns it shows. Also the four sidebar links. |
| Table | `src/components/Table.jsx` | Chooses raw rows or one of the queue roll-ups, then renders rows. Keeps a small cache of event name and venue per event. |
| Row renderer | `src/components/TableRow.jsx` | Data-driven: default formatting per field, with per-tab overrides for seat ranges, cost, links, and the buyer tooltip. |
| Queue aggregation | `src/utils/queueAggregators.js`, `src/utils/queueHelpers.js` (220 lines) | Pure functions: latest record per buyer, account, and event; roll-up per buyer; roll-up per event; time-window tests. |
| Formatters | `src/utils/formatters.js` | Timestamp cleanup, name shortening, guards against malformed venue and event values. |
| Firebase setup | `src/config/` | Initialises the app, auth, and Firestore with the web config. |
| Scheduled function | `functions/index.js` | A five-minute schedule whose body is a no-op. See section 4.1. |

There is no router, no state library, no backend of its own, and no charting. The whole app is 1,325 lines of JavaScript and JSX in 16 files, plus 421 lines of CSS.

### The real-time mechanism

Firestore snapshot listeners, pushed over the SDK's own streaming connection. No polling and no websockets written by hand.

1. When a tab is selected, the app opens one query on that tab's collection: records uploaded since the start of the previous UTC day, newest first, capped at 1,500.
2. Firestore delivers the initial result, then a new snapshot every time a matching document is added, changed, or removed.
3. On each snapshot the app maps every document to a plain object, compares document IDs with the previous snapshot, and prepends the new ones to the list on screen.
4. Switching tabs or pausing detaches the listener. Resuming or switching back opens a fresh one and reads the window again.

One listener is open at a time. The three queue tabs read the same collection but are treated as separate tabs, so moving between them detaches and re-reads.

There is one exception to "no polling". Once an hour, at three minutes past, the app runs a one-off fetch of waiting room records uploaded between a quarter to the hour and three minutes past it, capped at 5,000. It clears that data at a quarter to the next hour. This feeds one column, the average queue position per event. The window is built around the fact that on-sales start on the hour: the waiting room opens beforehand and positions are handed out at the top of the hour. That reading is mine, from the shape of the code, and Scott should confirm it.

### How records are shaped for display

- Most tabs show records as they arrive, one row per document, columns chosen by the config, with light formatting: the timestamp loses its separators, the buyer is shown as the name part of their portal email, and odd values are blanked instead of crashing the row.
- Seat information arrives as parallel lists (section, row, low seat, high seat) and is rendered one line per group. A cart with no section and row and a zero seat is shown as general admission.
- The waiting room tabs are computed in the browser on every snapshot. See section 4.3.

### Data model, at the entity level

There is no schema file. The model below is read from the column config and the aggregation code.

| Entity | How it appears |
|---|---|
| Buyer | The portal user. A string on every record, shown without its domain. |
| Marketplace account | The email the buyer is signed into the marketplace with. Present on most records. |
| Event | An identifier, plus name and venue where the page offered them. |
| Browser tab | A numeric tab identifier from the buyer's browser. The only thing that ties one record to another within a purchase. |
| Record | One immutable document per thing that happened. Seven kinds: page load, sign-in, queue position, cart attempt, confirmation, checkout error, verification code attempt. Every record carries a server upload time and, for extension records, the extension version. |

There is no session or purchase entity. Nothing links a buyer's page load to their queue, their cart, and their confirmation except matching buyer, account, event, and tab identifier by eye. The same concept is also spelled differently from one record type to the next: the event identifier has three spellings and the tab identifier three. One collection name contains a typo that both the extension and the dashboard now depend on.

### Retention and cleanup

None in this repo. The dashboard only ever asks for the last one to two days, so older documents are invisible to it, but nothing here deletes them: no time-to-live policy, no cleanup function, no delete call. Whether a policy exists in the Firebase console cannot be seen from the repo.

### Auth

Google sign-in through Firebase Auth, by popup. The client has no allow-list, no domain check, and no roles. Signing in only decides whether the table is drawn. The actual access control is the Firestore security rules, and the live rules exist only in the Firebase console. The repo contains a starter rules file written during the 2026 refactor (signed-in users may read, nobody may write from a client), with a header saying it is not wired into the deploy and must be reconciled with the console first.

### Hosting and deploy

Firebase Hosting serves the Vite build as static files with a catch-all rewrite to the index page. A GitHub Actions workflow builds on every push and pull request to `main`, and deploys to the live channel on push. There is no test step and no staging gate. A `staging` branch exists but is two commits off an early point in history and 151 commits behind.

---

## 3. What a manager sees

A dark page with a row of nine tab buttons, a keyword filter, a pause button, and a wide table. A sidebar toggle shows four links: three pages of the pricing portal and the dashboard itself. The app opens on the Cart tab.

| Tab | One line |
|---|---|
| Page Load | Each time a buyer opens an event page: time, buyer, event name and ID, venue, account email, IP address, tab identifier, extension version. |
| Sign In | Each marketplace sign-in: time, buyer, event ID, account email, IP address, tab identifier, version. |
| Queue | The latest waiting room record for each combination of buyer, account, and event: users ahead, queue position, event, venue. |
| Queue: Users | One row per buyer: queues active now, and over the last 30 minutes the count, lowest, highest, and average position, plus the lowest users-ahead figure this hour. |
| Queue: Events | One row per event with activity in the last 30 minutes: active queues (hover to see which buyers and how many each), average starting position from the hourly window, the same 30-minute statistics, and lowest users ahead. |
| Cart | Each add-to-cart attempt: success or failure, error message, section, row and seat range, cost, cart type, account, IP address, and the inert Approve and Decline buttons. |
| Confirmation | Each completed order: order number, quantity, section, row and seat range, cost, cart type, account, IP address. |
| Checkout Errors | Each checkout error dialog: message, account, event ID, a link to the event page, IP address, version. |
| ECD Logs | Verification code attempts: account email, buyer, IP address, phone line, attempt number, and the codes. Not from the extension. |

What the brief asked about, answered directly:

- Who is on which page. Not as a live roster. Page Load is a log of page opens, newest first. There is no presence model and nothing marks a buyer as having left.
- Queue positions. Yes, and this is the most developed part: three views, two of them aggregated.
- Carts and purchases. Yes, as logs.
- Errors. Cart failures inline on the Cart tab, and checkout errors on their own tab. Two earlier error tabs were removed in April 2025.
- Anything else. The verification code log. A keyword filter that searches every field of every loaded row except the stored cookie string. Pause.

Tabs that used to exist: "Event Codes" (removed December 2024), "PTI Errors" (named "Errors" until June 2023) and "Suspended Errors" (both removed April 2025, when "Checkout Errors" replaced them).

### How live each view is

The path is: the extension notices something on the page, messages its worker, the worker posts the record to the Firebase-backed endpoint, the endpoint writes a document, and Firestore pushes it to every dashboard listening on that collection. The dashboard adds no delay of its own: no polling interval, no batching, no debounce. A Firestore listener normally delivers within a second or two of the write, but the repo contains no measurement, so the write-up should not quote a figure. The extension's records carry both the buyer's local sent time and the server's upload time, so the first half of the path could be measured from stored data. The second half, document to screen, is not recorded anywhere.

Per view:

| View | Freshness |
|---|---|
| Page Load, Sign In, Cart, Confirmation, Checkout Errors, ECD Logs | Push. A row appears when its document is written. |
| Queue | Push, then reduced to the latest record per buyer, account, and event. |
| Queue: Users, Queue: Events | Recomputed on every snapshot. "Active" means a record in the last 3 minutes. Statistics cover the last 30 minutes. Lowest users ahead covers the current clock hour. |
| Average queue position (one column of Queue: Events) | Fetched once an hour at three minutes past, cleared at a quarter to. Empty outside that span. |

### How stale data is handled

- By time windows on the queue views, as above. An event with nothing in the last 30 minutes drops off Queue: Events (commit "hide old events", October 2024).
- The windows are only re-evaluated when a new snapshot arrives. There is no clock tick. During an on-sale records arrive constantly so this does not matter, but on a quiet tab an "active" count will sit unchanged after the 3 minutes have passed.
- The windows compare the server's upload time with the viewer's own clock, so a viewer whose clock is off sees wrong active counts.
- The lower bound of the query (start of the previous UTC day) is fixed when the listener opens and does not move while the tab stays open.
- The list on screen only grows. New rows are prepended and nothing is trimmed until the tab is switched or the feed is paused and resumed, so a long session holds more than the 1,500 the query asks for.
- There is no "last updated" marker, no connection indicator, and no error callback on the listener. A dropped connection or a permission error looks the same as a quiet day.
- Pause freezes the screen by detaching the listener. Tab buttons are disabled while paused.
- Every extension record shows its version, which is how a manager or developer can spot a buyer on an old build.

---

## 4. The hard parts

Evidence note that applies to all of these: the repo has no tests and no test tooling. Evidence of deliberate work is in commit messages, in the comments left by the April 2026 refactor, and in the difference between the code before and after it.

### 4.1 Read cost and fan-out on a live store

Firestore bills per document read, and a listener's first result counts every document in it. The shape here is: every viewer, on every tab switch and every resume, reads up to 1,500 documents. After that, every new record costs one read per viewer listening on that collection. The three queue tabs share a collection but each switch between them re-reads it. On top of that, every open dashboard runs the hourly fetch of up to 5,000 queue documents whether or not anyone is looking at a queue tab.

The history shows the cap being tuned by hand: no limit at first, a limit added in the first week ("added query limit", March 2023), cut to 500 later that month ("reduced limit to 500"), then raised to 1,000 and 1,500 on the same day in February 2024. That is a developer trading cost and render time against rows falling off the bottom during a busy sale.

The attempted fix was server-side aggregation: a scheduled Cloud Function that would compute the queue roll-ups every five minutes and write them to a summary collection for the dashboard to read. It was never finished. The refactor's comment records that the unfinished version read the whole queue collection every five minutes and wrote nothing, and replaced it with an early return. The roll-ups still run in each viewer's browser.

Also fixed in the refactor: before April 2026 the filter text was a dependency of the listener, so every keystroke in the filter box tore the listener down and opened a new one, re-reading the window each time.

A senior engineer would ask: what does a busy day cost in reads, why not process only the changed documents from each snapshot, why not one shared listener for the three queue views, why not serve a summary document instead of raw records, and is Firestore the right store for an append-only event stream at all. Evidence: good for the tuning and the keystroke fix, and honest about the abandoned function. No cost figure exists in the repo.

### 4.2 Ordering and deduplication

Records are ordered by the upload time stamped at ingestion, not by the time the buyer's browser says it sent them. The extension does not set the upload time (its source never mentions it), so this is arrival order on the server. A record delayed in a buyer's browser therefore sorts by when it landed, which is the simple and defensible choice for a live feed, but it means the dashboard never shows true event order when a buyer's connection stalls. The very first version displayed the browser's sent time and later versions dropped it.

Timestamps are stored as text in a sortable format and compared as text, which works as long as every writer uses the same format and precision.

Deduplication between snapshots is by document ID: anything not in the previous snapshot is new. Nothing deduplicates at the record level. The extension retries a failed message up to three times (from the extension report), so the same cart or confirmation could land as two documents and would show as two rows. On the queue tabs this is hidden, because only the latest record per buyer, account, and event survives.

Questions: why server time, what happens on a retry, how would you make ingestion idempotent, what breaks if one writer changes the timestamp format. Evidence: thin. The behaviour is consistent, but nothing in the repo shows the retry case being considered.

### 4.3 Rebuilding each buyer's queue state from a stream

The waiting room produces a stream of position records per browser tab. From what I saw of the extension, it appears to send one each time the users-ahead number on the page changes. The dashboard has to turn that stream into "who is in which queue right now, and how well placed are they".

The approach, all in pure functions:

1. Group by buyer, account, and event, and keep the newest record of each group. That is the session key.
2. Per buyer: count groups seen in the last 3 minutes as active queues. Over the last 30 minutes, track count, lowest, highest, and average position. Track the lowest users-ahead figure within the current hour.
3. Per event: the same, plus a per-buyer count for the hover list, plus the average starting position from the hourly window.
4. Treat the waiting room's "still calculating" placeholder as no position, and keep zeros out of the lowest and the average.

This took the most iteration of anything in the repo. March 2023 has about twenty commits on it, with messages such as "added queue group functionality", "fixed queue grouping", "fixed queue: user starting nums", "actually fixed queue: users", "fixed lowestLast30", and "fixed avglast30 when 0". It was revisited in May 2024 ("added avg queue pos for queue events", "updated all users to use active queues"), September 2024 ("limit lowest users ahead to current hour"), and October 2024 ("hide old events").

Honest limits. The session key leaves out the tab identifier, so one buyer with two tabs on the same account and event collapses into one queue. And reconstruction stops at the waiting room. Nothing joins a buyer's page load, queue, cart, and confirmation into one journey, so there is no funnel view.

Questions: why those three window lengths, how do you know a queue ended as opposed to the tab closing, why is the key not the tab, how would you test this. Evidence: strong in the commit history. The 2026 refactor pulled the logic out of a component into standalone functions, which makes it testable, but no tests were written.

### 4.4 A scheduler built around the on-sale hour

The hourly window (fetch at three minutes past, clear at a quarter to) encodes domain knowledge in a timer. The original implementation nested timeouts inside intervals, never cleared the intervals, and, when the page was opened outside the fetch span, returned early before the clearing step was ever scheduled. The refactor replaced it with one helper that computes the time to the next target minute and re-arms itself, with every timer cleaned up when the component goes away.

Questions: what happens when the laptop sleeps through a target minute, what about on-sales that start at half past, why is this in every browser and not computed once on a server. Evidence: the before and after are both in history. The half-past case is not handled.

### 4.5 A record schema that kept moving

The dashboard reads documents written by whichever extension build each buyer happens to be running, and builds are sideloaded, so several versions are live at once. The commit log is a record of chasing that: "restructured cart for v6.0.6", "added 6.0.7 params", "added 6.0.8", "new cart format accepts all new ext versions", "added seats to conf v >= 6.1.0", "added 1.0.3", "added 1.0.4", "fixed issue with new extension build", "fix quantity format for new extension", and finally "removed version restrictions" in October 2023, when per-version branches gave way to tolerant rendering.

What is left is defensive formatting: seat fields that may or may not be lists ("fixed error when sec/row/seat is not an array"), a venue that is sometimes an object, event identifiers that are sometimes a long junk string and are blanked, quantities that are sometimes a list. The inconsistent field spellings across record types are the same problem frozen in place.

Questions: why no schema version on the record, why not validate at ingestion, how do you change a field without breaking the viewer. Evidence: strong, about fifteen commits. There is no contract or shared type between the extension and the dashboard.

### 4.6 Rendering a long, fast-moving table

Up to 1,500 rows of up to 15 columns in a plain HTML table, growing through the session, with no pagination and no virtualisation. Rows are memoised so an unchanged row is not re-rendered when a new one arrives (the idea goes back to "added errors and made rows static", March 2023). The filter scans every field of every row on each keystroke with no debounce. The comparison that finds new documents is quadratic in the window size. Row virtualisation was considered in the 2026 refactor and deferred because it needs the table rebuilt as a grid.

Questions: at what row count does it stutter, why not virtualise, why re-map the whole snapshot when the SDK reports exactly which documents changed. Evidence: memoisation and the keystroke fix are real. No measurement exists.

### 4.7 Surfacing errors, in two senses

Buyers' errors are the product: failed carts with their message, checkout error dialogs with a link back to the event, and at earlier times two more error categories. The history shows the error tabs being added, renamed, and replaced as the business's idea of which failures mattered changed.

The dashboard's own errors are not surfaced at all. The live listener has no error callback, the hourly fetch logs to the console, and there is no banner for "disconnected" or "permission denied". A manager cannot tell a broken feed from a quiet one.

Questions: how does a manager know the feed is healthy, what alerts on a spike of failures, why does a human have to be watching. Evidence: the first sense is well supported by history. The second is a gap.

### 4.8 Sensitive data behind a thin client gate

The tables show account emails, IP addresses, order numbers, costs, and verification codes. The client's sign-in decides only whether the table is drawn. The listener is opened before sign-in and independently of it, and whole documents are downloaded, including fields no column shows. Whether that is safe depends entirely on rules that live in the console and not in version control.

Questions: who can read this data today, how would you prove it, why are rules not deployed from the repo, why does the client download fields it never displays. Evidence: the starter rules file and its header show the problem was recognised in 2026. It was not closed. See "Other observations".

### 4.9 What was rebuilt

- April 2023: the single-file app was split into components ("component breakdown", "file restructure and rendering fix"), followed by about thirty styling commits.
- October 2024: the tab and column definitions moved out of the app into a config file.
- April 2026: one large commit, "code optimization". Create React App replaced by Vite. Firebase's compatibility SDK replaced by the modular one. The scheduler rewritten. A 366-line row component full of per-tab branches replaced by a data-driven renderer. Queue aggregation extracted into pure functions. Direct DOM manipulation for active buttons and the sidebar replaced by state. The dependency lockfile shrank by about 30,000 lines. CI moved to current actions and Node 22 and began building pull requests without deploying them.

Questions: what did the rewrite break, and how would you know with no tests. That is a fair question here. See the first item under "Other observations".

---

## 5. Timeline and scale

First commit 2023-02-23. Last commit 2026-04-27. 154 commits on `main`, all by Scott under two spellings of his git name. No merges. About 38 months end to end, but the work is front-loaded: 107 of the 154 commits fall in the first ten weeks.

Phases, read from the history:

1. February 2023. Create React App scaffold, Firebase Hosting and CI on day one, then a single table of page-load records. The first version follows the standard Firebase chat example closely (sign in with Google, a live list, rows styled as sent or received). 12 commits.
2. March 2023. The core build, 67 commits. Tabs, the three queue views and their many fixes, cart and confirmation with seat details, errors, pause, the sidebar, and a run of changes to follow extension versions 6.0.6 through 6.1.0.
3. April 2023. Component breakdown, the first filter, and styling. 28 commits.
4. May to October 2023. Maintenance against new extension builds, an error tab renamed, a keyword filter, a second error tab, and the end of per-version branches. 19 commits.
5. 2024. Sparse but meaningful, 24 commits: the limit raised twice, the verification log tab, average queue position and the hourly window, active queues, old events hidden, config extracted. The unfinished scheduled function dates from June 2024 by file dates, though it was not committed until 2026.
6. April 2025. One commit swaps two error tabs for Checkout Errors.
7. April 2026. The refactor and a CI fix. Nothing since.

One thing the history settles for the extension's write-up: this dashboard was already tracking extension versions 6.0.6 to 6.1.0 in March 2023 and 1.0.3 and 1.0.4 later that year. The current extension repo starts in June 2024. So an earlier generation of the extension was sending these same records at least 16 months before that repo existed, which supports the extension report's guess that its tracking code was ported from earlier work.

Numbers the repo supports:

| Measure | Value |
|---|---|
| JavaScript and JSX source | 1,325 lines in 16 files (peak was 1,627 in November 2024) |
| CSS | 421 lines in 8 files |
| Tabs | 9, over 7 collections |
| Tabs at the peak | 11 (October 2023 to December 2024) |
| Live window per tab | Up to 1,500 documents, from the start of the previous UTC day |
| Hourly queue window | 18 minutes, up to 5,000 documents |
| Queue windows | 3 minutes (active), 30 minutes (statistics), current hour (lowest users ahead) |
| Extension versions named in commit messages | 7 |
| Source size over time | 145 lines (February 2023), about 900 (late March 2023), about 1,470 (April 2023), 1,627 (November 2024), 1,325 now |
| Production bundle | About 580 KB of JavaScript before compression, in the last local build |
| Tests | 0 |

Peak concurrent buyers and records per on-sale: the repo cannot support a figure for either. The only hints are ceilings chosen by the developer. The 5,000 cap on an 18-minute queue window says Scott expected a single on-sale hour to produce queue records in the thousands. The live cap rising from 500 to 1,500 in February 2024 says 500 and then 1,000 rows were not enough to cover the period a viewer cared about. Neither is a measurement. Real figures would come from counting documents per hour in Firestore or rows in the warehouse.

Also not supportable from the repo: number of viewers, number of buyers, read costs, latency, uptime.

---

## 6. Stack

- Language: JavaScript with ES modules, JSX. No TypeScript.
- UI: React 18.2, function components and hooks. No router, no state library, no component library.
- Data: Firebase JavaScript SDK 9, modular API. Firestore listeners and one-off queries. Firebase Auth with the Google provider. `react-firebase-hooks` for auth state only.
- Other libraries: `lodash` (one function, for grouping). Font Awesome 6.3 from a public CDN for icons.
- Styling: plain CSS, one file per component, dark theme.
- Build: Vite 6.4 with the React plugin. Output goes to `build`.
- Hosting: Firebase Hosting, static, single-page rewrite.
- Functions: Node 18, `firebase-functions` 5 and `firebase-admin` 12. One scheduled function, stubbed. ESLint with the Google config applies to this folder only.
- CI and deploy: GitHub Actions on Node 22. Install, build, and on push to `main` deploy to the live hosting channel using a service account stored as a repository secret.
- Lint and tests for the app: none.
- Environments: one Firebase project. No staging project, no emulator configuration, no environment files.
- Security rules and indexes: files exist in the repo but the deploy configuration does not reference them.

The readme is the untouched Create React App template and describes commands that no longer exist. The web manifest still has the template's placeholder names. Neither should be quoted.

---

## 7. What can be shown

No screenshot, recording, or diagram exists in the repo. The only image is the favicon.

### Can it be captured as it is?

Not safely. Every cell on every tab is real: buyer names, marketplace account emails, IP addresses, event names, venues, seat locations, costs, order numbers, phone lines, and verification codes. Blurring would leave nothing to look at. The sidebar links show the portal's hostname and the browser's address bar shows the Firebase project name.

### What a demo mode would need

The app has no seam for it today. It talks to Firestore directly from two effects in the app shell, with no data layer in between. Three routes, smallest change first:

1. Firebase emulators. Add a flag that points Firestore and Auth at the local emulator suite, and seed the emulator. About ten lines in the Firebase setup file and no change to the app's logic. The capture then shows the real code path.
2. A separate demo Firebase project with the same collections, seeded by a script. No code change beyond swapping the config, and it could be hosted as a public live demo with read-only rules.
3. An in-app fixture feed that replaces the two effects with a timer emitting fake records. No Firebase needed, but it no longer demonstrates the listener.

Whichever route is used, the seed cannot be a static file. The queue views are defined relative to now (3 minutes, 30 minutes, the current hour, and the window around the top of the hour), so a fixed data set shows empty queue tabs three minutes after it is loaded. The demo needs a small replayer that writes a synthetic on-sale in real time: a few dozen invented buyers opening an event page, entering a waiting room shortly before the hour, receiving positions at the hour, counting down, and then some reaching carts, some failing, and a few confirming.

Fields that must be invented: buyer names, account emails, IP addresses (use documentation ranges), event names and identifiers, venues, sections, rows and seats, costs, order numbers, extension versions (harmless, but invent them anyway). Leave the verification log tab out of any capture entirely. Hide or replace the sidebar links. Either remove the inert Approve and Decline buttons from the demo or be ready to explain them.

### Captures worth making, with seeded data

- Queue: Events during a replayed on-sale, with the buyer hover list open. This is the one screen that shows the dashboard doing something a spreadsheet could not.
- Queue: Users at the same moment.
- Cart, with a mix of successes and failures filling in live. A short recording is better than a still, since the point is that rows arrive on their own.
- The filter narrowing a busy tab to one buyer.

### Diagrams the code supports

1. The telemetry funnel from page to screen: marketplace page, extension content script, extension worker, Firebase-backed endpoint, Firestore, listener, reduce step, table. Mark where each timestamp is taken.
2. The two destinations: the same record going to the warehouse for history and to Firestore for the live view, with the dashboard reading only the second.
3. The queue roll-up: raw position records, to the latest per buyer, account, and event, to per-buyer and per-event rows, with the three time windows drawn on a timeline.
4. The on-sale hour as a clock face: waiting room opens, on-sale at the hour, fetch at three past, clear at a quarter to.
5. Fan-out and read cost: one record written, one read per listening viewer, and the cost of a tab switch.
6. Before and after of the 2026 refactor, if the write-up wants a maintenance story.

### Prose only, or left out

- The verification code log, and anything about phone lines or codes.
- IP address columns and what they are for.
- The fact that page-load records include a stored cookie string.
- The Firebase project name, hosting address, web config, collection names, and field names. `src/config/config.js`, `src/data.js`, and `.firebaserc` should never appear in an image.
- Real event names, venues, prices, and order numbers.

---

## 8. Claims audit

The public portfolio says nothing about this project, so there is nothing to mark true or false. The accurate one-line description is:

> A read-only, real-time web dashboard that streams the Assist extension's purchase telemetry (page loads, sign-ins, waiting room positions, carts, confirmations, and checkout errors) from Firestore into live tables, with per-buyer and per-event waiting room roll-ups for watching an on-sale as it happens.

Wording the code would support:

- "Real-time" or "live". True for every tab. It is push, not polling.
- "Rebuilds each buyer's queue position from the event stream." True.
- "Built on Firestore listeners, React, and Firebase Hosting, with deploy on push." True.
- "Rewritten in 2026 from Create React App to Vite and the modular Firebase SDK." True.

Wording the code would not support, listed now so it is not written later:

- "Shows who is on which page right now." It shows a log of page loads. There is no presence.
- "Tracks each purchase from page to confirmation" or any funnel or session claim. Records are not joined across types.
- "Managers approve purchases from the dashboard." The buttons do nothing.
- "Server-side aggregation" or "Cloud Functions pipeline." The function is a stub. Aggregation runs in the browser.
- "Reads from the warehouse." It does not.
- "Alerts" or "monitoring" in the sense of notifying anyone. A person has to be looking.
- Any latency figure, any count of buyers or records, any claim about handling a given load. None is measured.
- "Charts" or "analytics." It is tables only.

---

## 9. The system picture

The dashboard is the last box in the flow and a leaf. Nothing depends on it and nothing reads from it.

1. A buyer does something on a marketplace page.
2. The extension's content script detects it and messages the extension's worker.
3. The worker sends the record to two places: a warehouse ingestion endpoint that lands it in BigQuery, and a Firebase-backed endpoint that takes the record's type from the request path. The second send is fire and forget: one attempt, no retry, failure logged to a console that production builds strip. (Steps 2 and 3 are from the extension's repo.)
4. The Firebase-backed endpoint stamps an upload time and writes one document to the collection named for the record type.
5. Firestore pushes the document to every dashboard with a listener on that collection.
6. The dashboard renders it, and for queue records recomputes the roll-ups.

Two things follow. The warehouse is the system of record and the pricing portal's world. Firestore is a parallel, short-lived copy whose only known reader is this dashboard. And the extension's readme calls the Firebase copy "alternative or backup storage", but this repo shows it is the live feed: the dashboard's tabs were being kept in step with the extension's record types as late as April 2025.

Coverage against what the extension sends today: page load, sign-in, queue position, cart, confirmation, and checkout error all have tabs. The extension's block-page record and its bonus record have none. In the other direction, the verification log has a tab but no sender in the extension.

What is unknown from here:

- The Firebase-backed endpoint itself. Its code is in neither repo. Where it runs, whether it authenticates callers, whether it validates anything, and how it stamps time are all unseen.
- What produces the verification log.
- The live security rules, and therefore who can read these collections.
- Whether old documents are ever deleted.
- Whether the scheduled function was ever deployed, and whether its schedule still exists.
- Whether the dashboard is still used. The last functional change was April 2025 and the last deploy-triggering commit April 2026.
- Whether anything else reads these Firestore collections.
- The parent folder of this repo holds an empty Node server stub dated two weeks before the first commit, under the name "assist_live". It may be an abandoned first approach.

---

## 10. Questions only Scott can answer

Users and outcomes

1. Who watches the dashboard: managers, an on-sale lead, Scott, the buyers themselves? How many people, and is it still open during on-sales today?
2. What do they do with what they see? For example, moving buyers between events, spotting a blocked account, telling a buyer to stop. One concrete story would carry the write-up.
3. Is the reading of the hourly window correct: waiting rooms open before the hour, positions are assigned at the hour, and the average is meant to show how the team drew?
4. Roughly how many buyers are in queues during a large on-sale, and how many records does one produce? Can a count per hour be pulled from Firestore or the warehouse for one representative sale?
5. Were the Approve and Decline buttons a planned feature? What happened to it, and did it move to the distribution portal the extension decorates?

System facts the repo cannot settle

6. Where does the Firebase-backed ingestion endpoint live, who wrote it, and does it stamp the upload time?
7. What writes the verification log, and what does "ECD" stand for? What did "PTI" stand for?
8. What are the live Firestore rules? Is reading restricted to signed-in users, to a company domain, or open?
9. Is there a time-to-live or cleanup on these collections? How large have they grown?
10. Was the five-minute scheduled function ever deployed? Is it deployed now?
11. Has Firestore read cost ever been a problem in practice? The limit changes suggest something was being managed.
12. What was the extension generation numbered 6.x in March 2023, and how does it relate to the 1.0.x builds later that year and to the current repo?
13. What was the empty "assist_live" server stub?

What may be shown

14. May the dashboard be shown at all, given that it makes plain that the business runs many buyers through waiting rooms at once? This is the same publication question as for the extension, seen from the manager's side.
15. If yes: a seeded recording, a public live demo on a separate Firebase project, or stills only?
16. May the write-up mention that IP addresses and verification codes are tracked, or should it stay with page loads, queues, carts, and confirmations?
17. Should the 2026 refactor be described as assisted by an AI coding tool? The single large commit and its comments read that way, and the portfolio should be straight about it either way.

Positioning

18. This is early work: the first commits follow a tutorial pattern and the code was built while learning React. Should the portfolio present it as a standalone project, or as the monitoring end of the extension's story with the queue reconstruction as its one highlighted idea? The evidence fits the second better.

---

## Other observations

These fall outside the ten sections but affect the write-up or deserve Scott's attention.

1. Two columns probably render blank since the April 2026 refactor. The old row component printed fixed fields per tab and ignored the column names in the config. The new one reads the config. On the Queue tab the config's name for the queue position column does not match the field the queue records and the aggregation code use, and on Queue: Events the config's spelling of the event identifier does not match the spelling the roll-up produces. If the live page shows an empty "Queue Position" column on Queue and an empty "Event ID" column on Queue: Events, this is why, and each is a one-word fix in `src/data.js`. I could not confirm against live data.
2. The live listener starts before sign-in and is not restarted by it. If the rules require a signed-in user, the first listener is refused, nothing reports the error, and after signing in the table stays empty until the viewer switches tabs or pauses and resumes. If instead data appears immediately after a fresh sign-in, that suggests the rules allow unauthenticated reads, which would be the more serious finding given what the collections hold. Either way it is worth five minutes with the browser's network panel while signed out.
3. Whole documents reach every viewer's browser, including the stored marketplace cookie string on page-load records. The filter is written to skip that field, so its presence was known. If the dashboard does not need it, the endpoint could store it elsewhere or not at all.
4. The hourly queue fetch runs on every open dashboard regardless of the tab in view and regardless of sign-in state. It is up to 5,000 reads per open browser per hour for one column.
5. The Firebase web config is committed in source. For a web app that is normal and not a secret by design, but it means security rests wholly on the rules in item 2. Deploying rules from the repo, after reconciling with the console, would put that under review.
6. If the scheduled function is deployed in its earlier form anywhere, it reads an entire collection every five minutes for no result. Worth checking the console and deleting it.
7. Deploys go straight to live on every push to `main` with no tests. With one developer and a read-only viewer this has been fine, and item 1 is the kind of thing it lets through.
8. The readme and web manifest are template leftovers. If the repo is ever linked from the portfolio, both need replacing first.
9. This session did not contain the earlier "purpose and system context" text the brief refers to. The rules and output path were taken from the extension discovery brief, and the system context from the extension's report. If that text said something that changes the emphasis here, the affected sections are 1 and 9.
