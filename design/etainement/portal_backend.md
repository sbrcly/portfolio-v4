# Portfolio discovery: pricing portal backend

Read-only discovery of this repository, run on 2026-10-05 against the local `main` checkout (last commit 2025-10-02). Nothing was modified, installed, or committed; this file is the only output. The working tree shows 94 files as modified, but that is line endings only (the diff is empty when carriage returns are ignored).

By design this report contains no source, credentials, hostnames, endpoints, table or field names, and no customer, venue, pricing, or staff data. Where a finding depends on one of those, the report gives the file path and describes the thing in words. The one exception is the contributor list in section 5, which the brief asks for; see the note there.

---

## 0. Committed credentials and sensitive data

**Yes, credentials are committed**, both in tracked files at `HEAD` and, more seriously, on an unmerged branch on the remote. Values are not reproduced here.

### Credentials in tracked files at `HEAD`

| What | Where | Count |
|---|---|---|
| Slack incoming-webhook URLs (full, usable) | `config/config.js`, `config/bigquery.js` | 9 (8 + 1) |
| Observability vendor API key, baked into the image as an environment variable | `Dockerfile` | 1 |
| A ticketing-platform API key and secret key pair, as string literals | `config/config.js` | 1 pair |
| A broker API key for the trade-desk vendor, as a literal request header. The same integration reads its key from the environment elsewhere, so this one bypasses secret management | `services/global.service.js` | 1 |

### In history

**A cloud service-account private key is on the remote, on an unmerged branch.** The branch `unit_test_pricer` (last commit 2024-10-17, never merged to `main`) contains a test fixture, `tests/test-data/event-id/anytickets.js`, that appears to be a captured response with the HTTP client's state still attached. It embeds private-key blocks (six occurrences at the branch tip), a service-account email and key ID, the real project ID, and OAuth refresh-token fields. This is the most serious item in this section: it is a full cloud credential, not a webhook. It should be disabled in the cloud console first and cleaned up second.

Other history findings, from a pattern scan of every non-merge commit on all refs:

| Pattern | Commits that add or remove it |
|---|---|
| Slack webhook URLs | 22 |
| Private-key block | 1 (the branch above) |
| RSA private-key block | 0 |
| Slack API tokens | 0 |
<!-- HISTORY-SCAN-REST -->

The scan is pattern-based and counts commits, not distinct secrets. It will not catch a credential that matches none of the patterns, so treat a zero as "not found", not "clean".

Deleting these from `HEAD` does not remove them. Every item above should be treated as exposed and rotated; history rewriting is optional after that.

### Not credentials, but must not reach a public write-up

- **Staff personal data.** `services/seeder.service.js` holds about 23 user records with names and email addresses plus about 21 more addresses in tag mappings, including a personal address and addresses at outside vendors. `services/stale-inventory.service.js` embeds 13 staff names and addresses inside a query.
- **Operational seed data.** `models/event-tags-data.mode.js` is 6,331 lines of event-to-analyst assignments (internal event IDs against staff first names, snapshot dated August 2023).
- **Infrastructure identifiers.** Cloud project IDs, a database instance name, a storage bucket name, and deployed service URLs appear in `README.md`, `.gcp/db-sync/README.md`, and three service files. `envVerification.js` and `test-redis-ssh.js` hard-code an internal host, an IP address, and a cloud username.
- **The warehouse catalogue.** `config/config.js` lists 111 fully qualified warehouse tables and functions. It is not a secret, but it is a complete map of the company's data estate.

### Not committed (confirmed)

- `.env` exists locally and is gitignored. It was not opened during this discovery.
- The service-account key directory is gitignored and absent from the index.

### A design issue that belongs in this section

The accounts feature (`services/accounts.service.js`) reads and writes purchasing-account records that include account passwords and payment-card numbers, expiry dates, and security codes as ordinary warehouse columns, and caches the full set in Redis for 14 days. No such data is in the repository, only the code that handles it. Storing card security codes at all is prohibited under PCI DSS, so this is a compliance exposure for the company and a subject the portfolio should stay away from entirely.

---

## 1. What it is

This is the HTTP backend of an internal operations portal for a ticket resale business. It serves a browser frontend (the portal) and a Chrome extension used by staff, and nothing public. For each event it assembles one view out of the company's own inventory (read live from three point-of-sale systems), secondary-market listings, primary-market availability and seat maps, sales history, and bids, then lets an analyst push list-price and broadcast changes back to the point of sale. A second half of the system supports buying rather than pricing: an onsale calendar with buy criteria, a seat-map rules tool (internally "shader") whose per-event rules the extension fetches, purchasing-account and buyer ("puller") assignment, offer tracking, and several reporting dashboards.

