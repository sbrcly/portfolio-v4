# Round 3, revision 1: the running margin, corrected

## Revision 1

**Base.** Rebuilt against main (app/, components/, app/tokens.css): chapter labels ("Work · five"), rim values (--rim-resting, --rim-lit), chapter padding, the observer in current-chapter.ts. Nothing cut from the live site reappears: no hero top row, no location, no availability. Email is below the hero statement and in the footer. Note: the copy of main this was read from (tree 8955ea1) still carries the top row in components/hero/Hero.tsx; the mockups follow the brief, not that file.

**Correction 1, the margin exists from the top.** At scroll zero the margin shows I and Home, dim, like every other chapter. The hero is a chapter opener: 280 + 64 + measure (776 at 1440, 720 at 1024), the measure holding the lit rule, the name, the statement, and the email; min-height 100svh, content centred. At 1440 × 900 the numeral ends at y 239 and the label at 277; the name runs 314 to 426. They do not share an eye line; nothing moves. At 1920 × 1080 the hero block centres lower (name 404 to 516) and the gap grows; still nothing moves. The 390 hero gets the inline 72 numeral and Home label above the rule, like the other stacked openers.

**Correction 2, state at load.** currentChapter is I at first paint (current-chapter.ts starts at the first chapter); nav I Home lit, margin I, no animation. The hero at 100svh always intersects the band at scroll zero, so the observer confirms I rather than discovering it. Deep links swap without animation if the first callback lands before the veil lifts. Prava: the title chapter reads "Prava" with the numeral slot empty; the numeral fades in at 01 above a label that does not move (3c on the options page; 3d, "01 Prava", shown and not recommended).

**Storyboards.** Arrival is replaced by load then I to II. Position options re-shot with the hero at scroll zero; the centred option now visibly fights the name, which settles the recommendation.


One structural change to Vigil's motion system. The dim chapter numeral and mono label stop being part of each opener and become a running head pinned in the left margin, changing as chapters change. Nothing else moved. Static design reference, not production code; files open directly in a browser (`support.js` alongside; images from `assets/` at the project root).

## Files

- `home-1440.dc.html`, `home-1024.dc.html`: live reference. The margin, nav, and plate light run from the state model in the spec. Tweaks: margin align (top / center), reduced motion.
- `home-390.dc.html`: stacked openers unchanged; hero re-set with inline I Home and no top row.
- `prava-1440.dc.html`: title block and four-screen plate are the hero; the margin arrives with 01 and shows 01 to 05 with each section's label.
- `storyboards.dc.html`: load then I to II, II to III, entry change inside III (01 to 02), frame by frame with timings.
- `position-options.dc.html`: 3a under the frame (recommended) and 3b centred, each at three moments; 3c/3d, what the Prava margin reads at the top.
- `spec.dc.html`: state model, handover timings, geometry per breakpoint, exact boundary events, markup and accessibility.
- `png/`: viewport frames at 1440 × 900 and 1024 × 768, full pages for 390 and the documents.

## What changed and why

**The numeral leaves the flow.** At 960 px and up there is no numeral in any opener, the hero included; the only numeral is the pinned one, so there is never a crossfade between a flowing and a fixed numeral. The `h2` stays in the opener in document order (visually hidden), so headings, `aria-labelledby`, and reading order are round 2's exactly.

**The margin column runs the whole chapter.** In round 2 the 280 + 64 column existed only for the opener; plates spanned the full 1120. A pinned margin beside a 1120 plate would overlap it, so Work's entries and the Prava back-office plates now sit in the measure (776 at 1440, 720 at 1024). The Prava 4-up plate tightens to 32 padding / 16 gap. Entry descriptions stack over their meta instead of sitting in two columns. This is the printed-book model the brief asked for: a text block with an empty margin all the way down. The Prava title block and screens plate keep the full column (as on main); the home hero now sits in the measure.

**Position: under the frame.** Numeral top at 120 (sticky 96 + 24), left edge on the column. Recommended over centred because a running head belongs in the top margin, because it keeps the one dim 140 px numeral off the reading line where the lit plate passes, because nav and margin then read as one apparatus along the top edge, and because its geometry does not depend on viewport height. Both are on the options page and switchable live.

**One event, two consumers; one source, two consumers.** `currentChapter` (band observer, -40% / -40%, later section wins a tie) feeds the nav and the margin's numeral and label. `litPlate` (round 2 rule, unchanged) feeds the plate rim and the margin's second line. The margin computes nothing, so it cannot disagree with either.

**Handover is the light's handover.** 400 out (fade and cool), 200 of nothing, 600 in on cubic-bezier(.16,1,.3,1). Load is not a handover: I is in the markup. Reduced motion: instant swap after the 200 gap. Nothing in the margin ever glows, scales, slides, or responds to hover.

**Breakpoints.** Pinned at 280 from 1200 up, 200 from 960 to 1199. Pin off from 720 to 959: the pinned column costs 240 for the whole chapter and under 960 the measure falls below 640, the floor that set round 2's 1200 break; the round 2 opener-in-flow layout stands there. Below 720 the stacked opener with the inline 72 numeral is unchanged.

## For implementation

- `section[data-chapter]`, `article[data-plate][data-entry]`, Prava `section[data-chapter][data-label]`.
- The margin is `aria-hidden`, `pointer-events: none`, `position: fixed`, rendered from state; never in a section.
- The mockups add `#frame=hero|hero-1920|about|work|work-01…05|contact` hashes purely for PNG export (static viewport frames). Ignore in production.

## Open items (carried)

- Poster frame for the odds console.
- Resume PDF for V; Scott's copy.
