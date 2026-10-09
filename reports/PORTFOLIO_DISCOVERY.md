# Portfolio discovery report

Audit date: 1 October 2026. Read-only pass over `scott-barclay-v4`. No source files were changed, no git commands were run, nothing was installed. The only file written is this report.

Purpose the site is judged against: getting Scott hired as a software engineer, Seattle-area or remote, as of October 2026.

How things were checked:

- Every source file, stylesheet, config file, and the resume PDF text were read in full.
- `tsc --noEmit` and `eslint .` were run from the already-installed `node_modules`.
- `npm outdated` and `npm audit` were run (registry lookups only).
- Public URLs the site links to were fetched once each (the live site, the App Store listing, joinprava.com, GitHub). LinkedIn blocks automated requests, so those links are unverified.
- Nothing was rendered in a browser. Layout findings at 390px and the scroll reveal finding are derived from the CSS and marked as such.

## The short version

The site is well built, honest in tone, and frozen at 27 July 2026. Since then three things moved and the site did not: the relocation date on the resume passed, Prava shipped through version 4.5.1 with a different shape than the case study describes, and the dependency set picked up a critical advisory. The biggest hiring risk is not staleness though. It is that nearly every strong claim on the site has to be taken on trust, and the few places a reader can click through to verify (the four "public repos", the Prompt Lab screenshot, the GitHub profile) currently weaken the claims rather than back them.

Five findings that matter most:

1. The resume header still says "Seattle, WA (relocating September 2026)". It is October. The site itself never mentions Seattle, relocation, or remote at all.
2. The four GitHub repos linked from Experience as "sanitized public repos" each contain one README and no code. Last pushed in 2022.
3. The Prompt Lab screenshot contradicts its own caption and the copy around it: it shows 11 surfaces (copy says thirteen), every surface at version 1 authored by "Seed" on the same minute, and a "Fallbacks (7d)" column full of amber "empty-config" counts.
4. The Prava case study describes an app that the App Store listing no longer describes (weekly lectionary and accountability circles versus daily readings and one-to-one prayer cards), and three public sources give three different counts of AI features (thirteen on the site and resume, 11 in the screenshot, 22 on the GitHub profile).
5. The strongest engineering proof is all one or two levels down. The home page does not name the odds console, the AI cost work, or the Chrome extension.

## 1. Inventory

### Routes

| Route | File | What it is |
| --- | --- | --- |
| `/` | `app/page.tsx` | Hero line, three-row "Shipping record" ledger, two calls to action |
| `/work/prava` | `app/work/prava/page.tsx` | Flagship case study, five numbered sections, spec sidebar, seven screenshots |
| `/work/incognito-wraps` | `app/work/incognito-wraps/page.tsx` | Client case study marked in progress, five sections, before and after screenshots |
| `/experience` | `app/experience/page.tsx` | Caesars trading tools (video plus three screenshots) and Etainement (prose only) |
| `/about` | `app/about/page.tsx` | Six paragraphs of narrative |
| `/connect` | `app/connect/page.tsx` | Email, GitHub, LinkedIn, Prava, resume download |
| 404 | `app/not-found.tsx` | Standard not-found page |
| `/robots.txt` | `app/robots.ts` | Allow all, points at the sitemap |
| `/sitemap.xml` | `app/sitemap.ts` | Six URLs, `lastModified` is always the build time |
| `/opengraph-image` | `app/opengraph-image.tsx` | One generated 1200x630 card: name and "Software engineer & founder" |
| `/icon`, `/apple-icon` | `app/icon.tsx`, `app/apple-icon.tsx` | Generated "SB" monogram at 32px and 180px |

`app/layout.tsx` wraps everything with the nav, footer, Lamplight, and ScrollReveal. `app/template.tsx` wraps each page in React's `<ViewTransition>`.

The live site at scottbarclay.dev returns 200 on every route and is served by Vercel. The public GitHub repo `sbrcly/portfolio-v4` has the same five most recent commits as the local checkout (head `e55cbc8`, 27 July 2026), and the live resume is byte-identical to `public/Scott-Barclay-Resume.pdf`. So live, GitHub, and local all match, and all three are two months old.

### Components

| Component | Type | Used by | Notes |
| --- | --- | --- | --- |
| `MainNav` | client | layout | Sticky header, five links plus brand, `aria-current` handled |
| `Footer` | server | layout | Name line and one link to Connect |
| `Lamplight` | client | layout | Cursor-following glow, fine pointers only, off under reduced motion |
| `ScrollReveal` | client | layout | One IntersectionObserver for `.section`, `.caseAside`, `.screenshotBand` |
| `Lightbox` | client | Prava, Incognito Wraps, Experience | Native `<dialog>` wrapper around `next/image` |
| `Todo` | server | nothing | Dead. Zero usages. Kept deliberately for future content passes |

Supporting files: `lib/og-font.ts` (fetches subset fonts from Google at build time for the generated images), `types/react-view-transition.d.ts` (hand-written type for `<ViewTransition>`).

### Images and media in `public/`

| File | Pixels | Size on disk | Used on |
| --- | --- | --- | --- |
| `images/prava-home.png` | 1320 x 2868 | 395 KB | Prava hero band |
| `images/prava-lectio.png` | 1320 x 2868 | 261 KB | Prava hero band |
| `images/prava-journal.png` | 1320 x 2868 | 273 KB | Prava hero band |
| `images/prava-circle.png` | 1320 x 2868 | 375 KB | Prava hero band |
| `images/prava-cockpit.png` | 3442 x 1974 | 429 KB | Prava back office |
| `images/prava-prompt-lab.png` | 3448 x 1976 | 594 KB | Prava back office |
| `images/prava-simulator.png` | 3442 x 1974 | 660 KB | Prava back office |
| `images/incognito-before.png` | 3452 x 1976 | 6.1 MB | Incognito Wraps |
| `images/incognito-after.png` | 3436 x 1980 | 2.7 MB | Incognito Wraps |
| `images/trading-schedule.png` | 2551 x 1366 | 268 KB | Experience |
| `images/inplay-odds.png` | 1336 x 590 | 124 KB | Experience |
| `images/arbitrage-table.png` | 3840 x 1983 | 210 KB | Experience |
| `videos/odds-display-demo.mp4` | 2062 x 1080, 33 s, H.264, no audio | 856 KB | Experience |
| `Scott-Barclay-Resume.pdf` | 1 page, US letter | 51 KB | Connect |

Every image is referenced. None is orphaned. All twelve are PNG and all go through `next/image`, so visitors receive resized WebP (confirmed on the live site: the 640px variant of `prava-home` is 36 KB). The two Incognito files are large as source files but are never sent raw.

### Resume PDF

- Created 27 July 2026, 10:45 PDT, exported from LibreOffice 24.2. Author metadata is "Un-named" and there is no document title.
- One page. Sections: header, Summary, Experience (Prava, Etainement, William Hill / Caesars), Skills, Education.
- The PDF contains no clickable links. Every URL in the header is plain text.
- The filename a recruiter ends up with is `Scott-Barclay-Resume.pdf`.

Extracted text, condensed but with every claim preserved:

- Header: "Seattle, WA (relocating September 2026)", phone, email, scottbarclay.dev, joinprava.com, github.com/sbrcly, linkedin.com/in/scott-barclay.
- Summary: self-taught, came up through a sports trading desk, founder and sole developer of Prava "live on the App Store", strong in TypeScript and Python, "looking to bring solo-operator discipline to a team".
- Founder and Sole Developer, Faith Platforms Inc. (Prava), 2025 to Present, Las Vegas, NV. Bullets: full stack named (Next.js, Capacitor, Neon, Prisma, R2, RevenueCat, PostHog); Claude with Whisper transcription and GPT-4o as automatic failover; thirteen grounded surfaces with versioned prompts and byte-identical snapshot-tested fallbacks; AI cost cut in three waves with per-request token and cache telemetry; a voice prayer pipeline; twenty chained CI scanners, seven Bible translations; eleven admin tools.
- Full-Stack Developer, Etainement, 2022 to 2026 (part-time from 2025), Dallas then remote. Bullets: dynamic pricing portal; recreated interactive venue maps so brokers could draw targeting rules; Chrome extension injecting those rules into third-party marketplaces; owned features end to end.
- Developer Analyst (promoted from Trader), William Hill / Caesars, 2018 to 2022, Las Vegas. Bullets: set live in-game lines; live odds display "streaming roughly fifty competitor sportsbooks' prices" over Socket.io from BigQuery every five seconds; arbitrage detector; scheduling system; SQL and BigQuery models with Looker dashboards.
- Skills: languages, frameworks, an AI/LLM line (Claude, Whisper, multi-provider fallback routing, prompt versioning and caching, structured outputs, token and cost telemetry, Claude Code), infrastructure.
- Education: University of Nevada, Las Vegas, Business. No year, no degree stated.

### Metadata

- Title default: "Scott Barclay · Software engineer & founder". Template: "%s · Scott Barclay". Every page sets its own title and description.
- Canonical: per-route via `alternates.canonical: "./"` against `metadataBase` of `https://scottbarclay.dev`. Confirmed in live HTML.
- Open Graph: site name, type, locale, per-page title and description, one shared generated image for all routes.
- Twitter: `summary_large_image`, falls back to the Open Graph image. No handle set.
- Sitemap: six URLs. `lastModified: new Date()` means every page claims to have changed on every deploy.
- Robots: allow all.
- No structured data (JSON-LD). Not a hiring concern.

### CI workflow

`.github/workflows/ci.yml` runs on pull requests and pushes to main: checkout, Node 20, `npm ci`, `npx tsc --noEmit`, `npx eslint .`, `npm run build`. No tests exist, so none run. There is no link check, no accessibility check, no Lighthouse run. The build step needs network access to Google Fonts because of `lib/og-font.ts`.

### Dead, unused, duplicated, stale

- `components/todo/` is unused (known and intentional per earlier content passes).
- `.prose ul` rules in `globals.css` style lists that no page contains.
- `.buttonSecondary` is used only by the 404 page.
- `app/icon.tsx` and `app/apple-icon.tsx` are the same file apart from two numbers.
- `BASE_URL` is declared separately in `layout.tsx`, `sitemap.ts`, and `robots.ts`.
- `app/experience/page.tsx` carries four inline style objects that duplicate existing CSS (its caption style repeats `.screenshotGrid figcaption`).
- The home description string is duplicated between `layout.tsx` and `page.tsx`.
- `README.md` is stale in ways a visitor to the public repo will see: the "Content TODOs" section lists screenshots and a domain swap as outstanding (all done), the "Deploy checklist" is entirely unchecked and still calls the domain a "placeholder", the structure tree omits `lightbox/`, `lamplight/`, and `scroll-reveal/`, it describes Experience as "prose only" (it has four media bands), it states "no gradients" (Lamplight and every link underline are gradients), and it ends with a stray second heading "# portfolio-v4".
- `tsconfig.tsbuildinfo` and two `.DS_Store` files sit on disk. All are gitignored, so harmless.

## 2. Truth and staleness audit

Each item says where the claim lives, why it is flagged, and whether the repo can settle it. "Scott" means only Scott can confirm. "Checked" means it was verified externally during this audit. No copy is rewritten here.

### Relocation, location, availability

| Claim | Where | Flag | Who settles it |
| --- | --- | --- | --- |
| "Seattle, WA (relocating September 2026)" | Resume header | September 2026 is over. The line now reads as either stale or as a move that slipped. | Scott |
| Prava role located "Las Vegas, NV" | Resume | Conflicts with the Seattle header if the move happened. | Scott |
| GitHub profile location "Las Vegas, NV" | github.com/sbrcly | Same conflict. Checked: that is what the profile says today. | Scott |
| No location, no "open to remote", no start-date availability anywhere | Whole site | Absent rather than stale. A Seattle or remote screener cannot tell from the site that Scott fits. | Scott to supply the facts |
| "I'm looking for a team" / "a founder is job-hunting" | About | Still true presumably, but undated. | Scott |

### Dates and durations that disagree with each other

| Claim | Where | Conflict | Who settles it |
| --- | --- | --- | --- |
| "2019–25 · Caesars Sportsbook & Etainement" | Home ledger | Resume says William Hill / Caesars 2018 to 2022 and Etainement 2022 to 2026. Start year and end year both differ. | Scott |
| "where I spent three years" at Etainement | About | Resume says 2022 to 2026, part-time from 2025. | Scott |
| "Then I spent a year as the founder and sole developer of Prava" and "I have spent the past year building Prava full time" | About | Resume has Prava starting 2025 and Etainement continuing part-time into 2026. "Full time" and "part-time elsewhere" overlap. "A year" was written in July and is now at least fourteen months if Prava began mid 2025. | Scott |
| "Timeline: 2025–present" | Prava spec card | Fine as written. Listed for completeness. | Repo |
| "Timeline: 2026" | Incognito Wraps spec card | Fine if the work started in 2026. | Scott |
| "I worked as a sports trader" | Experience | Resume title is "Developer Analyst (promoted from Trader)". The site undersells a real promotion into an engineering-adjacent role. | Scott |
| "Caesars (William Hill)" versus "At William Hill" versus "William Hill / Caesars" | Experience, About, resume | Three different namings of one employer. | Scott to choose one |

### "Currently" and status statements

| Claim | Where | Flag | Who settles it |
| --- | --- | --- | --- |
| Prava "Live on App Store" | Home ledger, Prava spec | Checked: live. Version 4.5.1 released 30 September 2026. | Checked |
| "live on the App Store since Easter 2026" | Prava outcomes | Checked: App Store release date is 5 April 2026, which was Easter Sunday. | Checked |
| "Live, growing, and paying for itself" | Prava outcomes heading | "Paying for itself" sits beside About's "a product this young doesn't pay a salary". Both can be true (covers its costs, not a wage) but a skeptic will notice. "Growing" is undated. | Scott |
| "paying subscribers on both monthly and annual plans" | Prava outcomes | Unverifiable from outside. | Scott |
| "used across a dozen Christian denominations" | Prava outcomes | Unverifiable. See the traditions count conflict below. | Scott |
| "I'm not winding Prava down... It moves to a contained evenings-and-weekends scope" | About | Future tense written in July. Prava shipped a release yesterday, which is consistent, but whether the scope has actually been contained is Scott's to say. | Scott |
| Incognito Wraps "In staging" | Home ledger, spec card, section 05, caption | Written 27 July. Two months on. A guess at the business domain (incognitowraps.com) returns a site with no Next.js markers, which suggests the rebuild has not launched, but that domain was guessed, not taken from the repo. | Scott |
| "Case study: in progress", "Case study in progress" | Incognito Wraps eyebrow and meta description | Same. | Scott |
| "Still ahead: a quote form, an interactive coverage map... and the DNS cutover" | Incognito Wraps section 05 | Any of these may have shipped or been dropped. | Scott |
| "The rating on the site is 4.7 stars across 126 reviews because that is the real Google number" | Incognito Wraps section 03 | A live number frozen in copy. It will have moved, and the paragraph is specifically about not showing unverified numbers. | Scott, or check Google |
| "Stack: Next.js 16 · Sanity · Vercel" | Incognito Wraps spec | Cannot be checked from this repo. | Scott |