It depends on: a MySQL database for identity and per-user settings; BigQuery as the system of record for almost everything else, including transactional writes; Redis as a cache; Cloud Storage for archived third-party payloads; Secret Manager; Google OAuth for sign-in; Slack for alerts and message search; a commercial proxy pool; and third-party ticketing APIs (Skybox / Vivid Seats, a second point-of-sale vendor, a trade-desk vendor, and Ticketmaster / Live Nation web APIs). It has no queue system and no in-process scheduler. The data it reads is produced by scrapers and warehouse jobs that live outside this repository.

---

## 2. Architecture

### Runtime and layout

- Node.js 20.9.0 (pinned in three places), ES modules, Express 4.
- A single monolith, one container, deployed to Cloud Run. No functions, no workers, no separate job processes.
- Conventional layering: one routes file (147 route registrations) → 18 controllers → 19 services. Controllers are thin; services hold the SQL and the outbound calls.
- 47 of the 147 routes have a request-shape validator (express-validator). The rest take request values as they come.

### Data stores

| Store | Role | Notes |
|---|---|---|
| MySQL via Sequelize | Identity and preferences | Users, roles, permissions, tags, strategies, saved table layouts, saved onsale views |
| BigQuery | System of record | Events, inventory snapshots, market scrapes, sales, rules, criteria, audit logs, notifications, accounts. Read and written directly per request |
| Redis | Cache | Event list, per-event rules and criteria, maps, price audit, accounts. TTLs from 10 minutes to 28 days |
| Cloud Storage | Archive | Raw third-party responses, written under a date-partitioned path |

Four separate BigQuery service accounts are used (pricer, shader, onsale, catch-all), each with its own client, so warehouse cost and permissions can be attributed by product area. Every query is also prefixed with a metadata comment naming the tool and page, which makes per-page cost reporting possible from the warehouse job log. Both are Scott's commits (April 2025) and are the most transferable technique in the repo.

### Entity model

Relational side (MySQL):

- A **user** belongs to one **role**. A role has many **permissions**. A user may also hold extra permissions directly.
- A user has many **tags**. Tags are also attached to **events** (who is responsible for an event), with the assigning user recorded. **Strategies** attach to events the same way.
- An event-to-user mapping records a per-event override of the secondary-market identifier.
- Saved table layouts are keyed by user and tab; saved onsale views are shared and keyed by name.

Warehouse side (BigQuery), at the level this repo touches it:

- An **event** is the join point. It carries one identifier per marketplace and point of sale, and a combined-identifier table reconciles them. A whole feature (ID update) exists to repair missing mappings.
- **Rules** (seat-map criteria), **autopricing criteria**, **buy criteria**, **messages**, **venue notes**, **price changes**, and **notifications** are all append-only rows keyed by event and timestamp. "Current" is whatever a latest-row view or a window function says it is.
- **Market snapshots** (primary and secondary) are time-partitioned and event-partitioned scrape tables that this backend only reads.

### Auth and roles

**Sign-in.** The frontend completes a Google OAuth consent and posts the one-time authorisation code. The backend exchanges it server-side using the client secret, resolves the email, and rejects anyone not already in the users table. It stores Google's access, refresh, and ID tokens on the user row and returns the **Google ID token** to the client along with the user's role, permissions, and tags. The backend issues no tokens of its own.

**Per request.** A single middleware verifies the bearer ID token's signature and audience with Google's library, looks the user up by email, and attaches the user to the request.

**Refresh.** The client posts its expired ID token and an email. The backend checks the old token's expiry is less than 23 hours past, then uses the stored Google refresh token to mint a new ID token and persists the rotated set.

**The extension.** The repo holds only two signals about it:

1. CORS allows exactly two origins: the frontend URL and the extension origin. The extension origin (and therefore its pinned ID) comes from an environment variable populated from Secret Manager at deploy time. It is not in the repo.
2. The extension routes use the same ID-token middleware as everything else.

So the allow-list is a CORS allow-list, enforced by the browser, not by the server. How the extension obtains a Google ID token is not visible here.

**Roles.** Ten roles and sixteen permissions are seeded. The server **authenticates but does not authorise**: no controller, middleware, or route checks a permission or filters by tag. Roles, permissions, and tags are returned to the frontend, which decides what to show. Any signed-in user can call any route, including the ones that edit roles.

Things a reviewer will find in the auth path (described, not demonstrated):

- The middleware skips authentication entirely when two request headers claim the call is from the cloud scheduler. Those headers are caller-supplied.
- The refresh path decodes the old token without verifying it and trusts the email in the request body.
- One business write route and one login-telemetry route have no auth middleware.
- Several handlers take the acting user's identity from the request body or headers instead of from the authenticated user, so the audit trail is self-reported.
- The service is deployed to accept unauthenticated traffic at the platform level, and the generated API documentation UI is mounted without auth.

