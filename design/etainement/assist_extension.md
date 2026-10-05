# Portfolio discovery: Etainement Assist (Chrome extension)

Prepared 2026-10-05 from a read-only pass over this repository: every source file under `src/`, the manifest, the build configuration, the readme, and the full git history of `main`. Nothing was built, installed, or changed. This report is working material for a portfolio write-up and is not meant to be published as is.

Naming used in this report. Ticketmaster is named because the public portfolio already names it. The extension also runs on one sister ticketing brand that shares Ticketmaster's front end, and on one third-party order distribution portal. Both are named in the manifest but are left unnamed here, as the brief asks. Hostnames, endpoints, keys, table names, and payload field names are described but never reproduced.

One-line summary of the findings. The portfolio's headline claim is true, but the code shows a different and larger system than the four-step diagram describes. Roughly a third of the code paints rules onto pages. The rest tracks the whole purchase journey and sends it to a data warehouse, and helps buyers through account verification. The diagram is wrong about ports, wrong about where caching and the timer live, missing a page-world script that does the actual painting, and wrong about where purchase data goes.

---

## 1. What it is

Etainement Assist is an internal Manifest V3 Chrome extension used by the brokerage's ticket buyers while they shop on Ticketmaster and its sister brand, on both the US and Canadian sites. It does two jobs. First, it asks the pricing portal's backend which seats the business wants for the event on screen, then highlights those seats and sections on the venue map, shows the buy criteria and any manager message as on-page notes, and can put up a full-screen stop sign when buying should halt. Second, it records the purchase journey without the buyer doing anything: event page loads, waiting room position, sign-in, cart contents, failed cart attempts, checkout errors, and order confirmation, all sent to a data warehouse. It sits between three things: the pricing portal (where the buyer is logged in and where rules come from), the marketplace pages (where it reads and decorates), and a set of backend services (where the telemetry lands). It has no login of its own. It borrows the buyer's portal session from an open portal tab. A smaller part of the extension runs on a third-party order distribution portal that managers use to approve purchases, where it shades table rows by the same rules and adds a bonus button.

Who uses it, from the code: buyers (each identified by the name part of their portal email) and managers (on the distribution portal). The repo cannot say how many.

### Connected projects

None of the following has code in this repo. Each appears only as an endpoint the extension calls or a page it runs on.

| Project | What it does for the extension | Code location |
|---|---|---|
| Pricing portal, web front end | Holds the buyer's login session in page storage. The extension reads the access token from it and reloads it to force token refresh. | Elsewhere |
| Pricing portal, backend API | Returns the rule set for one event. Checks the caller's token and allows only a known extension ID. | Elsewhere |
| Warehouse ingestion endpoint | Receives named JSON records (page load, queue, sign-in, cart, checkout error, error page, confirmation, bonus) and lands them in BigQuery. | Elsewhere |
| Firebase-backed endpoint | Receives a second copy of most of the same records. The readme calls it alternative or backup storage. | Elsewhere |
| Assist API | A separate internal service. Returns verification codes for an account, account details, and tickets already bought per account per event. Stores a new password after a reset. Receives a bonus notification. | Elsewhere |
| IP and location lookup | A small cloud function, plus a public IP echo service, used to stamp records with the buyer's network location. | Elsewhere |
| Third-party order distribution portal | Not an Etainement system. The extension decorates its tables. | Third party |

`CLAUDE.md` also mentions the wider Etainement data platform (warehouse, pipelines, portal infrastructure) by name only.

---

## 2. Architecture

### Parts

Manifest version 3. Extension version at the last commit is 3.4.78. The working tree has an uncommitted bump to 3.4.79.