### Prava: product description versus the shipped app

The App Store listing was read on 1 October 2026 (version 4.5.1). The case study was last touched 27 July. Differences:

| Site says | App Store says now | Who settles it |
| --- | --- | --- |
| "an AI faith journal for iOS" (home, Prava, About, resume, every meta description) | App is named "Prava: Prayer & Daily Readings". The site's own App Store URL slug (`faith-journal-prava`) now redirects to `prava-prayer-daily-readings`. joinprava.com is titled "Prava: Prayer & Scripture". The word "AI" does not appear in the store description. | Scott. The engineering framing can legitimately differ from the consumer framing, but the reader who clicks through will see a differently named product. |
| "a weekly lectionary"; caption "The week is the spine"; "appointed Sunday readings across two traditions" | "the readings the Church hears together, every day of the year... the weekdays, the Sundays, and the feasts". Release notes for 4.5.1: "Prava now opens with the day". | Scott |
| "social accountability circles"; screenshot of a Circle group with nine members; caption "A few people keeping the same week." | No mention of circles. A "People" feature instead: one-to-one prayer requests, "One person at a time. No feed, no audience". | Scott. If circles were removed, one of the four hero screenshots shows a feature that no longer exists. |
| "a daily journal"; caption "The daily journal: honest yes and no" | "A few honest questions, once a day. How you're feeling, what you're carrying, how close God feels." | Scott. The journal screenshot may show an older question set. |
| "seven Bible translations" (Prava back office, resume) | Five named: World English Bible free, plus NLT, NKJV, CSB, KJV. | Scott. Admin tooling may handle more than the app exposes. |
| "across twelve traditions" (section 01), "a dozen Christian denominations" (outcomes) | Not stated. The cockpit screenshot's Discovery card reads "nine voices or nothing". | Scott |
| Nothing | Whole Bible reader with highlights and notes, photographing a physical Bible page to import highlights, Insights with monthly recaps, voice prayer, 10 percent of subscriptions to mission work. | Scott. These are shipped features the case study never mentions. Photo import and voice are real engineering. |
| Nothing | 4.95 average across 40 ratings. | Checked. This is a public number the site could cite, given the stated policy of keeping private numbers off the internet. |
| All four hero screenshots | Taken on or before 26 July (the home screen shows the 17th Sunday in Ordinary Time, which was 26 July 2026). The app has had releases since. | Scott to say whether the UI still looks like this. |

### Prava: architecture and numeric claims

None of these can be verified from this repo. The Prava codebase is not here. Each needs Scott to confirm it is still exactly true.

| Claim | Where | Note |
| --- | --- | --- |
| "thirteen grounded surfaces" | Prava facts, back office, resume | The Prompt Lab screenshot shows "11 of 11" surfaces. The GitHub profile README says "22 production GenAI features". Three numbers for what a reader will assume is one thing. |
| "versioned system prompts" with "history, diffs, and drift" | Prava back office, caption | The screenshot shows every surface at "Versions: 1", last edited "Jul 27, 2026, 9:00 AM" by "Seed". That is a freshly seeded table with no history. It was true on the day of the screenshot; it undercuts the caption. |
| "snapshot-tested fallbacks", "an AI regression fails a test instead of a user" | Prava facts, section 03 | The screenshot's "Fallbacks (7d)" column shows amber "empty-config" badges with counts of 9 to 395 on ten of eleven rows. Read cold, that says the in-code fallback fired hundreds of times in a week because the database config was empty. That may be exactly the designed behavior on seed day, but the page does not explain it. |
| "five product surfaces were moved to cheaper models" | Prava section 03, resume | Number needs confirming. |
| "prompt caching, with a usage-event table in Postgres that verifies the cache metrics the provider reports" | Prava section 03 | Needs confirming. No result is stated anywhere: no percentage, no before and after. |
| "enforced by CI scanners" | Prava section 02 | Resume says "twenty chained scanners". Count needs confirming. |
| "eleven internal tools" | Prava back office, caption, resume | Checked against the cockpit screenshot: eleven cards. Consistent as of 27 July. |
| "additive-only migrations", "dark-shipped behind flags with written flip runbooks", "automatic unlimited grace system" | Prava facts and section 03 | Process claims. Need confirming they still hold. |
| "Freemium subscriptions via RevenueCat, monthly and annual plans" | Prava facts | The store mentions "Prava+". Consistent. |
| "Stack: TypeScript · Next.js · Capacitor · Postgres/Prisma · Anthropic API" | Prava spec | Resume adds Whisper and GPT-4o failover, which the site never mentions. The GitHub profile adds "RAG". The spec card says Anthropic only. |
| "Neon Postgres", "Cloudflare R2", "Sentry", "PostHog" | Prava facts | Vendor list. Needs confirming nothing was swapped. |
| "The Profile Simulator... turned tuning the matcher from guesswork into an afternoon" | Prava back office | The cockpit screenshot labels the tool "Target profiles". Minor naming mismatch. Also "commitments" and a "personalization engine" appear here and nowhere in the product description, and the store listing does not mention commitments. Scott to confirm the feature still exists. |
| "That question... is now leading us into the Catholic Church" | Prava section 01 | A personal "now" statement. Scott to confirm it is still how he wants it stated. |

### Experience page claims