### Background jobs and schedules

There is very little, and that is a finding in itself.

| Mechanism | What it does | Where the schedule lives |
|---|---|---|
| Scheduler-flagged request | Forces a cache refresh on one seat-map data endpoint | Cloud Scheduler, not in repo |
| In-process write buffer | Batches login telemetry into the warehouse every 10 seconds or 100 records, with retry and a flush on shutdown | In code |
| WebSocket housekeeping timers | Sweep stale sockets and tracking state | In code |
| Production-to-staging database copy | Exports the production database, rewrites the database name in the dump with a text substitution, imports into staging | A Cloud Run Job on a scheduler trigger, documented in `.gcp/db-sync/` |

Three of the most important cache entries (the master event list, the primary-market event list, and the stale-inventory dashboard) are **read here but never written here**. Something outside this repository populates them.

### External integrations

| Integration | Purpose |
|---|---|
| Skybox / Vivid Seats | Read own inventory, write list prices and broadcast flags, remove listing tags, probe broker-to-retail price ratios, read secondary-market listings |
| Second point-of-sale vendor | Same inventory read and price/broadcast write, one request per listing |
| Trade-desk vendor | Same, plus read of own listings on the primary marketplace's resale side |
| Ticketmaster / Live Nation web APIs | Availability facets, seat-map geometry and images, binary event manifests, a live availability subscription, offer-code validation |
| Commercial proxy pool | Carries the requests above that would otherwise be blocked |
| Google OAuth | Sign-in |
| Slack | Stop alerts and channel messages via webhooks; message search via a user token |
| Datadog | APM tracing and logs |
| Secret Manager, Cloud Storage | Secrets; archive of raw third-party payloads |

Puppeteer with a stealth plugin is a dependency, is registered at import, and has Chrome installed for it in the image, but no code ever launches a browser. It is dead weight.

---

## 3. Pricing and rules

### The central fact

**This backend does not compute prices.** There is no pricing model in the repository. Prices are decided by an analyst in the frontend; the backend's job is to put the right evidence on screen, carry the decision to the point of sale, and record it. A portfolio piece that implies an algorithm lives here would be wrong.

### What the backend contributes to a pricing decision

**Inputs it assembles per event**, mostly in parallel and on demand:

- Own inventory, fetched live from whichever of three point-of-sale systems holds the event, then normalised to one shape and enriched with buyer-account data.
- Secondary-market listings, fetched live. If the live fetch returns nothing, it falls back to the most recent warehouse scrape and marks the response as old data with its timestamp.
- Primary-market availability and seat map, through the proxy pool.
- Own listings on the primary marketplace's resale side and on the trade desk.
- Sales history, bids, automatic seat groupings, listing exceptions, the latest price change per listing, and the event's stored autopricing criteria.
- A **retail-price ratio**: the backend asks the point-of-sale pricing API what retail price three probe broker prices would map to and returns the ratios, so the frontend can translate between what the broker sets and what a buyer sees. Cached 10 minutes.

**Cadence.** Per page load. There is no polling loop and no push. Freshness is bounded by the caches and by how recently the external scrapers ran.

### Three write paths

1. **Manual price update.** The frontend sends a list of listing-and-price pairs. The backend looks up which point of sale owns the event and either sends one bulk update or fans out one request per listing. Only if the whole push succeeds does it append an audit row per listing (who, when, old price, new price) and patch the cached audit list. Broadcast on/off is a sibling path.
2. **Autopricing criteria.** The backend stores them and nothing more. A criteria row describes a group of listings and how to price it against comparables: how many comparables, a markup and its type, a stagger and its type, a floor, a ceiling, comparison groups, positions, fill flags, a ratio, and an enabled flag. Each save appends a row. "Disable" appends a copy with the flag off. Reading the current state is the interesting part: one query resolves the latest row per group after whitespace-normalising group names, discards rows superseded for any of their groups, and merges each group's full history onto its current row. **The engine that applies these criteria is not in this repository.**
3. **Initial pricing.** The only place the backend itself produces a price. For events where no listing is yet priced, one query ranks the listings by lot size, cost, and row, picks a first listing and a contrasting second one (different section, size, or row where possible), and prices each at cost plus the greater of a percentage margin and a fixed margin. The backend logs the request and pushes the two prices with broadcast on. It covers one of the three point-of-sale systems. It is a cost-plus bootstrap so an event is not left dark, not a market model.

### How rules are authored, stored, versioned, and served

"Rules" here means the seat-map buy rules, not price rules.