| Part | File | What it does |
|---|---|---|
| Service worker | `src/entry/background.js` with `src/listeners/RequestChangeTypeListener.js` | Message router for 21 message types. Auth checks against the portal tab. Toolbar badge. Per-tab purchase state. All outbound network calls to Etainement services. The listener file is misnamed: it is the worker's API client and tab-state store. |
| Portal content script | `src/entry/content.js` | Runs on the portal origin only. Answers the worker's request for auth data from the portal page's storage. Can reopen the portal's login modal. Writes the machine's monitor layout into the portal page's storage. |
| Marketplace content script | `src/entry/tm_content.js`, which starts `InitTicketmasterService` or the distribution portal service | Runs in every frame at document start on 17 hostnames. Exits immediately if no portal user is stored. Detects page type (event, checkout, confirmation, auth, queue) and starts the matching observers and parsers. |
| Page-world interceptor | `src/functions/interceptor.js` | Declared in the manifest to run in the page's own JavaScript world at document start. Wraps the page's `fetch` and `XMLHttpRequest` to copy one specific account-info response and post it to the content script. |
| Page-world map script | `src/functions/injected-script.js` | Injected by a script tag as a web-accessible resource. Receives rules by window message and does the actual painting: seat rings, section fill, price tooltips, sticky notes, stop overlay. |
| Identity iframe scripts | `src/entry/iframe_observer.js`, `src/entry/mfa_iframe_observer.js` | Run inside the marketplace's cross-origin identity iframe. Detect whether verification is by phone or email and when the code-entry screen appears. Report to the parent page by window message. |
| Popup | `src/entry/popup.jsx` (React) | One form. On a checkout tab it is pre-filled with the cart the extension captured. The buyer can correct it and submit a confirmation by hand. |
| Options page | None | |

Dead code worth knowing about: `src/popup.js` is the first prototype's popup (links out to resale marketplaces for the current event) and is no longer referenced. The manifest requests `webRequest`, `webNavigation`, and `identity` but the source never calls them.

### How the parts talk

There are no long-lived ports anywhere. No `runtime.connect`, no `onConnect`.

1. Content script, popup, or iframe script to worker: one-shot `chrome.runtime.sendMessage` with a response callback, wrapped in a helper that retries up to three times on error.
2. Worker to portal tab: `chrome.tabs.sendMessage` with a five-second timeout for auth data, and `chrome.scripting.executeScript` to read the access token straight from the portal page's storage before each rules request.
3. Isolated world to page world, same tab: `window.postMessage`. The content script posts rules to the map script. The interceptor posts captured responses to the content script, which buffers them until the main service has started.
4. Identity iframe to parent page: `window.postMessage` with explicit target origins. The parent checks `event.origin`. The parent can also ask the iframe to start watching.
5. Shared state: `chrome.storage.local`. One `storage.onChanged` listener exists, on the distribution portal, to keep bonus buttons in step across tabs.

### How a rule reaches the page

1. Someone saves rules for an event in the portal. This step is outside the repo.
2. The buyer has a portal tab open and logged in. The worker has stored the buyer's user name, and the badge is green.
3. The buyer opens an event page. The content script gets its tab ID from the worker and waits for the DOM.
4. A MutationObserver on the document body waits for the map's section layer to exist, then starts a 15-second interval. A second observer waits for the first available seat, then triggers an immediate pass. Both disconnect after firing once.
5. The content script sends the event ID to the worker.
6. The worker finds the portal tab, reads the access token out of the portal page's storage, and calls the portal backend for that event's rules with the token in a header.
7. The worker returns the response to the content script. If no portal tab is open, the request fails and the badge turns red.
8. The content script compares the new response with the previous one and with the previous seat counts. If nothing changed and this is not a forced pass, it stops here.
9. The content script posts the rules to the page-world map script.
10. The map script clears its previous marks, walks the available seats (skipping resale and accessible seats), reads each seat's ID from the React internals attached to the seat element, and marks the seats whose IDs are in the rule set. It inserts a ring around each, attaches a price tooltip using the page's own offer data, fills matching sections, and writes sticky notes with the shaded count, general-admission sections, buy criteria, and manager message. If the rule set says stop, it shows the stop overlay instead.
11. The interval repeats step 5 every 15 seconds while the tab is visible. It stops when the tab is hidden and restarts when it is shown. Panning or zooming the map triggers a repaint from the previous rules, one second after movement stops, with no network call.

The rule response carries, per event: a list of rules (seat IDs, sections, row ranges, price ranges), an on/off switch, a stop flag, buy criteria text, a message, and a maximum quantity. Three extra flags (obstructed, singles, platinum) are passed along but the map script ignores them, so that filtering must already happen on the server.

