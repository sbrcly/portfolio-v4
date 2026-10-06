# Round 8: the Prava back office

Four of the twelve back-office tools get Standard pages in the round 7 template, the Prava page is corrected to match, and the Faith Platforms grid in Work carries the plates and links the pages need. Built against main as read on 2026-10-06 (components/work/employers.ts, pages.ts, WorkCell, ProjectLinks, components/project-page/*, components/diagram/*, app/work/[slug]/page.tsx) and the round 7 pages under design/design_handoff_pages/. Static design reference, not production code; the `.dc.html` files open in a browser with `support.js` and `pages.js` alongside; images from `assets/` at the project root and `svg/` here. No em dashes anywhere in the deliverables; the internal name from the Etainement reports does not appear.

**The discovery document was not on main.** `design/prava-back-office/BACK_OFFICE_DISCOVERY.md` is not in the tree at the commit read, so the copy is built from the brief's facts, main's Prava page, and the four diagram briefs. Every paragraph that goes beyond those is marked "Placeholder." and should be checked against the document when it lands; the diagram labels are the brief's terms and should be checked the same way.

## Files

- `prompt-lab-1440.dc.html`, `prompt-lab-390.dc.html`: Prompt Lab, Standard. 01 What it does (the prompt read path), 02 What was hard (the entity, version, pointer model).
- `analytics-1440.dc.html`, `analytics-390.dc.html`: Analytics dashboard, Standard. 01 (the presence union), 02 (the definition-change marker and the cost table; no diagram).
- `lectionary-1440.dc.html`, `lectionary-390.dc.html`: Lectionary authoring tool, Standard with a third section. 01 (the date-to-slot pipeline), 02 (the readiness horizon), 03 What holds it (the facts: twelve weeks, twelve traditions, 9,002 assertions, rights).
- `commitments-1440.dc.html`, `commitments-390.dc.html`: Commitment library, Standard. 01 (the selection funnel), 02 (the Act pillar out of the client since July 2026, the server side kept, the feature returning; no diagram).
- `prava-1440.dc.html`: the Prava page, corrected, not restructured. See below.
- `work-faith-1440.dc.html`: the Faith Platforms block in Work: Prava as the hero with "Read the case study" and the App Store, then four cells, each with its plate and "Read the case study".
- `diagrams.dc.html`: the six diagrams at once, wide beside tall.
- `svg/`: each diagram as its own SVG on the surface colour, with a `-tall` variant for the phone: `prompt-read-path`, `entity-version-pointer`, `date-to-slot`, `readiness-horizon`, `presence-union`, `selection-funnel`.
- `pages.js`, `support.js`: the round 7 mockup chrome, unchanged. Not for production.
- `png/`: exports. Every page renders scrollable; `#frame=<section id>` (or `title`, `end`, with `&dy=N`) renders one static viewport.

## Answers

**Where the facts went.** Built and used by one person: the Role row on all four pages, and the Prava back-office paragraph. Eleven governed AI surfaces, thirteen at launch: the Prompt Lab's top row and facts, the Prava page's AI fact and back-office paragraph, the Work hero's sentence. The 143-cell identity matrix: the Prompt Lab's facts (one cell per surface and tradition is the mockup's reading; check it). Twelve weeks and 9,002 pinned assertions: the lectionary page, sections 01 and 03, and the date-to-slot drawing's note. About four hundred acts: the commitment library's top row, lede, and section 01. Twelve tools over 140 admin routes: the Where row on all four pages and the Prava back-office paragraph. The Act pillar's removal is stated plainly in the commitment library's 02, first paragraph, unmarked, because it is the brief's sentence and not a guess.

**Eight sections, six diagrams.** The brief names six drawings for eight sections, and two of them (date-to-slot, readiness horizon) are the lectionary's. So the lectionary has two diagrams and a third section of facts, the Prompt Lab has two, and the analytics dashboard and the commitment library have one each, in 01. Their 02 sections close on text and the links row, as the template allows. If Scott wants both to carry a drawing, the candidates are the definition-change marker as a timeline (analytics) and the pillar's client and server halves with the flag between them (commitments).

**Each diagram's question.** prompt-read-path: what happens between a surface asking and a prompt arriving, and where the fallback joins. entity-version-pointer: how an edit becomes what is served, and what stands in the way when it fans out. date-to-slot: how a date becomes a set of readings for any tradition. readiness-horizon: which week is actually ready, and why. presence-union: what "present" counts, and where the timezone is applied. selection-funnel: how about four hundred acts become one. Vocabulary as in round 7: thin strokes, the dim and the ink, brass only for the thing that moves or decides (the ledger, the pointer, the first candidate, Ready, the fold, the pick), lit only for a note. Four flows have tall variants that stack; the horizon turns on its side (weeks as rows) and the union stacks its three stages.

**The plates.** One capture per page, 16:10 at 2x, from `public/images/captures/`: `prompt-lab-history-diff`, `analytics-engagement`, `lectionary-week-readings` (to be replaced by a staging capture), `commitments-commitment`. Only the analytics capture is on main today; the mockups show the three others as the existing `prava-prompt-lab`, `prava-lectionary-tool`, and `prava-commitment-library` screenshots cropped to 16:10 from the top left, and each `img` carries the capture's path in `data-capture`. Prompts, groundings, and teaching text may appear in a capture; user names, emails, and journal text never. The lectionary and commitment stand-ins should be checked for that before they ship anywhere, which is one more reason the staging capture replaces them.

**The ring.** Faith Platforms' Full and Standard pages now number five, so pages.ts gives each a Next: Prava to Prompt Lab to Analytics dashboard to Lectionary authoring tool to Commitment library and back to Prava. The Prava page's closing row gains "Next: Prompt Lab" for that reason alone. The way back is the round 7 way back: the top row's "II Work / 01 Faith Platforms Inc.", the nav's II, and the closing link, all to `/#employer-01`.

**The Prava page, corrected.** "Thirteen AI surfaces" reads "eleven (thirteen at launch)" in the AI fact and the back-office paragraph. The back-office statement reads "Twelve internal tools nobody sees."; its paragraph opens on twelve tools over 140 admin routes and names the four pages as links in a second paragraph; the cockpit's caption and alt say twelve. The third decision gains one sentence on the method (agents under direction, discoveries and numbered rulings, structural checks that pin agent output), set after a "Placeholder." marker in the muted colour so Scott's wording replaces it. Nothing else moved. The cockpit screenshot still shows eleven cards; a new capture is needed for the twelfth.

**The grid cells.** In main the four tools are Notes, so WorkCell shows a plate and the name alone. As Standard pages they are case studies, so ProjectLinks adds "Read the case study" under the stack on each, and the analytics cell keeps its "demo data" note after it. The plates are the pages' captures at 16:10, cropped from the left as work-cell.module.css crops.

**Long names in the title block.** "Lectionary authoring tool" and "Analytics dashboard" wrap to two lines at 112px, as main's `.name` with `text-wrap: balance` would; the block hangs from the midline as in round 7, so the plate starts lower on those two pages. No change to the template is proposed.

## Open items

- The discovery document: see above. Every "Placeholder." paragraph is to be checked against it.
- Three captures: `prompt-lab-history-diff-16x10@2x.png`, `lectionary-week-readings-16x10@2x.png` (staging), `commitments-commitment-16x10@2x.png`; and a cockpit capture with twelve cards.
- employers.ts: the four entries go from `depth: "note"` to `depth: "standard"` with a `page`, their plates to the captures, and their stacks lose `placeholder: true` once confirmed. Prava's `sentence` and its AI fact change to eleven (thirteen at launch).
- Diagram.tsx: six names with `true` in TALL.
- Two sections without a drawing, if Scott wants them: see "Eight sections, six diagrams".