- **Authored** in the frontend's seat-map tool. The saved record has two parts: a list of rules, and a fixed set of event-level settings around it (free-text buy criteria, a message to buyers, a stop flag, an on/off flag, three shading toggles for obstructed view, singles, and premium-priced seats, and a maximum quantity per event).
- **The rule structure is opaque to the backend.** The list is stored as one JSON document and the save route has no validator. The server reads only three things inside a rule: whether it is active, whether it is marked seen, and its list of seat identifiers. Whether a rule also carries sections, rows, or price ranges cannot be confirmed from this repository; that is a contract between the frontend and the extension.
- **Stored** append-only in the warehouse, partitioned by a hash of the event identifier. Saving strips control characters recursively, posts a Slack alert if the stop flag is set (to one of two channels), appends a row, writes per-seat notification rows for active rules marked seen, and warms the Redis copy. The alert goes out before the write, so a save that then fails has still alerted.
- **Versioned** implicitly. Every save is a new timestamped row with the author. There is no version number, no diff, no draft or publish state, and no rollback other than saving again. A latest-row view in the warehouse, whose definition is outside this repo, defines "current".
- **Served to the portal** through a freshness check: one cheap query for the newest timestamp, compared with the timestamp stored beside the cached copy, and a full read only on mismatch.
- **Buy criteria on the onsale calendar** are a second, separate append-only record per event (go/no-go, resources, accounts, assigned pricer, sale date, confidence). The seat-map tool picks which onsale record applies by time: one within a window around now, else the next upcoming, else the most recent.

### What the extension's rules endpoint actually does

It is small. Given a primary-marketplace event identifier, it:

1. Requires a valid Google ID token (same middleware as the portal).
2. Runs one query against the latest-row view, restricted to the event's partition, using the catch-all service account.
3. Parses the stored rules JSON and returns it with the buy-criteria text, the buyer message, the stop flag, the on/off flag, the three shading toggles, and the maximum event quantity. Returns null when the event has no rules.

It does **not** use the Redis copy or the freshness check that the portal path uses, so every extension call is a warehouse query. It applies no per-user scoping, takes no version parameter, and sends no cache headers. In the routes file it sits under a heading that still says "testing". Two sibling endpoints translate between marketplace identifiers for the extension. History: the first extension endpoint landed in February 2024, the extension origin entered the deploy configuration in June 2024, and Scott fixed the rules call in November 2024.

---

## 4. The hard parts

Each item gives the problem, what a senior engineer would ask, and what the repository can show in answer.

### 4.1 Price writes are not atomic across listings

For two of the three point-of-sale systems a price update is one HTTP request per listing, fired together. If some fail, the listings that succeeded stay repriced, the caller is told the whole update failed, and no audit rows are written for any of them.

- **Asks:** What happens on partial failure? Is a retry safe? Can the audit log and the point of sale disagree? Is anything bounding the price server-side?
- **Evidence:** The audit write is deliberately gated on success (a comment says so). There is no idempotency key, no per-listing result, no reconciliation job, and the validator checks only that a list was sent. Initial pricing logs the request *before* pushing and swallows push failures. No tests.

### 4.2 "Live" market data has several clocks

Secondary-market listings are fetched at request time with a warehouse fallback. Primary-market maps are cached 28 days. Rules and criteria are cached up to 7 days behind a freshness check. The retail ratio is cached 10 minutes. The event list comes from a cache this service does not write.

- **Asks:** How old can the number on screen be? Does the analyst know? What invalidates each cache?
- **Evidence:** The fallback path flags old data and returns its timestamp, which is the right instinct. The rules freshness check is a good pattern. Commit history on 1–2 July 2025 shows the rules cache being added, removed, and re-added across six commits, two of them reverts, which is honest evidence that invalidation was hard. Cache patching is read-modify-write with no lock.

### 4.3 Third-party sites that do not want to be read

Primary-market data is fetched through a rotating proxy pool with browser-like headers. Session cookies come from a pool harvested elsewhere and stored in the warehouse; the proxy session is pinned to a hash of the cookie so one identity stays on one exit address; a cookie that draws a block is deleted from the pool and the request retries with another, three attempts in all. Every proxy attempt is logged with outcome and latency, and a settings page reports on proxy health.

- **Asks:** What is the block rate? What happens when the pool is exhausted? Is there a global rate limit? Is this within the sites' terms?
- **Evidence:** The tracking table and the long map cache show the cost of each fetch was understood. There is no global outbound limiter: a rate-limited request queue was written but nothing calls it. Several outbound calls have no timeout. Two disable TLS verification. The terms question is not one the repo can answer and is a publication risk (section 7).

### 4.4 In-memory state on an autoscaled service

The service runs at up to 20 instances with 40 concurrent requests each. The live-availability feature keeps its sockets, its tracking state, and its "first seen" baseline in module memory; the telemetry write buffer and the warehouse concurrency counter are also per-process.