### What state lives where

| Location | What is held |
|---|---|
| Portal page storage (portal origin) | The access token, last refresh time, login modal flag. The extension reads these and writes monitor layout back. |
| `chrome.storage.local` (extension) | User name and role. A per-tab record keyed by tab ID: event ID and URL, account email and phone, IP and location, cart, manual corrections, delivery, cart ID, non-transferable flag, verification type. Bonus history. On the distribution portal, a per-event rules cache with timestamps. |
| Worker memory | Auth data cached for five minutes. A working copy of the per-tab records. Badge debounce state. |
| Content script memory (per frame) | Previous rules and seat counts for change detection. Interval and timeout IDs. A per-tab cart copy used to build the confirmation record. The buffer of captured responses. |
| Page world | Previous note text, shaded count, the tooltip element. |
| The marketplace page itself | The embedded page-data JSON, React internals on seat elements, the page's offer store, cookies. The extension reads all four. |

Sync across tabs is thin by design. Purchase state is partitioned by tab ID and deleted when the tab closes. The badge is recomputed when the active tab changes. Each tab polls for rules on its own. There is no shared rules cache on the marketplace side.

### What the existing diagram is missing

1. The page-world boundary. Rules cross from the isolated content script into the page's own world before anything is drawn. This is the most interesting boundary in the system and the diagram does not show it.
2. The auth borrow. The worker reaches into the portal tab for the token on every rules request. The portal tab must be open.
3. The telemetry path. Purchase data goes from content script to worker to two ingestion endpoints, not to the portal.
4. The Assist API, used for verification codes, account details, and purchased totals.
5. The identity iframe, a third origin inside the marketplace page with its own content scripts.
6. The interceptor, which captures a page network response at document start.
7. The distribution portal, a second surface with its own caching.

---

## 3. The hard parts

Evidence note that applies to all ten: the repo has no tests, no test tooling, and no CI configuration. Evidence of deliberate work is in commit messages, code comments, and the shape of the code. Where a section says "evidence", that is what it means.

### 3.1 Matching rules to seats on a map the site owns

The map is an SVG rendered by the site's React app. Seat elements carry no usable ID in the DOM. The history shows three matching strategies in order: seat numbers (July 2024), grid coordinates (commit "change seat shading to use grid instead of seat numbers", October 2024), and finally the site's own seat IDs (commit "use place id for seat shading", March 2025, by a second developer, followed by "make old pricing logic the backup"). The final approach reads the seat ID from the React internals attached to each element, which is only possible from the page's own world.

A senior engineer would ask: why depend on framework internals, what happens on a React upgrade, how would you know it broke, why not derive IDs from the network data instead. Evidence: strong in commit history, three deliberate changes of approach. No guard exists for the day the internals change shape. It would fail silently with zero seats shaded, and the "total shaded" note would be the only signal.

### 3.2 Timing on a single-page app that renders late

Content scripts start at document start, before the body exists. The map appears seconds later and is re-rendered on zoom. The approach is layered: wait for DOM ready before any DOM work (commit "wait for dom to finish loading", March 2026), body observers that wait for one specific element and then disconnect, a polling helper with a timeout for elements that may never come, a one-second debounce on the zoom container's style changes, a re-entrancy flag so two passes cannot overlap, and a pause while the tab is hidden. There are 21 MutationObserver sites across 11 files.

Questions: why poll every 15 seconds instead of pushing rule changes, what is the cost of a body-wide subtree observer on a page this heavy, how do you avoid observer feedback loops when you mutate the tree you are watching. Evidence: commits "prevent row flash", "wait for dom to finish loading", and a March 2025 commit fixing shading timing on the distribution portal. One honest gap: the change check compares serialized element lists, which appears to detect only a change in seat count, not which seats changed.

### 3.3 Reading the page's own network responses

Manifest V3 cannot read response bodies through the web request API. The extension instead wraps `fetch` and `XMLHttpRequest` in the page's world and copies one response. The hard part is the race: the page may make the call before the extension's main service is ready. The most recent commit (March 2026) fixed exactly this by moving the interceptor from a runtime-injected script tag to a manifest-declared page-world script at document start, and adding a buffer in the content script that is drained once the service starts. A storage fallback covers the case where the response has no email.

