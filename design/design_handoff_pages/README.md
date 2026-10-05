# Round 7: project pages, and Etainement as a system

Every project gets a page, at one of three depths, in one chrome; and Etainement's block in Work becomes the picture of a system rather than a diagram of one extension. Built against main as read on 2026-10-05 (app/tokens.css, app/globals.css, app/work/prava/*, components/frame, margin, work, footer, lib/og-image.tsx) and the four discovery reports under design/etainement/. Static design reference, not production code; the `.dc.html` files open in a browser with `support.js` and `pages.js` alongside; images from `assets/` at the project root and `svg/` here. Desktop from 960 up and the round 6 phone system are both preserved. No em dashes anywhere in the deliverables.

Public names: "Buyer extension" and "On-sale monitor". The internal name in the reports does not appear.

## Files

- `extension-1440.dc.html`, `extension-390.dc.html`: Buyer extension, Full. Five sections.
- `portal-1440.dc.html`, `portal-390.dc.html`: Pricing portal, Full. Six sections.
- `monitor-1440.dc.html`, `monitor-390.dc.html`: On-sale monitor, Standard.
- `arbitrage-1440.dc.html`, `arbitrage-390.dc.html`: Arbitrage detector, Note.
- `prava-1440.dc.html`, `prava-390.dc.html`: Prava, Full, refined (the top row's way back, the closing link, the chrome). Not restructured.
- `work-etainement-1440.dc.html`, `work-etainement-390.dc.html`: the employer block in Work, with the hero and three cells. The Tweaks panel switches the hero between the loop and the still.
- `storyboard.dc.html`: the hero loop frame by frame, with timings, and why it loops rather than scrubs.
- `spec.dc.html`: the page template: depths, title block, sections, margin and bar, the way back, OG images, motion.
- `diagrams.dc.html`: every diagram at once.
- `svg/`: every diagram as its own SVG, on the surface colour. `hero-venue.svg` (the loop, CSS animation inside the file, reduced motion honoured), `hero-venue-still.svg` (the fallback and the OG image, 1200 by 630), `five-origins`, `rule-path`, `rule-lifecycle`, `telemetry-funnel`, `queue-reconstruction` (each with a `-tall` variant for the phone), `pricer-wireframe`, `sheet-anatomy`, `monitor-queue-events` (the monitor's plate), `cell-portal`, `cell-extension`, `cell-monitor` (16:10), and `storyboard/f1` to `f8`.
- `pages.js`: the mockups' shared chrome behaviour (the current section, the margin or bar head, export frames). Not for production.
- `png/`: exports. Every page renders scrollable; `#frame=<section id>` (or `title`, `end`, with `&dy=N`) renders one static viewport for export.

## Answers

**One template, three depths.** Full is Prava's structure, kept: title block, plate, numbered sections, stack in the title block, links at the end. Standard is the same chrome with two sections, 01 What it does and 02 What was hard, one diagram each, and one plate. Note is the title block and three paragraphs, with "Walkthrough on request" and the way back as its links. The depths differ only in how many sections there are, so nothing in the chrome is conditional except the margin's chapters array.

**The margin on a Standard and a Note page.** Standard: 01 and 02, blank in the title chapter, exactly as Full. Note: no sections, so the chapters array is empty and the head never shows; the icons keep their place; on the phone the bar holds the nav alone. Rejected: the project's name as the Note page's label with no numeral. The margin reads section numbers; a page without sections has nothing for it to say, and a label alone would be the one place on the site the margin carries a title.

**The way back.** Three paths to one target, /#employer-NN: the top row's "II Work / 02 Etainement" link, the nav's II cell on a project page, and the closing "Back to Etainement in II Work". Main's employer anchors already land the title 24 under the frame and set chapter II, so nothing new is needed on the home page. The Etainement pages also link onward in a ring (Next: Pricing portal, Next: On-sale monitor, Next: Buyer extension), which is how a reader who came for one project meets the system.

**The hero is the system.** Named "The on-sale system", because no one of the three tools is the thing: the rule is. The plate is a built visual, a synthetic venue (Northside Arena, invented sections, invented prices) with a rule being drawn across section 105, the seats in its band lighting, the rule appearing in a panel, resolved to seat IDs at save, and the same seats ringed on the buyer's Ticketmaster screen. Looping at 14 seconds from 960 up; the still elsewhere and under reduced motion; the still is also the OG image. The storyboard has the frames and the argument for a loop over scroll-driving.

**Three cells, three built plates.** The pricing portal's rules panel, the extension's painted map at the buyer's zoom, the monitor's Queue: Events. Each is cropped from the same drawing vocabulary as the hero, so the block reads as one system in four plates.

**The diagrams.** Thin strokes, two colours (the dim and the rule), brass only for the thing that moves (the rule), lit only for a seat or a window of time. No cards, no node glows, no isometrics. Each diagram answers one question the text beside it asks: five-origins (where does the rule cross a boundary), rule-path (in what order), rule-lifecycle (how does a gesture become a row and two read paths), pricer-wireframe (what filters what), sheet-anatomy (what is rendered and what is only height), telemetry-funnel (which clock stamps the record where), queue-reconstruction (how a stream becomes two tables, on the hour). Five have tall variants for the phone, stacked rather than shrunk; two (the wireframe, the sheet) scale down because their shape is the point.

**What stays out, by the reports.** Accounts and cards, proxies and cookies and bot-defence work, binary availability feeds, staff monitoring, competitor intelligence, pricing thresholds (the synthetic $240 is a made-up limit on a made-up seat), hostnames and endpoints, staff names. The identity iframe is described as a cross-origin detection problem only. The two other developers are "one other developer" and "a colleague". No numbers beyond "over a hundred buyers" and "one of the larger US brokers"; the counts in the brief's own content (fifteen seconds, sixty hooks, three approaches, five origins) are the brief's.

**Copy.** Placeholder of the right length and structure, marked "Placeholder." at the head of each paragraph so none of it ships by accident. The ledes, spec rows, statements, and diagram labels are proposed as written. Scott writes the final.

**Prava, refined.** Only the chrome and the way back changed: the top row now reads "II Work / 01 Faith Platforms Inc." as a link, the closing link reads "Back to Faith Platforms Inc. in II Work", the rating's count is dropped from the top row on the desktop too (the phone already dropped it). Sections, copy, and plates are main's.

## Research: taken and rejected

Mobbin's library is behind a login; its public pattern pages were read for the list of case-study detail screens (Threads, Linear, Stripe among them). Public sources otherwise.

- Stripe's engineering posts (stripe.dev, and the older stripe.com/blog/engineering: DocDB, the Data Movement Platform): taken, the habit of one diagram per claim and a flow drawn left to right in boxes of one weight, and labelled arrows that name the message rather than the transport. Rejected: the pastel fills and the rounded-card boxes; Vigil has one rim and one surface.
- Linear's "How we build Linear" and changelog illustrations: taken, restraint, a dark ground, type as the diagram's main material, no icons. Rejected: the product-screenshot-as-hero pattern; there are no screenshots here and none can be taken safely.
- Increment magazine's diagrams (the Testing and Containers issues): taken, hairline strokes and small caps labels, legends written as a sentence under the figure. Rejected: colour-coded legends; brass means one thing here.
- The Pudding's scrollytelling (Scrollama, "How to implement scrollytelling", "Making It Big"): read for the scroll-driven option. Taken: the argument that a pinned graphic should change only while the reader is looking at it. Rejected for the hero: the sticky-graphic pattern itself, which asks the reader to scroll in order to see the paint; the plate loops instead, and the storyboard says why.
- Venue map references (Ticketmaster's own interactive map, SeatGeek's, the seating-chart illustration style used by venues): taken, the fan of section blocks around a stage, seats as dots in rows, section numbers in the gaps. Rejected: section fills by price tier (that is the marketplace's job and would read as a screenshot), 3D or tilted views, any likeness of a real venue.
- Chrome's own extension architecture diagrams (service worker, content scripts, isolated worlds): taken, the vocabulary of "worlds" and the dashed box for a boundary the extension does not own. Rejected: the browser-chrome drawings around them.

## Open items

- The hero loop uses a CSS animation inside the SVG. Loaded through an `img`, it runs but cannot be paused by script; in production the SVG should be inlined so it pauses off screen and honours `prefers-reduced-motion` from the page, and so the diagrams take the page's JetBrains Mono (through an `img` they fall back to the system mono).
- The screenshot tool used for `png/` cannot rasterise the animated SVG; the Work block's exports show the still. The loop is in `work-etainement-1440.dc.html` as the Tweaks default.
- The numbered-item sizes (26/19 on the desktop) are Prava's decisions pattern reused for seven hard parts; if seven feel heavy at that size, 24/18 is the next step down, not a new pattern.
- The portal page has six sections and the margin runs to 06; main's margin supports five boundaries today (globals.css registers `--lead-1` to `--lead-5`). One more pair is needed.
- The Work index gains one line for Etainement (The on-sale system); the index's tallest-tier arithmetic (round 5) already counts it.
- Years, roles, and every paragraph marked "Placeholder." remain the brief's placeholders.