- **Asks:** Which instance holds the socket for the event I am watching? What is lost on scale-in?
- **Evidence:** The buffer flushes on SIGTERM. Nothing else is shared. The socket feature opens connections only in response to a request, waits a fixed five seconds, and returns what arrived; the queueing, batching, and upcoming-event monitoring code around it is unreachable. Its cleanup has bugs that make its connection table grow. The warehouse concurrency limit is set to 20,000, which is no limit; a commented-out earlier value was 100.

### 4.5 A warehouse used as a transactional database

BigQuery takes user-driven single-row writes: saves, merges, updates, deletes. It is built for the opposite workload.

- **Asks:** What is the write latency? What happens when two analysts save at once? Why not the relational database you already run?
- **Evidence:** The append-only-plus-latest-view pattern is the correct adaptation and is used consistently for rules and criteria. Concurrent-update errors are retried with exponential backoff in exactly one function (Scott, June 2025); elsewhere they surface as failures. Tag and strategy changes write MySQL, then BigQuery, then patch Redis, with no rollback if the middle step fails.

### 4.6 Queries built from strings

Roughly three quarters of the queries that include request values interpolate them into the SQL text. About a quarter use parameters.

- **Asks:** Is this injectable? Who can reach it?
- **Evidence:** Yes in principle, by any signed-in user and, given 4.7, by more than that. The rules save hand-escapes quotes inside a JSON literal. There is a visible, unfinished migration: parameterisation commits by Scott in May and June 2025 and a security lint plugin in the config (with one of its rules switched off).

### 4.7 Authentication without authorisation

Covered in section 2. The role model is real and well normalised, and it is enforced only in the browser.

- **Asks:** Can a buyer account edit roles or read the accounts table? What stops a forged scheduler header?
- **Evidence:** Nothing server-side. This is the finding most likely to be raised in an interview and the one with the clearest fix.

### 4.8 Data volume per request

The master event list is one cached value that is loaded whole and scanned linearly to find one event. Quantity-over-time graphs page at around 160,000 rows. Seat-map payloads are gzip-compressed once, cached compressed, and passed to the browser still compressed so the server never inflates them.

- **Asks:** What is the p95 for the event page? What is the memory profile?
- **Evidence:** The pass-through compression is a good optimisation. The Node heap ceiling is set to 8 GB inside a 4 GB container, so the container limit will be hit before the garbage collector feels pressure. The tracing wrapper serialises every service result to measure its size, which adds cost to the large payloads it is measuring.

### 4.9 Failure handling is uneven

- **Asks:** When a dependency is down, what does the user see?
- **Evidence:** The inventory view uses settle-all and reports which sources failed, which is good. Elsewhere, errors are frequently logged and converted to null or an empty list, so a failure and "no data" look identical. Three seat-map functions race against a 100-second timer and, on timeout, call themselves again with no retry cap. Production logging is error-level only, so the warnings written around cache and retry behaviour never appear.

### 4.10 Deploys, environments, and tests

- **Asks:** How do you know a deploy is safe? Is staging isolated?
- **Evidence:**
  - **Tests:** one file, eight lines, zero test cases. The pipeline and the pre-commit hook both run the test command, and it passes because there is nothing to fail. A suite for the events endpoints was written on a branch in autumn 2024 and never merged (section 5).
  - **Schema changes:** no migrations. Models call the ORM's auto-sync with alter at import time, so every cold-starting instance may alter the production schema, concurrently with its siblings.
  - **Isolation:** staging and production have separate MySQL databases on the same instance, but share one Redis host with mostly unprefixed keys (a key-prefixing helper exists and is never called), one set of hard-coded warehouse tables, and the same point-of-sale credentials. A staging save writes production warehouse rows, and a staging price update reaches the real point of sale. Only local development is diverted, and only for one vendor.
  - **Image:** no ignore file for the image build, so the build context, including development dependencies installed by the earlier pipeline step, is copied over the production install. The API documentation packages are development dependencies imported at startup, so the service appears to start only because of that accident.
  - **Dependencies:** a misspelt near-namesake of the browser-automation package is listed as a production dependency. It is unused and should be removed.
  - **Secrets at deploy:** always the latest version, with no pinning.

---

## 5. Timeline and scale

### Commits

| | |
|---|---|
| First commit | 2023-11-07 |
| Last commit on local `main` | 2025-10-02 |
| Total commits | 2,331 |
| Non-merge commits | 1,622 |
| Merge commits | 709 |
| Highest pull-request number in merge subjects | 328 |
| Branch refs (local and remote) | 86 |
| Tags | 0 |

The checkout is a year older than today's date. Whether the remote has moved on is unknown.

### Authors and credit