| Claim | Where | Flag | Who settles it |
| --- | --- | --- | --- |
| "where a sanitized public repo exists, it's linked" and four `github.com/sbrcly/...-Public` links | Experience | Checked: all four URLs resolve. Each repo contains exactly one file, `README.md`. There is no code in any of them. Last pushed May to August 2022. | Checked. The claim "sanitized public repo" is technically true and will not survive a click. |
| Page title "Proprietary work, told in prose." | Experience | The page now has a video, three screenshots, and four repo links. The title describes an earlier version. Already noted in project memory as unresolved. | Scott |
| Odds display: "updating every five seconds", Socket.io, BigQuery, green and red coloring | Experience | Checked against the repo README: consistent. | Checked |
| Arbitrage: "roughly fifty competitor sportsbooks", "one-minute cycle" | Experience | Checked against the repo README: consistent. | Checked |
| Odds display "streaming roughly fifty competitor sportsbooks' prices" | Resume | The site and the README attach "fifty" to the arbitrage tool, and describe the odds display as comparing against "some of the other big books". The resume moves the number onto the other tool. | Scott |
| Trading schedule: BetRadar and BetGenius feeds, assignment by schedule and league | Experience | Checked against the repo README: consistent. | Checked |
| In-play tracker compares "DraftKings, FanDuel, Pinnacle, and Unibet" | Experience | The public README for this tool is a single screenshot with no description. Cannot check the list of books. | Scott |
| "Etainement... Both proprietary." | Experience | Present tense reads fine. Whether Etainement is comfortable being named alongside a description of altering Ticketmaster's pages is Scott's call. | Scott |
| Screenshots showing Caesars branding and real prices | Experience | The arbitrage and in-play images name Caesars and show real odds. These have been public on GitHub since 2022. Whether that is cleared is not knowable from the repo. | Scott |
| Looker dashboards, customer and pricing models | Resume only | Not on the site. | Scott |
| "Recreated interactive venue maps so brokers could draw targeting rules" | Resume only | The site says buyers "set purchasing rules in the portal" without the map-drawing detail, which is the more impressive version. | Scott |

### Connect page and outbound links

| Item | Flag | Who settles it |
| --- | --- | --- |
| LinkedIn link text "linkedin.com/in/scott-barclay", actual target `linkedin.com/in/scott-barclay-a27077425` | The visible text is not the real address. On the site this is harmless because the link works. On the resume it is not: the PDF prints "linkedin.com/in/scott-barclay" as plain unlinked text, so anyone typing it lands on whoever owns that shorter address. | Scott. Either claim the short custom URL on LinkedIn or print the real one. |
| GitHub profile | Checked: profile bio reads "Software Developer, Blending Functionality with User-Centered Design"; profile README headline reads "AI / GenAI Engineer · Full Stack Developer" and claims 22 GenAI features and RAG. The site says "Software engineer & founder" and thirteen surfaces. Three self-descriptions. | Scott |
| Email, App Store, joinprava.com | Checked: all resolve. | Checked |

### Things that are true and verified

Worth stating so they are not re-litigated: the domain, canonical tags, Open Graph tags, sitemap, robots, and resume download all work on the live site; the Easter launch date is exact; the cockpit tool count is exact; the three Caesars tool descriptions match what was published in 2022; the site contains no leftover placeholder markers and no em dashes in user-facing copy.

## 3. Hiring-manager read

Read as a senior engineer with sixty seconds per page, no prior knowledge, and a mild default of disbelief.

### Home

First five seconds: "Software engineer & founder. I ship products end-to-end. Prava, an AI faith journal for iOS, shipped solo." That lands. It is clear, fast, and specific. The ledger reads as confident.

What a skeptic questions:

- Three rows, and one of them is "In staging". A third of the shipping record has not shipped.
- "2019–25 · Caesars Sportsbook & Etainement · Internal tools" compresses six or seven years of paid engineering, two employers, and the best systems work on the site into the least interesting row. "Internal tools" is the weakest possible label for a real-time odds console and a marketplace-rewriting browser extension.
- "AI faith journal" tells an engineer nothing about what is hard. The words that would make them click (real-time, LLM cost, prompt versioning, payments, App Store) are absent from the page.
- Nothing says where Scott is, whether he is available, or what role he wants. "Founder" in the eyebrow without that context makes some screeners assume he is not really on the market.
- There is no resume link and no GitHub link on the home page. Both are two clicks away.

Thin evidence: the home page has no number, no image, and no outbound link. It is all assertion, well typeset.

Over-explained: nothing. If anything the page is under-filled.

### Prava

First five seconds: the title, one line, and four phone screenshots. It looks like a real, designed product. That lands well. The spec card with a live App Store link is the best trust signal on the site.

What a skeptic questions:

- The first thing after the fold is a paragraph of about 190 words on Scott's personal path through several churches. For a hiring read it is the longest paragraph on the page and it sits exactly where the engineering hook should be. The second and third paragraphs of that section make the product argument on their own in a third of the space.
- "Next.js... shipped inside Capacitor / WKWebView as a native iOS app". A mobile engineer will read this as "it is a web view" and want to hear why. The page never defends the choice, although it is a defensible one for a solo founder.
- "AI cost optimization in three waves" has no numbers at all. It ends on a good line ("a cost optimization you can't independently measure is a rumor") and then gives the reader nothing measured. This is the single most quotable engineering claim on the site and it is one paragraph in the middle of section three.
- "Thirteen grounded surfaces", "snapshot-tested fallbacks", "versioned prompts": all the right vocabulary, zero artifacts. No prompt diff, no test, no schema, no chart.
- The Prompt Lab screenshot, opened in the lightbox, shows eleven rows, all at version 1, all seeded at the same minute, with a column of amber fallback counts. An engineer who zooms in will conclude the versioning system was a day old when photographed and that fallbacks are firing constantly. That is the opposite of what the caption says.
- "Three decisions I'd defend in any interview": the second one (product philosophy as a schema constraint) is the weakest as engineering and is given equal weight. The phrase "automatic unlimited grace system" is product language.
- "I keep the specific numbers off the internet on purpose." Reasonable, but combined with no cost numbers, no user numbers, and no code, the page has no number a reader can hold on to except "thirteen" and "eleven". The App Store rating (4.95 from 40) is public and unused.
- No mention of testing beyond prompt snapshots, no mention of incidents, no mention of anything that went wrong. Senior readers trust war stories more than clean narratives.

Thin evidence: every architecture claim. The back office screenshots are the only engineering visuals, they are at the very bottom, and at thumbnail size they are illegible.

Over-explained: the origin story; "record, not score" is stated in section 01, again in 03, and again by the screenshot caption.

Buried: the AI cost work (section 03, first subsection, no heading weight above its neighbors), the Prompt Lab (section 04, second paragraph), the licensing pipeline (section 04, last paragraph, which is quietly one of the more unusual pieces of engineering on the page). Voice transcription, multi-provider failover, the twenty CI scanners, and photo import are on the resume or in the store listing and not on this page at all.

### Incognito Wraps

First five seconds: "Case study: in progress", a car wrap company's website. A screener understands immediately that this is a small brochure site.

What a skeptic questions:

- Why this occupies the second slot in the navigation and the second row of the ledger, ahead of six years of professional work.
- "The first build leaned dark, glossy, and techy. It photographed well and sold nothing." The site has not launched, so "sold nothing" has no basis a reader can see.
- The engineering content is a Sanity schema with required alt text and a locked settings document. That is competent and small.
- Still "in staging" with a quote form, a coverage map, and DNS cutover outstanding. An unfinished client job is a mild negative on a page whose headline theme is shipping.

Thin evidence: no link to staging, no schema snippet, no performance number. The before and after images are the whole case.

Over-explained: five numbered sections for a marketing site. The "honesty constraint" section is a good paragraph about judgment and the most worthwhile thing here, but it is content policy, not engineering.

What it does prove: client handling, taste, and restraint. That is worth a ledger row. It is not worth equal billing with Prava.

### Experience

First five seconds: "Proprietary work, told in prose." That headline tells the reader to expect nothing they can see, which is both discouraging and no longer true, since the page opens onto a video of a live odds console.

