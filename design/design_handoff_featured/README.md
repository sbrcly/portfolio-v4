# Round 9: the featured project

The Buyer extension is promoted to the site's featured project at a new depth, Featured, above Full; the Etainement block in Work leads with it; four new diagrams and three refreshed ones carry the page. Built against main as read on 2026-10-06 and the round 7 and round 8 handoffs; the four discovery reports under design/etainement/ are the source for every fact. Static design reference, not production code; the `.dc.html` files open in a browser with `support.js` and `pages.js` alongside; drawings from `svg/` here, two cell plates copied from round 7. No em dashes anywhere in the deliverables; the internal name from the reports, the approval tool's name, and the four words the brief bars do not appear (checked by script over every page and drawing).

**The two notes landed after the first pass.** `design/etainement/EXTENSION_API_NOTES.md` and `EMAIL_HOOK_NOTES.md` were read on main and 04, hard part ix, 08, and the code-relay and port-scheduler drawings were corrected against them: the service polls the store (every ten seconds, up to ninety), not the worker, and the worker's response is held open, including while queued; a code from the last fifteen minutes is returned without opening a port; the port is released on every exit path; text codes are in Firestore and mail codes in Postgres, upserted latest-per-address by a hook that runs once per email. Section 05 and hard part viii still rest on the extension report and the brief. Every paragraph remains marked "Placeholder." for Scott's wording; nothing from the notes is quoted.

## Files

- `extension-1440.dc.html`, `extension-390.dc.html`: Buyer extension, Featured. Nine sections.
- `work-etainement-1440.dc.html`, `work-etainement-390.dc.html`: the Etainement block in Work. The hero is the extension; Pricing portal and On-sale monitor stay as cells. The Tweaks panel switches the hero between the loop and the still.
- `diagrams.dc.html`: the hero and the seven diagrams at once, wide beside tall.
- `svg/`: `hero-extension` (the loop's artwork, with the animated groups classed; the page inlines it and animates it, and swaps to the still under reduced motion) and `hero-extension-still` (the fallback, the phone's plate, and the OG image, 1200 by 630); the four new drawings `system-map`, `code-relay`, `port-scheduler`, `approval-desk`; the three refreshed `five-origins`, `rule-path`, `telemetry-funnel`; each with a `-tall` variant for the phone; `cell-monitor` copied from round 7 unchanged; `cell-portal` copied with its three synthetic price limits removed, since no price may appear on this page.
- `pages.js`, `support.js`: the round 7 mockup chrome, unchanged. Not for production.
- `png/`: exports. Every page renders scrollable; `#frame=<section id>` (or `title`, `end`, with `&dy=N`) renders one static viewport. The loop cannot be rasterised by the screenshot tool, so the hero exports show the still.

## The Featured template

Featured is Full with four additions, and nothing in the chrome changes.

1. **A hero plate that moves.** The title plate is the loop, 14 seconds, from 960 up; the still elsewhere and under reduced motion; the still is the OG image. Full's plate is a still only.
2. **A system section.** 02 The system names every part the project talked to and carries one diagram with the project at the centre and one labelled flow on each edge. Full describes the project; Featured describes the system around it.
3. **More sections, and two diagrams where one would not do.** Nine sections against Full's five or six; 03 and 04 each carry two drawings (five-origins and rule-path; the sequence and the scheduler). Hard parts run to nine. Full keeps one drawing per section and seven hard parts.
4. **An outcome section.** 09 closes the page on what happened and the links row (Walkthrough on request, Next, Back). Full's last section is What I would do differently and carries the links itself.

Everything else is Full: the title block (lede, Role, Stack, Where, Code), the top row's way back, numbered sections with a statement and two or three paragraphs, the margin's numeral and label, the ring and the ways back. The top row gains one word, "Featured", in brass, before the years; it is the only mark of depth on the page.

**Nine sections and the margin.** The margin runs to 09. Round 7 noted that main's margin registers five boundaries (`--lead-1` to `--lead-5`); the portal needed six and this page needs nine. The arithmetic does not change; the count does.

## Answers

**The five parts, by name.** Pricing portal; the extension; Ticketmaster's pages; the approval desk (the third-party order-approval tool, never named); the code relay (the Express service and the Python mail hook behind the SMS gateway and the inbox). The telemetry's warehouse and Firestore are not a sixth part; they are where the extension's records go, and 06 and its funnel carry them.