Git display names, non-merge commits, with obvious aliases merged (the merging is my inference from names and addresses). Lines exclude the lockfile, the seed-data file, and the generated API docs.

| Author | Commits | Share | Lines added / removed | Active |
|---|---|---|---|---|
| Rosendo Torres (two identities) | 763 | 47% | 28,056 / 25,177 | Feb 2024 – Oct 2025 |
| nick-mcd | 303 | 19% | 7,286 / 3,905 | Feb 2024 – Sep 2025 |
| **Scott Barclay** | **182** | **11%** | **10,674 / 4,969** | **Jan 2024 – Aug 2025** |
| Ashok Hirpara (external agency) | 152 | 9% | 8,810 / 4,314 | Nov 2023 – Jul 2024 |
| Andrew | 115 | 7% | 12,352 / 6,155 | Apr – Aug 2025 |
| Tim Schachner | 58 | 4% | 687 / 298 | Feb – Aug 2024 |
| jignesh (external consultancy) | 33 | 2% | 904 / 540 | Apr – May 2025 |
| Four others | 16 | 1% | under 200 | scattered |

Shares are of the 1,622 non-merge commits. Scott is the third most active of roughly eight substantive contributors: about 11% of commits and about 15% of lines added. He did not start the project (an external agency developer scaffolded it) and is not its largest contributor. His commits cluster in three bursts: March 2024, October–November 2024, and March–July 2025.

**Where Scott's work is concentrated**, by lines and commit subjects:

- The seat-map rules service and its data fetching, including proxying the map requests, the rule sanitiser, the stop-alert routing, and four of the rule record's flags.
- The stale-inventory and analyst pricing dashboard queries (his second-largest area by lines, and most of his June–August 2025 commits).
- The events service and an earlier modular layout of it that was later folded back into the flat structure.
- The manual price-update route (January 2024, his first feature here).
- Platform work: splitting the warehouse client by service account, the batched telemetry write buffer, the Redis helper, query parameterisation, the serialisation-conflict retry, and the OpenTelemetry, metrics, and profiling experiments.

Staff names appear in this section because the brief asks for authors and credit. A public write-up should use roles, not names, unless each person agrees.

### Phases

| Period | Commits/month (incl. merges) | What happened |
|---|---|---|
| Nov 2023 – Jan 2024 | 42–76 | Scaffold by an external agency developer: Express, ORM, Google sign-in, roles and tags, Redis, lint, pipeline |
| Feb – Apr 2024 | 70–96 | In-house team takes over. Pricer event page, accounts, buyer assignment, secondary-market data |
| May – Oct 2024 | 76–146 | Seat-map rules tool, quantity graphs, extension endpoints, onsale calendar, proxies, login tracking |
| Nov 2024 – Jan 2025 | 85–103 | Offers, notifications, maps, reports |
| Feb – Jul 2025 | 57–232 | Peak, with 675 commits in May–July alone. Caching rework, tracing, service-account split, pricing dashboard. An external consultancy contributes for a month |
| Aug – Oct 2025 | 20, 10, 2 | Tail-off |

### Lines by part

Current tree, all lines including blanks and comments.

| Part | Lines |
|---|---|
| Services | 12,665 |
| Controllers | 2,768 |
| Config | 1,285 |
| Validation and other middleware | 1,060 |
| Hand-written utilities | 734 |
| Root scripts | 644 |
| Models | 564 |
| Routes | 264 |
| **Hand-written application code** | **19,984** |
| Compiler-generated flatbuffer readers | 2,788 |
| API docs (annotations) | 3,083 |
| Seed data | 6,331 |
| Tests | 8 |

### Test count

**Zero on `main`.** One placeholder file with an empty suite.

A real suite exists but never merged. The remote branch `unit_test_pricer` (September–October 2024, by the external agency developer) holds 22 files under `tests/`: mocks for the warehouse client, the HTTP client, the auth library, and the models, captured fixtures for all three point-of-sale systems, and one test file for the events endpoints with 48 `describe`/`it` calls. Across all refs only seven commits ever added a file matching a test pattern. That branch is also where the committed private key lives (section 0).

### Figures the repo supports

- 147 routes, 18 controllers, 19 services, 167 traced service functions.
- 111 warehouse tables and functions referenced.
- 10 roles, 16 permissions, about 23 seeded users.
- About 6,300 event-to-analyst assignments in a 2023 seed snapshot, which is the only evidence of event count and it is three years old.
- Deployment ceiling: 20 instances × 40 concurrent requests, 4 vCPU and 4 GB each, 300-second request timeout.
- Trace sampling at 20% in production.
- 2,331 commits and 328 pull requests over 23 months.

### Figures the repo cannot support

