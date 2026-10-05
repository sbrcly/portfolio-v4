# Round 6: the phone

390 and 430 wide, portrait. The phone gets the desktop's system in the form the width allows: the chapter numeral as the spine, the employer running heads pinned under the frame, plates with their 1px edge (heroes bleeding, cells in the column), the load cascade, the email as the one lit element, the four icons. Built against main as read on 2026-10-04 (app/tokens.css, app/globals.css, app/page.module.css, app/page.tsx, components/frame, chapter-opener, work, cascade, reveals, footer, social, app/work/prava). Static design reference, not production code; the `.dc.html` files open in a browser with `support.js` alongside; images from `assets/` at the project root. Desktop from 960 up is not touched.

## Files

- `home-390-a.dc.html`, `home-430-a.dc.html`: Option A, the chapter numeral in the frame bar. The recommendation.
- `home-390-b.dc.html`, `home-430-b.dc.html`: Option B, the numeral inline above each chapter, the nav showing the current chapter's label.
- `home-390-a-grid2.dc.html`: Option A with the Work grid two cells per row, for comparison.
- `prava-390.dc.html`, `prava-430.dc.html`: the case study, Option A.
- `landscape-844x390.dc.html`: what happens at 844 × 390 (the tablet band).
- `storyboard.dc.html`: the first screen loading, the I to II transition, the Faith Platforms to Etainement handover.
- `spec.dc.html`: type scale, spacing, frame, pin positions, breakpoints, motion.
- `png/`: `390-a-*` (first screen at 664 and 750, II arriving, Faith Platforms pinned, its grid, the handover gap, Etainement's row at .5 and pinned, Caesars' grid, III, the footer), `390-b-*`, `390-a-grid2-*`, `430-a-*`, `430-b-*`, `prava-390-*`, `prava-430-*`, the landscape shots, the storyboard and the spec in screen-sized pages.

Every home file renders scrollable; `#frame=<state>` renders one static viewport for export (`&part=1|2` are the export's halves; ignore). The Tweaks panel switches width, numeral option, and grid.

## Answers

**Where the numeral lives: in the frame bar (A).** Spectral 200 at 32 in the dim numeral colour, its label beside it in the mono, at the bar's left; the nav table at the right. The reasons: the numeral is then pinned, as it is on the desktop, and the morph survives (the second I enters by width over the boundary, the label crossfades); the chapter's name is always on screen, which the numerals-only nav could not do alone; and the first screen gets About whole. Option B keeps the numeral large (96) and in flow, which is the more faithful picture of the margin's numeral, but it is a decoration the reader scrolls past once per chapter, it pushes the name to 234 and Work's title off the first screen and a half, and its nav has to carry the label instead. Rejected: the chapter running head (a pinned "II · Work" line under the frame), because in II it would stack with the employer running head and the chrome would reach 200 of a 664 viewport.

**Motion.** The numeral morph translates (A). The content fade does not: the thumb is on the lower half and reading happens in the upper third, so a block is 25svh off the midline before it is read; and bleeding plates would dim against an undimmed frame. The index does not (round 5). The reveal main already has below 960 stays. The cascade, the running heads, and the light handover are main's.

**Nav.** Numerals only, four cells of 44 × 60. Full labels fit at 390 (about 330 of 350) and were rejected: no room past the text in each cell, and a bar heavier than the content. The current chapter's label beside its numeral is shown in Option B and works; in A it is redundant with the bar's own label. Drawer rejected.

**First screen, 390 × 844.** Toolbar expanded (664): About whole, ending at 575; Faith Platforms' title at 767, on the first scroll. Collapsed (750): the title is 17 under the fold. At 430 it is on screen expanded. The name is set at 48 (main renders it at 28 as the statement).

**Work.** Company title 32 over the tenure line; running head pinned with its text 16 under the frame, 86 tall when the role wraps, its ground viewport-wide so bleeding plates pass beneath; content clear at 201. Heroes bleed (margin −20), cells keep to the column. Grid one column, 32 apart, 64 under the caption. Two per row shown once (`home-390-a-grid2`): 167-wide plates, the Prompt Lab screenshot unreadable, names wrapping to two lines, spec lines to three; rejected.

**Contact and footer.** The email at 26, lit in III; the note under it. Footer three lines: the icons (20 at 24 apart, 44 targets meeting edge to edge), the email, the colophon with IV Resume right. The icons live in the footer because on the desktop they are the margin's and the footer is where the margin's content goes on the phone; putting them in Contact would make them part of the chapter.

**Tap targets.** Nav cells 44 × 60; icons 44 × 44; every text link padded to 44 tall with cancelling margins; the video plate is its own button. The bar is out of thumb reach, accepted (see spec).

**720 to 959.** Main's tablet layout, with the bar numeral replacing the inline opener here too, so the rule is one sentence: in the margin from 960, in the bar below. Landscape 844 × 390 falls in this band; one rule caps the name at 64 under 500 of height.

## Research: taken and rejected

Mobbin's library is behind a login; its public pattern index for article detail screens was read for the list of apps (Medium, Wikipedia, Flipboard, informed, NYT). Public sources otherwise.

- NYT app and Apple News long reads: a thin persistent bar, section or publication name small in it, the headline in flow; body at 17 to 18 with wide leading; full-bleed images; no sticky subheads. Taken: the thin bar holding a small name of where you are (here the chapter), full-bleed plates, body at 16/1.6. Rejected: the progress bar some readers add, the share toolbar, the bottom tab bar.
- NN/G on sticky headers (content-to-chrome ratio, partially persistent headers): taken as the argument against stacking a chapter running head over the employer running head, and for keeping the bar at 60 in an 80 frame. Rejected: the hide-on-scroll-down header; the frame here is also where the numeral morphs, and hiding it hides the spine.
- iOS large-title navigation bars (a large title that collapses into the bar as you scroll): the closest native pattern to "the chapter numeral moves into the frame". Taken: the idea that the bar is where a heading goes when it is pinned. Rejected: the collapse animation itself (the numeral does not shrink from the content into the bar; it is in the bar from the start, and the content's own titles stay in flow).
- Print running heads (recto with the chapter, verso with the book or section): the model for the two pinned lines, the bar's chapter and the employer row. Taken: two levels, different voices (Spectral numeral, mono row). Rejected: a third level.
- Typographic phone portfolios (the kind collected in the Crit and Muzli round-ups: one display face at phone width, mono metadata, no cards): taken: the name at 48 rather than main's 28, metadata in the mono, nothing boxed. Rejected: the hamburger and the full-screen menu almost all of them use.

## Open items

- Confirm the bar's numeral in the dim colour (#4A5A50, 2.5:1) is acceptable at 32; it is decorative and aria-hidden, as the margin's is.
- Confirm the name at 48 on the phone (main: 28).
- The Caesars running head stays pinned while chapter III's top is on screen until the block's bottom passes the row, as on main at every width; worth a look at the end of the page on a phone.
- Years, roles, and the placeholder project sentences remain the brief's placeholders.