Questions: why not the debugger API or a declarative rule, how do you keep the wrapper from breaking the page, what does the site's content security policy allow. Evidence: good. The commit diff and the comments explain the race and the fix.

### 3.4 A cross-origin identity iframe

Account verification happens in an iframe on a different origin from the page. The parent's content script cannot read it. The approach is a content script inside the iframe (matched on the identity origin, all frames) that reports to the parent by window message with explicit target origins, and a parent that checks the sender's origin. Detection is deliberately redundant: a mutation observer, a one-second periodic check, and a 250-millisecond burst after the form is submitted. The verification channel (phone or email) is inferred from the shape of the masked value on screen when the radio buttons are gone.

Questions: why two iframe scripts doing overlapping work, how do you stop a hostile frame from spoofing the message, why polling on top of observers. Evidence: comments describe the fallback order. Two generations of iframe script coexist, which shows iteration but also unfinished cleanup.

### 3.5 Auth without owning a login

The extension has no sign-in flow. It reads the portal's token from the portal tab, treats it as valid for 55 minutes from the last refresh (one hour less a five-minute buffer), and when it is stale it reloads the portal tab so the portal's own app refreshes it. The badge is the status light: green when authenticated, red when not. The backend accepts only a known extension ID, which the manifest pins with a fixed public key so every sideloaded copy has the same ID.

Questions: what happens with no portal tab open (rules fail, badge goes red, telemetry still flows), what is the exposure of a token in page storage, why not the identity API, and does a 60-second `setInterval` survive Manifest V3 worker suspension (it does not; the check restarts whenever the worker wakes). Evidence: commits "fix auth login screen logic", "auth improvements", "background overhaul". The readme says the check runs every 30 seconds. The code says 60, with a comment calling it temporary.

### 3.6 Markup that changes under you

Most selectors target the site's test-hook attributes, and almost every one is written three ways because the site has used three spellings of that attribute over time. There are 60 distinct hook names in use and 231 selector calls. Parsers prefer the structured page-data JSON embedded in the page and fall back to scraping the DOM. The waiting-room parser handles three generations of markup. The verification dialog is found by five fallback strategies in order. Order confirmation has three layers: structured page data, DOM scrape, and finally the popup form where a human corrects it.

Questions: how do you find out a selector died, what is the fallback order and why, how much of this could come from the network layer instead. Evidence: a code comment says to prefer attribute selectors over dynamic classes. Against that, nine selectors still target generated class names that will break on the site's next build.

### 3.7 Driving forms a framework controls

In the password reset flow the extension generates a new password, fills the field, stores the password through the Assist API, and submits. Setting a field's value is not enough on a React form, so it dispatches input, change, and keyup events, re-checks the field before submitting, and clicks using a synthesized mouse-down, mouse-up, click sequence at a random point inside the button rather than a bare click call. It also fills verification codes fetched from the Assist API.

Questions: why synthesized events, what does the site do to resist this, what are the terms-of-service and security implications. Evidence: commits "update pwd reset functionality" and "update password observer to handle new phone verification popup". This is real engineering, but it is the part of the project least suited to a public page. See sections 6 and 8.

### 3.8 Performance on a busy table

The distribution portal re-renders its table often. The first version refetched rules per row. The current version scopes its observer to the table container, filters mutations to those touching the body, debounces by 300 milliseconds, groups rows by event so each event is fetched once, and caches rules in two tiers (memory, then extension storage, both valid for 30 seconds). Concurrent requests for the same event share one in-flight promise. Empty results are cached too. Counters track cache hits and API calls. Old cache entries are removed daily in batches.

Questions: why 30 seconds, why two tiers, how did you measure the improvement. Evidence: the strongest in the repo. A dedicated optimization branch, a run of commits in February and March 2025 that optimize the shading, prevent row flash, and fix its timing (their messages name the portal, so they are paraphrased here), and comments such as the one recording that cache validity was raised from 15 to 30 seconds to reduce API calls. This is also where the portfolio's "caches per event" claim is actually true.