Events under management today, inventory size or value, requests per day, active users, latency, uptime, price changes per day, cache hit rate, proxy success rate, revenue effect. All of these exist, if anywhere, in the tracing vendor and the warehouse (the price-audit, page-visit, login, and proxy-tracking tables would answer several directly).

---

## 6. Stack

Exactly as the repository shows.

**Runtime:** Node.js 20.9.0, ES modules. Express 4, body-parser, cors, helmet, express-validator.

**Data:** Sequelize 6 with mysql2 (Cloud SQL for MySQL, connection pool of 5, socket or TCP). `@google-cloud/bigquery` 7. ioredis 5. `@google-cloud/storage`. `@google-cloud/secret-manager`.

**Auth:** google-auth-library 9, jwt-decode.

**Outbound:** axios, https-proxy-agent, `websocket` (W3C client).

**Binary decoding:** flatbuffers 25 with compiler-generated readers (no schema file in the repo), roaring-wasm for bitmap deserialisation.

**Observability:** dd-trace 5 with the serverless init wrapper as the container entrypoint; winston (JSON to console). OpenTelemetry SDK and Google exporters are installed and configured in a file that is never imported.

**Present but unused:** puppeteer, puppeteer-extra and its stealth plugin (plus Chrome in the image); the OpenTelemetry stack; a custom metrics module; nodemon as a production dependency.

**Build:** Dockerfile on the slim Node 20.9.0 image, installs Chrome and fonts, production install, copies the tree, starts under the tracing wrapper.

**Lint:** ESLint 8 with the standard config, the security plugin, and the mocha plugin. Semicolons enforced.

**Tests:** mocha, chai, chai-http. No test cases.

**Pre-commit:** husky runs lint and the test command.

**CI/CD:** Cloud Build, five steps: clean install → test command → image build → push to Artifact Registry → deploy to Cloud Run. Lint is not a pipeline step. One pipeline definition parameterised by stage.

**Deployment:** Cloud Run, managed, one US region, publicly invokable, 4 vCPU, 4 GB, concurrency 40, maximum 20 instances, 300-second timeout. 22 secrets mapped from Secret Manager, including four service-account keys passed as JSON in environment variables.

**Environments:** development (local; a bootstrap script pulls secrets, prompts for database credentials, writes the env file, and can open an SSH tunnel to the shared Redis), staging, production. A scheduled job copies the production relational database into staging. Isolation gaps are in 4.10.

**API docs:** swagger-jsdoc and swagger-ui-express, served by the app; 35 annotation blocks against 147 routes.

---

## 7. What can be shown

**Nothing in this repository is screenshot material.** It has no user interface. The only rendered surface is the generated API documentation page, which lists endpoints and so cannot be published. Any visual has to be a redrawn diagram.

Diagrams the architecture supports, in rough order of value:

1. **Rule lifecycle.** Author in the seat-map tool → sanitise → append to warehouse → stop alert and seat notifications → cache warm → latest-row view → two read paths (portal with freshness check, extension direct). This is the clearest story in the repo and the one closest to the extension.
2. **Event page request flow.** One page load fanning out in parallel to three point-of-sale systems, the secondary market with its warehouse fallback, the primary market through the proxy pool, and the warehouse, with settle-all error aggregation.
3. **Price write path.** Analyst decision → platform lookup → bulk or fan-out push → audit append → cache patch. Worth drawing with the partial-failure branch shown, because that is the honest part.
4. **Blocked-fetch loop.** Cookie pool → sticky proxy session → fetch → on block, retire the cookie and retry → archive and cache → log the attempt.
5. **Availability decode pipeline.** Subscription message → base64 → flatbuffer → roaring bitmap → open-seat set → per-section counts. Technically the most unusual thing here.
6. **Cache layering.** Which data lives how long, and which entries this service only reads.
7. **Deploy pipeline.** The five steps and the secret mapping.
8. **Cost attribution.** Four service accounts plus per-query page tags flowing into a warehouse cost report.

A **job schedule** diagram would be thin: one scheduler-triggered cache refresh, one database copy job, and timers. The schedules themselves are not in the repo.

**Publication cautions.** Diagrams 4 and 5 describe circumventing a named marketplace's bot defences and reading its internal data feeds. Whether to name the marketplace, or to show these at all, is a decision for Scott and probably for the company. The accounts feature should not appear in any form.

---

## 8. Claims audit

> "A pricing portal for inventory against the live market"

**True:**

- It is a portal backend, and pricing owned inventory is its original and central use.
- Own inventory is read live from the point of sale on each page load.
- Market listings are shown beside that inventory, and price changes are pushed back to the point of sale and audited.

**Needs qualifying:**