**Each diagram's question.** system-map: what are the five parts and what passes between them (brass is what the extension carries, grey what it reads, dashed boxes pages it does not own). code-relay: how a code gets from a port or an inbox to the clipboard (a sequence, six lanes, eight steps and one alternate, brass from the moment the code exists; the check-first and the held response are steps 02 and 03). port-scheduler: why only one port is ever open per group (gateways, groups, the open port, the queue; counts and IDs invented). approval-desk: what the manager sees after the extension has been through the table (matching rows, the per-event gauge, the bonus button and its Slack post; every row invented, no prices, no names). five-origins and rule-path are the round 7 drawings redrawn to the round 8 vocabulary: 10-point labels, the rim stroke, dashed rim for what the extension does not own, brass for the worker and the paint. telemetry-funnel was already in that vocabulary and is regenerated unchanged in substance.

**The hero.** The venue is the round 7 synthetic venue (Northside Arena, invented sections) drawn on the buyer's side only: the Ticketmaster event page's map with the extension's overlay painted in the order the code paints it. Rings on the fifteen seats rule 01 names in section 105 at 1.0 to 2.1 seconds, the section fill at 3.1, the note at 3.8, the stop overlay at 9.8 to 12.3, everything out by 13.4, loop at 14. The SVG file carries no timing of its own: neither a `style` block nor SMIL `animate` elements survive the project's SVG save (round 7's `hero-venue.svg` has the same gap and never looped). So the page animates it: on the desktop the 1440 pages fetch `hero-extension.svg` and inline it into the plate, and the keyframes in the page's head drive the `.rB`, `.rC`, `.rD`, `.fill`, `.note`, and `.stop` groups. That is also the production shape: inline the SVG, keyframes in the stylesheet. The still shows rings, fill, and note, with the stop overlay as a small panel on the right so the still says all four things without one covering the other three. Reduced motion is the page's job, not the file's: `syncHero` swaps the plate to `hero-extension-still.svg` when the setting is on, and the phone always shows the still. Inlined, it also takes the page's JetBrains Mono and can be paused off screen.

**The Work block.** The hero is "Buyer extension" with a "featured · Chrome extension · proprietary" note, the loop as its plate, a placeholder sentence, the full stack, and "Read the case study". The system hero of round 7 is retired: with the extension featured, the system is told on its page in 02, not in Work. Pricing portal and On-sale monitor stay as cells in the two-column grid. The margin's Work index for Etainement now reads Buyer extension, Pricing portal, On-sale monitor; the "The on-sale system" line goes.

**The ring.** Buyer extension to Pricing portal to On-sale monitor and back, as round 7, with the round 7 pages linked where they are. The way back is unchanged: the top row's "II Work / 02 Etainement", the nav's II, and the closing link, all to `/#employer-02`.

**What stays out, by the reports and the brief.** Account handling, detection and avoidance work, the password-reset path, hostnames, endpoints, keys, staff names, prices, real inventory. The identity iframe is a cross-origin detection problem only. The code relay is described as moving one string from where it landed to where it was needed; the drawing has no line numbers, no code values, no gateway IDs. The approval tool is "the approval desk". The synthetic $240 of round 7 is gone from every drawing on this page; the note reads "max 4" alone. The bonus is a button and a Slack post; no amounts.

**Copy.** Placeholder of the right length and structure, marked "Placeholder." at the head of each paragraph so none of it ships by accident. The ledes, spec rows, statements, and diagram labels are proposed as written. Scott writes the final; the two notes files settle 04, 05, viii, and ix.

## Open items

- The notes' reviewer's-notes items (disabled key middleware, SQL interpolation, per-call connections) are left off the page by design; they are interview answers.
- The margin: nine boundaries on this page; main registers five.
- employers.ts: the extension entry gains `depth: "featured"` and becomes the employer's hero; the two remaining cells keep their pages; the system hero entry goes. pages.ts: the ring is unchanged. Diagram.tsx: seven names with `true` in TALL.
- The hero SVG is inlined by the page, as production should do; the keyframes live in the page, not the file. Reduced motion swaps to the still, as the mockup does.
- The Work index on the home page: the Etainement tier loses one line and reorders; round 5's tallest-tier arithmetic still holds.
- Years, roles, and every paragraph marked "Placeholder." remain the brief's placeholders.