### 3.9 Knowing when things fail

The extension reports its own environment's failures as data: the marketplace's block page (detected four ways and sent with context), purchase error dialogs with their error codes, and failed add-to-cart attempts, each with a generated reference ID shown to the buyer in a toast. The worker has global error handlers that raise a desktop notification. Messages retry three times. The portal tab message has a five-second timeout and the rules fetch a ten-second one.

Questions: where do the extension's own errors go in production, how do you tell a tracking failure from a quiet day. Evidence: commit "refactor and checkout error logging". Honest gap: most internal failures are only logged to the console, and the production build strips console calls, so they vanish.

### 3.10 Shipping updates without a store

There is no store listing and no update URL in the manifest. A release is a version bump, a build, and a zip of the output that each user loads unpacked. The pinned key keeps the extension ID stable so the backend allow-list keeps working. Every record sent to the warehouse carries the extension version, which is the only way to see who is on an old build. Version numbers moved from 2.0.0 to 3.4.78 across 64 commits, so many builds were released between commits.

Questions: how do you roll back, how do you force an update, why not a private store listing or enterprise policy. Evidence: the readme's production steps and the version stamp in the worker. Whether enterprise policy is used cannot be seen from the repo.

---

## 4. Timeline and scale

First commit 2024-06-21. Last commit 2026-03-16. 64 commits on `main` (58 plus 6 merges), about 21 months. Scott authored 52 under two git names. Two other developers and an organization account authored the other 12. Three side branches exist and all are fully merged.

Phases, read from the history:

1. June 2024. A three-commit prototype by another developer: portal auth and a links popup. About 300 lines. Version 2.0.0.
2. July to August 2024. Scott's first commit brings in the tracking structure (observers, parsers, services) at about 2,800 lines in one step, which suggests it was ported from earlier work. Seat shading, the stop sign, and sticky notes arrive within three weeks. The distribution portal is added in mid August.
3. October to December 2024. Version 3.0. Checkout and performance rework, shading moved to grid coordinates, a refactor.
4. February to April 2025. The busiest period, 26 of the 64 commits. Distribution portal overhaul and caching, the bonus feature, seat-ID shading, checkout error logging, password reset and phone verification, and a rewrite of the worker into separate manager classes.
5. June to November 2025. Two large squashed updates, then a readme rewrite by a second developer.
6. January to March 2026. Maintenance: quantity limits, a price check, the DOM-ready fix, and the interceptor race fix.

Sites over time. June 2024: two hostnames. July 2024: 14 hostnames across four domains (two brands, two countries). August 2024: the distribution portal. Later: auth and identity hosts. Today the marketplace content script matches 17 hostnames and the iframe scripts 2 more, plus the portal itself in production, staging, and local.

Numbers the repo supports:

| Measure | Value |
|---|---|
| JavaScript and JSX source | 10,426 lines in 41 files |
| Observers | 4,316 lines, 10 files (the distribution portal observer alone is 2,164) |
| Services and parsers | 3,101 lines, 14 files |
| Entry points | 1,694 lines, 6 files (worker 781, popup 326) |
| Worker API client and tab store | 705 lines |
| Page-world scripts and helpers | 532 lines (map script 377, interceptor 42) |
| MutationObserver sites | 21 across 11 files |
| Selector calls | 231 |
| Distinct site test-hook names targeted | 60 |
| Message types the worker handles | 21 |
| Source size over time | 312 lines (June 2024), about 4,300 (October 2024), about 7,000 (March 2025), 10,426 now |
| Tests | 0 |

Numbers the repo cannot support: user count, purchases tracked, events covered, rules in force, time saved, error rates. Rules are not stored in this repo at all. The warehouse would have all of these.

---

## 5. Stack