- **"Live."** The secondary market is fetched on demand when a page loads, with a fallback to the last scrape that is flagged as old. It is not streamed or polled. Much of the surrounding context is cached for hours to weeks or comes from warehouse snapshots. "On-demand" or "current" is defensible; "real-time" is not.
- **"Pricing."** The system informs and transmits prices. It does not calculate them, apart from a cost-plus bootstrap for unpriced events. Autopricing criteria are stored here and executed somewhere else.
- **Scope.** By code volume and by 2024–2025 commit activity, at least as much of this backend serves buying (onsale calendar, seat-map rules, buyer and account assignment, offers) as serves pricing. "Pricing portal" undersells the system and slightly mislabels it.
- **Authorship.** Scott is one of about eight contributors, at roughly 11% of commits. "Built" overstates it; "worked on" or "contributed to" with named areas is accurate.

**The accurate one line:**

> Backend for an internal ticket-resale operations portal: it puts a broker's own inventory beside on-demand market listings and sales history, pushes analysts' price changes to the point of sale, and stores the buy rules that a Chrome extension applies at onsale.

A shorter variant if the portfolio needs to keep its framing:

> An internal portal for pricing ticket inventory against current market listings, with the buy rules its Chrome extension enforces.

---

## 9. The system picture

The flow from rule authoring to dashboard, with what this backend owns.

| Step | Owner | Status from this repo |
|---|---|---|
| 1. Analyst authors rules and buy criteria in the portal | Frontend | Not in repo |
| 2. Save: sanitise, append to warehouse, stop alert, seat notifications, cache | **This backend** | Fully visible |
| 3. Resolve "current" rules from the append-only log | Warehouse view | Read here; definition not in repo |
| 4. Extension fetches rules and identifier mappings | **This backend** | Fully visible |
| 5. Extension authenticates | Extension + Google + **this backend's middleware** | Server half visible; how the extension gets its token is unknown |
| 6. Extension applies rules on the marketplace page | Extension | Not in repo |
| 7. Buyer activity (page loads, queue positions, purchases, session cookies) lands in the warehouse | Unknown | This backend reads those tables and writes none of them |
| 8. Scrapers and warehouse jobs build event lists, market snapshots, sales, and the master event cache | External pipelines | Not in repo |
| 9. Dashboards read the warehouse | **This backend** for the portal's own dashboards (queue analytics, analyst pricing, stale inventory, reports) | Visible |
| 10. The Assist dashboard | Unknown | "Assist" appears in this repo only as the name of a permission. No route or service is identifiably its backend |

**What this backend owns:** steps 2, 4, the server half of 5, and 9 for the portal's built-in dashboards. On the pricing side it owns the event-page assembly and the price write and audit.

**What is unknown from here:**

- Who writes the master event cache, the primary-market event cache, and the stale-dashboard cache.
- What executes autopricing criteria.
- How steps 6 and 7 work, and whether the extension writes to the warehouse directly or through another service.
- Whether the Assist dashboard calls this backend at all, and if so which routes.
- The schedules for every scheduled thing.

---

## 10. Questions only Scott can answer

**Credit and scope**

1. Which features were yours end to end, as opposed to features you touched? The git evidence points to the manual price-update route, the pricing dashboard queries, the rule-record flags, the service-account split, and the telemetry buffer. Is that the right list?
2. What was your role on the frontend, the extension, and the Assist dashboard relative to this backend?
3. Did you design the append-only rules model, or inherit it?
4. Are the other contributors comfortable being named, or should the write-up use roles?

**Facts the repo cannot give**

5. How many events, listings, and users did the system handle, and how many requests or price changes per day? Can those be pulled from the tracing vendor or the audit tables?
6. What runs autopricing, and what populates the three caches this service only reads?
7. How does the extension obtain its token, and where does its telemetry go?
8. Which routes does the Assist dashboard use?
9. Is the system still in production, and has the repository moved on since October 2025?
10. Why did the autumn 2024 test suite never merge?

**Decisions and outcomes**

11. Why BigQuery for transactional writes rather than the existing MySQL database? Was that a cost, team, or reporting decision?
12. What happened with OpenTelemetry? It was set up in March 2025 and is unwired now. Was the move to the current tracing vendor a decision you made?
13. Did the service-account split and per-page query tagging lead to a measurable cost reduction? A number here would be the strongest single claim available.
14. What did the July 2025 caching work do to event-page latency?
15. Was server-side permission enforcement ever planned? If the answer is "known gap, never prioritised", say so; it reads better than silence.
16. Were the stop alerts and seat notifications a response to a specific incident?

**Publication**

17. May the marketplaces and vendors be named?
18. May the proxy and cookie-rotation approach be described publicly at all? This is the question with the most downside.
19. Does the company know about the committed credentials in section 0, in particular the service-account key on the unmerged branch, and who will rotate them?
20. Is there an NDA or employment term that limits describing internal tools?
