# Round 4: Work as an interactive résumé

Chapter III stops being five projects and becomes three employers, most recent first, each holding the projects built there (ten in all). Two directions, both built on main as read on 2026-10-04 (components/margin, components/work, components/chapters, components/light, app/globals.css, app/tokens.css). Static design reference, not production code; files open directly in a browser (`support.js` alongside; images from `assets/` at the project root; the odds console poster copied from `public/images/odds-console-poster.webp`).

## What is live on main, and preserved here

- Running margin on the viewport midline (`margin.module.css`: numeral box centred on 50svh, axis 80 from the column's edge, 140 numeral; 96 and axis 66 below 1200). The mockups crossfade the numeral at the boundary rather than reproducing the glyph exchange; the position, sizes, and the second line's fader timing are main's.
- Content fade (`globals.css`): full within 25svh of the midline, .15 at the edges. Reproduced per frame on every `data-fade` block.
- Lit plate (`plate-light.ts`): nearest centre inside the .25 band, 10% hysteresis, settle at scroll end, leaving the band is immediate. Reproduced.
- Chapter rule (`current-chapter.ts`): last chapter whose top is at or above the midline. Reproduced, and reused for employers.
- The hero at scroll zero with the name's centre on the midline; chapter padding 225; the 776 measure; T3 titles at 44; the Prava case-study link; "Write-up:" links on the three Caesars tools.
- Not found on main: anything called "docked icons" (no match in components/ or app/). Nothing here depends on it; if it exists on a branch, point me at it.

## Files

- `a-ledger-1440.dc.html`, `a-ledger-1024.dc.html`, `a-ledger-390.dc.html`: direction A, full page.
- `b-folio-1440.dc.html`, `b-folio-390.dc.html`: direction B, full page.
- `storyboard.dc.html`: the margin's lines through Faith Platforms and into Etainement, eight frames with timings; B's single line noted under each.
- `spec.dc.html`: structure, the new type level per breakpoint, spacing, the margin rule, the lit-plate rule, the data model, phone.
- `png/`: 1440 × 900 viewport frames (A: hero, work opener, employer 01, Prompt Lab lit, spec block, employer 02, console lit, extension lit; B: employer 01, sticky row with Prompt Lab, text run, employer 03), the 1024 × 768 lead for A, full pages at 390 for both, the storyboard and spec.
- The 1440 and 1024 pages take `#frame=hero|about|work|e-01|e-02|e-03|p11|p12|p22|p31|p32|p33|t-13|contact` (A) or `#frame=t-analytics` etc. (B) to render one static viewport for export. Ignore in production. Tweak: reduced motion.

## The two directions

**A, Ledger (recommended).** The employer header is set in the name's voice: Spectral 200 at 64, on a rule that spans the full 1120 column, the only element that crosses the margin gutter. It ranks above the 44 project title by weight and size inside the same family and colour, and by span: projects live in the measure, employers own the column. Projects are numbered 01.1, 01.2; the number says "second thing at the same place" without a word. Plate-less projects take a ruled mono spec block in the plate's slot (reads, shows, refresh, status), so the entry has the same four-part rhythm as a plated one and the block carries facts a screenshot would have carried. The header is left behind on scroll; the margin carries the employer instead, as a second line that persists through the employer's projects, with the lit entry as a third line. One pinned apparatus, three lines, each on the light's timing.

**B, Folio.** The employer header is set in the apparatus voice: a ruled mono row, employer in caps in text colour, role line muted, the same register as the nav and the chapter labels. It outranks the project title by register rather than size, which keeps every Spectral setting in the chapter at 44 or below. Projects are unnumbered. Plate-less projects become a tighter text run after the plated ones (28 title, rule above each, 48 apart), which is honest about what they are. The row sticks under the frame for the length of its block, so the margin stays as on main: one line, the lit entry, now just the project's name. Titles pass under the row as they leave (png/b-1440-2), which is the usual cost of a sticky sub-head and is shown rather than hidden.

**Why A.** B's sticky row is a second pinned element and competes with the frame; in a long employer the margin's one line is empty for three entries running. A keeps the margin as the only pinned apparatus and its second line is never empty inside III. A's spec blocks also give the three Faith Platforms tools and the pricing portal something to be, where B's text run will read as a footnote next to the Prava plate. B's register trick is the better typographic answer to "a heading of a different order without a second family or colour"; A's size-and-weight answer is plainer but holds on phone, where B's row is 11px caps against a 32px title.

## Research: taken and rejected

Mobbin's library sits behind a login that is not reachable from here, so the survey is from public work in the same categories; nothing is reproduced.

- Read.cv-style profile pages (experience grouped by company, projects nested under each). Taken: the company as a header with a role-and-years line and projects as children; the variable count per company. Rejected: company logos, the one-line-per-project density (projects here carry a plate and a sentence), the single type size for everything.
- Editorial long-form sites with a two-level running head (NYT and Pudding features, the Verge's longform): a chapter head that persists and a sub-head that changes. Taken: the two-line running head in A; the rule that the persistent line changes only at its own boundary. Rejected: the sticky sub-head in the content column (it reads as navigation chrome), progress bars.
- Typographic résumés in print (Swiss two-column CVs; Bringhurst's running heads): employer as a sidehead on a rule across the full page, entries in the measure. Taken: the full-column rule in A, the ruled key-and-value block for an entry with no image. Rejected: the dot-and-line timeline, dates in the margin column (the margin here is spoken for), bold-weight headers.
- Developer portfolios that list work by employer (Brian Lovin, Paco Coursey, Rauno Freiberg): quiet, one family, mono for metadata, projects as plain rows under a company line. Taken: B's register idea, the mono caps employer row, the unnumbered list. Rejected: hover-reveal previews, cards, tag chips, logos, the accordion some use for older roles.

## Decisions the brief asked for

- Employer vs project heading: A, Spectral 200/64 on a full-column rule vs 300/44 in the measure; B, mono caps row vs Spectral 44. Neither adds a family or a colour.
- Plate-less projects: A, a ruled mono spec block in the plate's slot; B, a text-only run with a 28 title. Both shown at 1440 and 390.
- Numbering: A numbered (01.1), margin reads "01 Faith Platforms" then "01.2 Prompt Lab"; B unnumbered, margin reads "Prompt Lab".
- Header on scroll: A left behind (the margin carries it); B pinned under the frame.
- Phone: A's header at 40/200 on a rule with an "Employer 01" tag; B's row sticks at top 80.

## Copy

Years and titles are the brief's placeholders. Project sentences for the five new entries (Prompt Lab, analytics dashboard, lectionary tool, commitment library, pricing portal) are placeholders of the right length written from the About chapter and the case study; Scott replaces them. Counts after each role line ("· five projects") are dim and optional. No em dashes, no exclamation marks.

## Open items

- Screenshots for the three Faith Platforms tools, which would turn their spec blocks into plates (the data model allows both).
- Whether Etainement's further projects have visuals; the block accepts any count either way.
- "Docked icons": not on main; see above.