What lands once the reader scrolls: this is the most convincing page on the site. A 33-second video of a real trading tool updating live, a schedule screen, an arbitrage table with real books, concrete transport details (BigQuery, Socket.io, five-second and one-minute cycles). A senior engineer believes this page.

What a skeptic questions:

- They click a repo link expecting code and find a README. Four times. After the second, they stop trusting the word "public repo" and start wondering what else is softer than stated.
- The work is from 2018 to 2022. The site does not say so on this page. There are no dates on the page at all.
- "taught myself to code by building the tools the desk was missing" with no title. The resume says he was promoted to Developer Analyst. The site leaves out the part where the employer formally recognized the engineering.
- Etainement, the most recent paid engineering job and the longest (2022 to 2026), gets three short paragraphs, no visuals, and sits at the very bottom. The Chrome extension paragraph is the best single paragraph of engineering description on the entire site ("Cross-origin messaging, DOM automation against sites hostile to automation, and state kept in sync between systems never designed to talk to each other") and it is the last thing on the page.
- That same paragraph has a second reading. "Altered Ticketmaster's venue maps in-page" and "sites hostile to automation", for a ticket broker's buyers, will read to some people as tooling built to work around a marketplace's intent. Most engineering managers will see hard DOM work. A screener at a marketplace, a platform-integrity team, or anyone who dislikes ticket resale will see something else. It is honest; it needs to be a conscious choice.
- No scale anywhere: how many traders used the console, how many events a day, how much inventory the portal priced.
- The In-Play Odds Tracker is described as "a Python tool" that makes a chart. It is the slightest of the four and dilutes the three stronger ones.

Thin evidence: Etainement entirely. No dates, no numbers, no team size.

Over-explained: nothing. This page is the opposite; it is the one place the prose is as tight as the work deserves.

Buried: this whole page. It is third in the ledger, labelled "Internal tools", third in the nav, under a title that undersells it. The odds console video is the only moving proof of engineering on the site and nobody sees it without two deliberate clicks.

### About

First five seconds: "From the trading desk to the App Store." Good line, clear arc.

What a skeptic questions:

- "holding a quality bar when no one is checking" and "writing decisions down because future-me is the only reviewer" are claims of rigor from someone with, as far as the site shows, no code review history and no team engineering experience since 2022, and before that inside a brokerage and on a trading desk. The page names this gap itself ("the sharpening that only comes from strong colleagues"), which is disarming and correct, and also confirms the concern rather than answering it. Nothing on the site shows Scott working with another engineer.
- The fifth paragraph ("The honest version of why a founder is job-hunting") answers the question every screener has: will he leave when Prava takes off, and will he be distracted? It is the right question to answer. It is also 120 words of personal finances and family on a page a screener gives sixty seconds. "A product this young doesn't pay a salary" next to the Prava page's "paying for itself" will be noticed.
- "I genuinely miss the thing an office is actually for" reads as a preference for in-person work. That matters if he is applying to remote roles.
- No location. No statement of what kind of role or team.

Thin evidence: the page is all narrative. That is fine for an About page.

Over-explained: the job-hunting paragraph and the paragraph before it make the same point (I want colleagues) twice.

### Connect

First five seconds: email, GitHub, LinkedIn, resume. It does its job.

What a skeptic questions: the GitHub link. They click it and find a profile located in Las Vegas, a headline calling him an "AI / GenAI Engineer" (the site says "Software engineer & founder"), a claim of 22 GenAI features (the site says thirteen), and a repo list whose only substantial public code is this portfolio and JavaScript exercises from 2021 (hangman, stopwatch). The four "Public" repos are READMEs. For a candidate whose pitch is "I ship", the contribution signal visible to an outsider is close to empty because the real work is in private repos.

The resume, once downloaded, has dead links, a wrong LinkedIn address, and a relocation date in the past.

### Where the strongest proof sits

| Proof | Where it is now | Clicks from home | Above the fold there? |
| --- | --- | --- | --- |
| Caesars live odds console (video) | Experience, first band | 1, via a ledger row labelled "Internal tools" | No. Below the header and two paragraphs. |
| Arbitrage detector across about fifty books | Experience, fourth band | 1 | No. Bottom of the first section. |
| AI cost work in three waves | Prava, section 03, first subsection | 1 | No. Roughly the fourth screen down. No numbers. |
| Prompt versioning and snapshot-tested fallbacks | Prava, sections 02 and 04 | 1 | No. Evidence image at the very bottom and self-undermining. |
| Chrome extension rewriting Ticketmaster's maps | Experience, final paragraph | 1 | No. Last paragraph of the page, no visual, no date. |
| Promotion from trader to developer analyst | Resume only | 2, plus a download | Not on the site. |
| Voice pipeline, multi-provider failover, twenty CI scanners | Resume only | 2, plus a download | Not on the site. |

Nothing in this table is visible or even named on the home page.

## 4. Technical health

### Versions

| Package | Installed | Latest | Note |
| --- | --- | --- | --- |
| next | 16.2.11 | 16.3.8 | Pinned exactly, so `npm update` will not move it. See advisories below. |
| eslint-config-next | 16.2.11 | 16.3.8 | Moves with Next. |
| react, react-dom | 19.2.4 | 19.3.0 | Pinned exactly. |
| @types/react, @types/react-dom | 19.2.x | 19.3.0 | In range. See the View Transitions note. |
| typescript | 5.9.3 | 7.0.2 | Major. Not urgent. |
| eslint | 9.39.5 | 10.11.0 | Major. Not urgent. |
| @types/node | 20.x | 26.x | Tracks the CI Node version. |
| Node in CI | 20 | | Node 20 reached end of life in April 2026. Local machine runs Node 22. |

`npm audit --omit=dev` reports four advisories: one critical, three high.

- Next.js below 16.3.6, critical: remote code execution on Windows-hosted servers; remote code execution in the Image Optimization API when AVIF is used; remote code execution in `next/og` ImageResponse.
- sharp (through Next), high: inherited libvips and libheif vulnerabilities.
- postcss (through Next), high: several source map and stringify issues.
- nanoid, high: infinite loop with zero size.

Practical exposure is probably low: the site is on Vercel, which runs image optimization on its own infrastructure; the Open Graph image and icons are generated at build time, not per request; AVIF is not enabled. But this site uses both `next/image` and `next/og`, the repo is public, and "portfolio runs a framework version with a known critical RCE" is an avoidable thing for a reviewer to find. The fix is the move to 16.3.8, which is a minor version bump with an experimental flag in play, so it needs a build and a click-through, not a blind bump.

### Lint and types

- `tsc --noEmit`: clean, exit 0.
- `eslint .`: clean, exit 0, no warnings.
- No tests of any kind. For a static content site that is defensible. It is slightly awkward next to copy about snapshot tests and CI scanners.

### Performance concerns assessable statically

Good:

- All images are static imports through `next/image`, so width and height are known and they do not shift layout. Served as resized WebP.
- Fonts go through `next/font`, self-hosted with fallback metric adjustment.
- All pages are static. Vercel cache hits confirmed.
- No animation library, no client data fetching, no third-party scripts, no analytics.

Concerns:

- The Experience video has no `width`, `height`, or `aspect-ratio`, and no `poster`. With `preload="metadata"` the element starts at the browser default height (150px) and jumps to its real height once metadata arrives. This is a layout shift on the first band of the page. On iOS Safari a video with no poster commonly shows an empty box until tapped, so the best proof on the site may render as a blank rectangle on phones. Needs a device check.
- Four font files are preloaded on every page (three families: Schibsted Grotesk at two weights, Inter variable, IBM Plex Mono at two weights). That is a lot of render-priority bytes for a text site. Plex Mono 500 and 400 are both used widely; Schibsted 500 is used only for `.subheading`.
- JavaScript: the Prava page references nine script files totalling roughly 200 KB compressed, including the legacy polyfill chunk. Nearly all of that is framework baseline. The site's own client code is four small components. This is normal for Next and heavy for what the pages do. Not worth fighting.
- Source images are larger than needed: `incognito-before.png` is 6.1 MB. Visitors never get it raw, but the first uncached optimizer request for each size has to decode it, and the repo carries about 12 MB of PNG.
- The lightbox requests `sizes="92vw"`, so on a large display it pulls the 3840px variant of a screenshot. Acceptable, since it is on demand.
- Lamplight repaints a full-viewport fixed gradient on every pointer frame. It is coalesced with `requestAnimationFrame` and cheap on any modern machine. Fine.
- `sitemap.ts` stamps every URL with the build time. Harmless.
- No security headers beyond HSTS (no Content-Security-Policy, no `X-Content-Type-Options`). Low stakes for a static site; an easy thing to add for a reviewer who looks.

### Accessibility

Good:

- A global `:focus-visible` ring (2px accent, 3px offset). Hover effects on links, ledger rows, and arrows all have keyboard parity.
- Reduced motion is handled properly: movement lives inside `prefers-reduced-motion: no-preference` blocks, there is a global override as a backstop, view transitions are disabled, Lamplight and ScrollReveal both exit early.
- Every image has descriptive alt text. Decorative arrows are `aria-hidden`.
- `aria-current="page"` on the nav. `lang="en"`. Landmarks present (`header`, `nav`, `main`, `footer`, labelled `aside`).
- Contrast, computed from the tokens: body dim text on paper 6.4:1, dim text on the raised surface 5.8:1, accent on paper 5.0:1, accent on the raised surface 4.6:1, ink on the primary button 5.1:1. All pass AA for normal text. `--accent-bright` on paper is 3.4:1 and is used only for underlines and arrows, as the README says.

Problems:

- Heading order on case studies. On Prava the numbered eyebrows ("01: The problem") are paragraphs, and section 04 has no heading at all, so a screen reader's heading list skips "The back office" entirely. On Incognito Wraps only section 01 has a heading; sections 02 to 05 have none. On Experience the eyebrows are real `h2` elements. Three pages, three patterns.
- In the DOM, the spec card's `h2` ("Spec") comes before the case study's first section heading. Minor.
- The About page has an `h1` and nothing else. Fine for six paragraphs.
- Lightbox trigger: the button has `aria-label="View full size: {alt}"` and contains an image with the same alt. The label wins, so it is announced once. Fine. The trigger has no visible affordance at rest other than the zoom cursor, so keyboard and touch users get no hint that the image opens. The global focus ring does appear on focus.
- The lightbox close button is a bare "✕" with an `aria-label`. Fine. It is 44px square. Fine.
- The video has an `aria-label` but no text alternative describing what happens in it beyond the caption. There is no audio track, so captions are not needed.
- The caption says "Click to play." while native controls are shown. On touch devices that is "tap". Trivial.
- Nav link targets are about 37px tall. Slightly under the 44px guideline on touch.
- No skip-to-content link. With a sticky header and five nav links it is a small gap.

### Mobile layout at 390px (derived from CSS, not rendered)

- Navigation. There is no mobile menu. The brand and five mono links (about 42 characters plus gaps, roughly 440px of content) are in a wrapping flex row inside 342px of usable width. The brand takes one row and the links wrap onto two more. The sticky header is therefore about three rows, on the order of 130 to 140px, permanently pinned on an 844px-tall screen. That is about a sixth of the viewport, on every page, while scrolling. Needs a device check for the exact figure; the wrap itself is certain.
- Screenshot bands. The band sits inside the container and adds its own 1.5rem of side padding, so images are about 294px wide at 390px. Phone screenshots in the Prava hero go two by two at about 135px each, which is fine. The desktop admin screenshots (cockpit, Prompt Lab, simulator) and all three Experience screenshots render about 294px wide from sources over 3000px, so their text is unreadable.
- Lightbox on phones. The opened image is capped at 92vw, about 359px. For a landscape desktop screenshot that is barely larger than the 294px thumbnail. The lightbox gives no real zoom on mobile, and because the dialog is modal the visitor cannot pinch the underlying page either. So the engineering screenshots are effectively unreadable on a phone. Recruiters open links on phones.
- The home ledger, the fact lists, and the case study grid all have explicit small-screen rules and look sound.
- Case study pages put the spec card first on mobile, which is the right call.
- "Caesars Sportsbook & Etainement" in the ledger gets its own full-width row at mobile, which should fit at 15px mono but is close (31 characters, about 290px in 326px available).

### Lightbox

Sound overall: native `<dialog>` with `showModal()` gives focus trapping, top layer, and Escape for free; focus is returned to the trigger explicitly; body scroll is locked and restored; clicking the scrim closes.

Fragile points:

- Scroll lock is `document.body.style.overflow = "hidden"`. On platforms with classic scrollbars (Windows, or macOS with scrollbars always shown) the scrollbar disappears and the page behind shifts sideways by its width, visible through the 96 percent opaque scrim. There is no `scrollbar-gutter` rule.
- On iOS Safari, `overflow: hidden` on body does not reliably prevent background scroll. The dialog covers the viewport so the effect is mostly hidden.
- State is kept in two places (React `open` and the dialog's own open state) and reconciled with three mechanisms: the `close` event, a `keydown` backstop for Escape, and the `close()` helper. It works. The comments say the `close` event "doesn't fire in every engine", which suggests this was tuned against observed behavior, so it should not be simplified without retesting.
- Every Lightbox instance renders its own `<dialog>` element. There are seven on the Prava page. Harmless at this count.
- No zoom or pan inside the dialog, which is the mobile problem above.
- The dialog image is conditionally rendered only when open, so nothing is fetched until needed. Good.

### View Transitions

- Depends on `experimental.viewTransition` in `next.config.ts` and on React's `<ViewTransition>` export, which Next's bundled React provides but the stable type package did not declare when this was written. `types/react-view-transition.d.ts` hand-declares it.
- Fragility one: it is an experimental flag. A Next upgrade (including the 16.3.8 security upgrade) can change or rename it. The failure mode is benign: navigation falls back to a hard cut.
- Fragility two: if a newer `@types/react` starts exporting `ViewTransition` itself, the hand-written `export const ViewTransition` will collide and `tsc` will fail. `@types/react` 19.3.0 is inside the declared `^19` range. CI uses `npm ci`, so the lockfile protects it until someone runs `npm install` or `npm update`. Worth checking as part of the upgrade.
- `app/template.tsx` remounts on every navigation, which is what drives the enter and exit classes. The header and footer are pinned with their own transition names. The CSS suppresses root, header, and footer animation correctly.
- Unsupported browsers and reduced-motion users get a hard cut. Correct.

### IntersectionObserver (ScrollReveal)

The design is careful: content is visible by default, the hidden state is added by script only to elements below the first viewport, only when motion is allowed, and it is cleaned up on route change.

One real defect, derived from the numbers:

- The observer uses `threshold: 0.15`, meaning 15 percent of the element must be visible. For an element taller than the viewport, the most that can ever be visible is viewport height divided by element height. If that is under 0.15, the callback never reports an intersection and the element stays at opacity 0 permanently.
- The Caesars block on Experience is one `.section` containing four media bands and all the prose. At desktop container width it is roughly 3,300px tall, so it needs a viewport at least about 500px tall to ever reach 15 percent. On a phone in landscape (about 340 to 390px of height, section roughly 2,800px tall, best case ratio about 0.12 to 0.14) the threshold cannot be met.
- On a normal desktop window the section starts within the first 85 percent of the viewport, so it is never hidden in the first place. The failure needs both conditions: section starts below the fold and the viewport is short. That means landscape phones, short browser windows, and desktop users at high browser zoom.
- Consequence when it happens: the entire Caesars section, which is the strongest evidence on the site, is invisible with no way to reveal it.
- This was derived from the CSS and the image dimensions, not observed. It needs a two-minute check in a browser with a short window. If confirmed, it is a must-fix.

Smaller points:

- `.screenshotBand` elements nested inside a `.section` are both targets, so a band can be hidden inside a hidden section and the two reveal independently. It works but produces a double fade.
- The effect keys on `pathname`. If a page's content changed without the path changing, new elements would not be observed. There is no such case on this site.

## 5. Gaps

Only gaps that affect whether someone gets an interview.

1. Nothing a reader can verify about AI engineering. The site uses the right words (versioned prompts, snapshot-tested fallbacks, small-model routing, prompt caching, cost telemetry) and shows no artifact for any of them. In 2026 these words are on most resumes. What separates a real practitioner is evidence: a redacted prompt diff across two versions, the shape of the usage-event table, a before and after cost per request, a cache hit rate, the test that pins a fallback, one example of a regression that a test caught. The one artifact that is shown (the Prompt Lab screenshot) argues against the claim.

2. No evaluation story. "Snapshot tests on fallbacks" proves the fallback text did not change. It does not show how Scott knows a prompt change made outputs better or worse, or how "quality held" was decided when five surfaces moved to a smaller model. For an AI-flavored engineering role this is the first question an interviewer asks. If evals exist they are not on the site. If they do not, that is worth knowing before an interview rather than during one.

3. No numbers on the cost work. "Three waves" with no percentage, no dollar range, no per-request figure. Relative numbers (a percentage reduction, a cache hit rate) do not reveal revenue or user counts, so the "numbers off the internet" policy does not need to cover them.

4. No visible code. Prava is private. The four Caesars repos are READMEs. Etainement is proprietary. The only real code a reviewer can read is this portfolio and 2021 exercises. For a self-taught candidate with no degree in the field and no well-known employer brand in engineering, a readable code sample is the cheapest way to answer "but can he actually write it".

5. No GitHub signal that matches the pitch. The profile location, bio, headline, and feature count all disagree with the site, and the pinned work does not show recent activity because the activity is private.

6. No location, availability, or role statement on the site. The target is Seattle-area or remote. The site says neither. Many screeners filter on this before reading anything else.

7. No writing. One solid technical post would do more than another case study section: it shows how Scott reasons, it is linkable in an application, and the material already exists (the cost work, or the prompt fallback design, or the Ticketmaster extension's state sync).

8. No evidence of working with other engineers. The About page names this honestly. Anything real would help: a former colleague's line, a description of how features were handed off with brokers and reviewed at Etainement, how the Developer Analyst role interacted with the Caesars engineering organization. If there is nothing, that is a question for interviews, not something to manufacture.

9. Dates on professional work. The Experience page has no years. A reader cannot tell the Caesars tools are from 2018 to 2022 or that Etainement ran to 2026 without downloading the resume.

10. The resume is not reachable from the home page, and when reached it has no working links.

Deliberately not listed: testimonials, a blog engine, dark mode, a contact form, analytics, structured data, per-page social images, more projects.

## 6. Leans

Ranked by expected effect on getting an interview. Sizes: "part" means part of one Claude Code session, "one" means one session, "several" means more than one. Anything that changes copy needs Scott's words, per the standing rule that copy is transcribed and not authored.

### Must fix before the next application goes out

**1. Resume header and links.**
Chooses between: sending the July PDF as is, or reissuing it.
Lean: reissue. Fix the location line to whatever is true today, print the real LinkedIn address or claim the short one, make every URL a live link, set the PDF title and author, and name the file `Scott-Barclay-Scott-Barclay-Resume.pdf`.
Why: the resume is the document most likely to be read, and its first line is currently wrong on its face. A relocation date in the past is the kind of small error that gets a careful candidate filed as careless. The dead LinkedIn text can send a recruiter to a stranger.
Size: part. The resume source is not in this repo, so Scott edits the document; a session only swaps the file and renames the download.

**2. Make site, resume, and GitHub profile tell one story.**
Chooses between: three slightly different self-descriptions, or one.
Lean: pick one set of facts and apply it everywhere: employer naming, the Caesars and Etainement years, how long Prava has been going and whether it was full time, the count of AI surfaces (thirteen, eleven, or 22), the title ("Software engineer & founder" versus "AI / GenAI Engineer"), and location.
Why: each mismatch is small. Together they are what a skeptical reader uses to decide the candidate rounds up. A screener who checks two sources and finds 13 and 22 will not ask which is right.
Size: part for the site once Scott rules on the facts. The GitHub profile is outside this repo.

**3. Say where Scott is and what he wants, on the site.**
Chooses between: leaving location and availability to the resume, or stating it on the home and Connect pages.
Lean: state it. One line: location, remote or hybrid preference, the kind of role.
Why: Seattle-area or remote is the whole target and the site never says either word. It is the cheapest high-impact change available. It also softens "founder" in the eyebrow, which otherwise makes some readers assume he is not really looking.
Size: part.

**4. Stop the "public repo" links from disappointing.**
Chooses between: (a) leaving them, (b) relabelling them as what they are (write-ups with demos), (c) removing them, (d) publishing real sanitized code.
Lean: (b) now, and consider (d) for one tool later. Change the lede's "sanitized public repo" wording and the link labels so nobody expects code.
Why: right now the best page on the site contains four clicks that each reduce trust. The fix is a wording change. Publishing code is better but depends on what Scott still has and is permitted to release, and the code is four years old.
Size: part for the relabel. Several for publishing real code.

**5. Replace or re-caption the Prompt Lab screenshot, and bring the Prava page up to the shipped app.**
Chooses between: leaving July's description, or re-truing it against version 4.5.1.
Lean: re-true. At minimum: retake the Prompt Lab screenshot now that prompts have real version history (or caption what the fallback column means), confirm whether circles, the weekly framing, and the journal screen still exist and replace screenshots that show removed features, and reconcile the surface count.
Why: the Prava page is the flagship and the App Store link is its best asset. Anyone who follows that link lands on a product with a different name and a different feature list. The Prompt Lab image is the only AI engineering evidence on the site and it currently contradicts the text beside it.
Size: one, after Scott supplies new screenshots and rulings on the copy.

**6. Upgrade Next to 16.3.8 and move CI to a supported Node.**
Chooses between: staying on 16.2.11 or taking the patch.
Lean: upgrade, verify view transitions and the custom type shim still build, bump CI to Node 22.
Why: a critical advisory covering the two Next features this site uses, in a public repo, on a portfolio whose message is engineering discipline. Real risk is low. Reputational risk is nonzero and the cost is small.
Size: part.

**7. Confirm and fix the scroll reveal threshold, and give the video dimensions and a poster.**
Chooses between: trusting the current reveal logic, or making it safe for tall sections.
Lean: fix both. Lower the threshold to zero with a root margin, or stop observing `.section` on Experience. Add `width`, `height`, and a poster frame to the video.
Why: the failure case hides the single strongest section on the site, and the video is the single strongest asset. Both are a few lines.
Size: part.

### Worth doing

**8. Surface the engineering proof on the home page.**
Chooses between: the current three-row ledger, or a ledger that names the actual systems.
Lean: split the combined row into Caesars and Etainement with a concrete label each (for example the live odds console and the marketplace extension), move Incognito Wraps below them, add resume and GitHub links to the home actions, and consider one line under the hero that names two hard things. Retitle the Experience page.
Why: the home page is where most sixty-second reads end. It currently gives equal weight to an unlaunched brochure site and seven years of systems work, and labels the systems work "Internal tools". This is the largest gain available without new material.
Size: one. It touches the ledger design, which is marked as locked, so Scott has to agree to unlock it.

**9. Put numbers and artifacts under the AI cost work.**
Chooses between: prose only, or prose plus evidence.
Lean: add relative numbers for each wave and two or three real artifacts: a redacted prompt diff, the usage-event table's columns, a small before and after chart. Add a short paragraph on how output quality was judged when surfaces moved to a smaller model.
Why: this is the gap between "says the words" and "did the work", and it is the differentiator for any role with AI in the title. It also gives interviewers something specific to ask about, which is how screens turn into conversations.
Size: one for the page, after Scott pulls the figures and artifacts from Prava. If the evaluation practice does not yet exist in Prava, building it there is several sessions in a different repo and worth doing for its own sake.

**10. Give Etainement its due.**
Chooses between: three short paragraphs at the bottom of Experience, or a proper section.
Lean: expand with dates, the venue map drawing detail from the resume, one scale indicator, and a visual if any can be shown (even a diagram of portal, extension, and marketplace). Decide deliberately how to phrase the automation line.
Why: it is the most recent paid engineering job, the longest, and the hardest browser engineering on the site, and it is currently the least developed section.
Size: one, depending on what Scott can show.

**11. Shorten the top of the Prava page for an engineering reader.**
Chooses between: opening on the personal origin paragraph, or opening on the product argument and moving the personal story lower or to About.
Lean: move it. Keep it, since it explains why the product exists and it is plainly sincere. Just do not make it the first 190 words a screener meets. Also add one sentence defending the Capacitor choice.
Why: sixty seconds on this page currently ends before any engineering appears.
Size: part, with Scott's ruling on the copy.

**12. One piece of technical writing.**
Chooses between: no writing, or a single post.
Lean: one post, hosted as a plain page on this site, on the cost work or the prompt fallback design. Not a blog.
Why: writing is the most direct evidence of how someone thinks, it is linkable in applications, and the subject matter is already done.
Size: one to wire the page. The writing is Scott's.

**13. Mobile pass.**
Chooses between: accepting the wrapping nav and unreadable desktop screenshots on phones, or fixing them.
Lean: fix. Compact the nav at small widths and let the lightbox image be zoomed or scrolled on small screens.
Why: a real share of first looks happen on a phone from a link in an email or a message. The current phone experience loses the back office and Experience screenshots entirely.
Size: one.

**14. Clean up the GitHub profile and this repo's README.**
Chooses between: leaving them, or aligning them.
Lean: align the profile with the site, pin this repo and the four write-ups, and rewrite the README's stale sections.
Why: the GitHub link is on Connect and on the resume. It is where a technical reader goes to check.
Size: part for the README. The profile is outside this repo.

**15. Heading structure on case studies.**
Chooses between: mixed patterns, or real headings for every numbered section.
Lean: make every numbered eyebrow a heading.
Why: small accessibility correctness that an engineer who checks will notice. Low effort.
Size: part.

**16. Decide Incognito Wraps' status.**
Chooses between: (a) keep as is, (b) finish and launch, then update, (c) demote to a short entry until it launches.
Lean: (c) unless launch is imminent. If it has launched, update it and add the live link the same day.
Why: "in staging" on a shipping record is a mild negative that gets worse with each month. A launched client site with a live URL is a mild positive.
Size: part.

### Skip

- TypeScript 7 and ESLint 10 major upgrades. No reader benefit, some risk.
- Per-page social images, structured data, sitemap date accuracy. Invisible to hiring.
- Dark mode. Not expected, and the design is built around paper.
- Removing Lamplight or view transitions to save bytes. They are cheap and they show taste.
- Converting source PNGs to another format. The optimizer already serves WebP. Shrinking the two Incognito sources is optional housekeeping.
- Deleting the unused `Todo` component and dead CSS. Harmless; do it only when in the file for another reason.
- A blog system, testimonials wall, contact form, visitor analytics, more side projects.
- Adding tests to this repo. A static content site does not need them, and tests added for show are worse than none.
- Reducing the framework JavaScript baseline. Not achievable without leaving Next, and no screener measures it.

## Questions only Scott can answer

1. Where do you live today, did the September move happen, and what should the location and remote preference line say?
2. What are the true dates: Caesars start and end, Etainement start and end, when Etainement went part-time, when Prava work began, and whether Etainement has fully ended?
3. Which count of Prava AI features is correct today: thirteen, eleven, or 22? And which title do you want everywhere?
4. Does Prava still have circles, the weekly-lectionary framing, the daily journal as pictured, commitments, and the Profile Simulator? Which of the seven Prava screenshots still match version 4.5.1?
5. What does the "Fallbacks (7d): empty-config" column in the Prompt Lab screenshot mean, and is there a current screenshot with real version history?
6. What relative numbers can you share for the three cost waves (percent reduction, cache hit rate, per-request cost change), and how did you judge that quality held on the five rerouted surfaces? Do evals exist?
7. Has Incognito Wraps launched? If not, when, and what is the live domain? Is the 4.7 from 126 reviews figure still current?
8. Do you still have the Caesars tool source, and are you permitted to publish a sanitized version of any of it? Are the screenshots showing Caesars branding and prices cleared to stay public?
9. Is Etainement comfortable being named next to a description of altering Ticketmaster's pages, and are you comfortable with how that reads to a marketplace or platform-integrity employer?
10. Is "paying for itself" still accurate for Prava, and do you want the App Store rating (4.95 from 40) on the site?
11. Is the home ledger design open for change, or is the layout still locked?
12. Are you willing to write one technical post, and on which topic?
13. Is there anyone who worked with you at Caesars or Etainement whose words, or whose working relationship with you, could be described on the site?