- Language: JavaScript with ES modules. JSX for the popup only. No TypeScript.
- UI: React 18.3 for the popup. Everything drawn on host pages is plain DOM and inline styles.
- Styling: Tailwind, with the compiled stylesheet committed. Tailwind is not in `package.json` and is run by `npx` according to the readme.
- Build: Vite 5.4 with the SWC React plugin, eight entry points, a static-copy plugin for the manifest, icons, and the two page-world scripts. Minified, with console calls stripped for production. Endpoints injected at build time from a git-ignored `.env`.
- Other libraries: `path-to-regexp` for URL matching, `dotenv`.
- Lint: ESLint 8 with React plugins. The lint script allows zero warnings.
- Tests: none, and no test tooling installed.
- CI: none in the repo.
- Environments: production and staging portal hosts are both in the manifest. Switching the worker between them means editing constants.
- Deployment: sideload. Build, zip the output, load unpacked in developer mode. No store listing and no update URL. The extension ID is pinned by a manifest key and allow-listed by the backend.

The readme is partly stale (it gives a wrong manifest path, a wrong service path, and a different check interval), so the write-up should not quote it.

---

## 6. What can be shown

No screenshot, recording, or diagram exists anywhere in the repo. The only images are three icon files.

Could be captured without client data:

- The toolbar badge in its states: red, green, quantity count, check mark.
- The popup on a non-checkout tab, where every field is empty. The user name line would need blurring. It is a plain form and not visually strong.
- The map overlay: red glowing rings on seats, orange section fill, yellow sticky notes, and the stop overlay. This is the one visual that explains the project. A live capture would show a real event's inventory and the brokerage's real selection, so it needs a throwaway rule set, placeholder note text, and Scott's decision on showing the marketplace's page at all. A redrawn mock map with the same styling would avoid all three problems.
- The "checkout tracked" toast with its reference ID, cropped away from the rest of the checkout page.

Diagrams the architecture supports:

1. Sequence of a rule reaching the page (the eleven steps in section 2).
2. State across origins and worlds: portal page, extension, marketplace isolated world, marketplace page world, identity iframe.
3. The auth borrow and refresh loop.
4. The purchase telemetry funnel: page load, queue, sign-in, cart, failed cart, checkout error, confirmation.
5. The iframe message triangle: iframe, parent page, worker.
6. The two-tier cache with shared in-flight requests.
7. The update path: version bump, build, zip, sideload, pinned ID, backend allow-list, version stamped on every record.

Must stay prose only, or be left out:

- Any endpoint, hostname, key, table name, or payload field name. `RequestChangeTypeListener.js`, `background.js`, and the manifest should never appear in a screenshot.
- The verification code helper, the password reset automation, and the account lookup. These concern account credentials.
- Session cookie capture. Page-load and sign-in records include the marketplace cookie string.
- The distribution portal table and the bonus feature. They show purchase requests, prices, staff names, and compensation.
- The "total purchased" note, which shows an account email.
- Block-page detection, unless Scott is comfortable describing it.
- Buy criteria and message text, which are business rules.

---

## 7. Claims audit

**Headline: "A Chrome extension that runs inside Ticketmaster and other marketplaces, reads purchasing rules from the portal, and alters the venue map in-page."**

- "Runs inside Ticketmaster": true.
- "and other marketplaces": partly true. It is one sister brand on the same front end, across US and Canadian domains. The only other site is a third-party distribution portal, which is a table of purchase requests, not a marketplace with a venue map. Suggested wording: "runs inside Ticketmaster and its sister sites".
- "reads purchasing rules from the portal": true. Precisely, the worker calls the portal's backend for one event at a time, using the buyer's token taken from an open portal tab.
- "alters the venue map in-page": true. The change is additive. It adds classes, inserts ring elements, and overlays notes. It does not remove or hide anything the site drew.

**Step 1: "buyer saves rules in the portal."** Cannot be verified here, because the portal is not in this repo. The code hints that it is not the buyer: rules arrive with "buy criteria", a "message", and a stop flag aimed at the person browsing, which reads as a manager or pricer instructing a buyer. Scott should confirm who authors rules.

**Step 2: "worker fetches rules on tab load, caches per event, refreshes on a timer."** Partly true, and wrong in each detail.

- The worker does make the request, but only when a content script asks. It keeps no rules cache. An event cache and a 30-minute constant are declared in the worker and never used.
- The trigger is not tab load. It is the map appearing in the DOM.
- The timer is in the content script, not the worker: every 15 seconds while the tab is visible.
- Per-event caching exists only on the distribution portal, in the content script, for 30 seconds.
- Correction: "When the map appears, the content script asks the worker for the event's rules, and again every 15 seconds while the tab is visible. The worker fetches them from the portal with the buyer's token."

**Step 3: "content script receives rules over the port and observes the map with a MutationObserver."** Partly true.

- There is no port. Rules come back as the response to a one-shot message.
- MutationObservers are used, but to detect that the map exists and to notice pan and zoom. They do not watch seats change. Repaints are driven by the 15-second poll and a change check.
- A step is missing. The content script cannot paint the map itself. It hands the rules to a script in the page's own world, which reads seat IDs from the site's React internals.
- Correction: "The content script waits for the map with a MutationObserver, then passes the rules into the page's own JavaScript world, where a second script matches them to seats."

**Step 4: "map rewritten in place, state echoed back so the portal knows what was bought."** Partly true.

- "Rewritten in place" overstates it. The map is decorated, and the decoration is cleared and reapplied on each pass.
- Purchase tracking is real and is the larger half of the codebase. But it is not map state and it does not go to the portal. Carts, failed carts, checkout errors, and confirmations go through the worker to a warehouse ingestion endpoint and a Firebase-backed endpoint. Whether the portal later reads the warehouse is outside this repo.
- One loop does close inside the extension: the Assist API returns how many tickets an account has already bought for the event, shown on the page, and the rules carry a maximum quantity.
- Correction: "The map is highlighted in place. Separately, the extension records the cart, any checkout errors, and the order confirmation, and sends them to the data warehouse."

---

## 8. Questions only Scott can answer

Users and outcomes

1. How many buyers and managers use the extension, and over what period?
2. What did buyers do before it existed, and what changed? Any figure for purchases tracked, events covered, or errors caught would have to come from the warehouse.
3. Who writes the rules in the portal: buyers, managers, or a pricing team?
4. Does the portal read the tracked purchases back from the warehouse? If so, the "portal knows what was bought" claim can stay with a corrected path.

Authorship

5. Scott's first commit adds about 2,800 lines at once. Was that ported from an earlier extension, and how much of it is Scott's own work?
6. Two other developers contributed, one of them the seat-ID matching. How should shared work be credited or described?
7. Is the portal's rules endpoint Scott's work too? If so it belongs in the connected-projects story.

What may be shown

8. May the sister brand and the distribution portal be named publicly?
9. Is the employer comfortable with a public page describing an extension that modifies and instruments a marketplace's pages? This touches the marketplace's terms of use and is the main publication risk.
10. Should the verification code helper and password reset automation be mentioned at all? They are technically interesting and publicly sensitive.
11. Same question for block-page detection, session cookie capture, and the bonus feature.
12. May the map overlay be shown on a real event page, or should it be a redrawn mock?
13. May the portal UI appear in any image?

Facts the repo cannot settle

14. How is the extension distributed in practice: shared zip, shared drive, enterprise policy? How do users learn of a new version?
15. Is the 15-second poll a deliberate choice, and was push ever considered?
16. Is the Firebase copy still used, or is it a leftover?

---

## Other observations

These fall outside the eight sections but affect the write-up or deserve Scott's attention.

1. A credential is committed. `src/listeners/RequestChangeTypeListener.js` contains a hardcoded API key for the Assist API and its address as a raw IP over plain HTTP. Passwords and verification codes are sent to it as URL query parameters. The key is in every commit since it was added and in every built copy of the extension. This file must never be shown, and rotating the key and moving the service to HTTPS would be worth doing regardless of the portfolio.
2. The manifest contains the portal's production and staging hostnames, and `CLAUDE.md` lists cloud project names. Neither should be quoted.
3. Two pieces of intent never became code: the worker's event cache, and a shading endpoint variable that is read but never defined. The portfolio's "caches per event" wording may have come from that intent.
4. The readme and `CLAUDE.md` both describe the extension only as a purchase tracker and say nothing about rules from the portal. The public portfolio describes only the rules and says nothing about tracking. The accurate description is both.
