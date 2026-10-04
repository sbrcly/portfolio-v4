# Round 5: the Work index

While chapter II is current, the running margin gains an index under its label: the three employers in order, and under the current one its projects (hero first, then the grid cells). The reader's place is told by brightness alone. Every line is a link. Built against main as read on 2026-10-04 (components/margin, components/work, components/social, components/chapters, components/frame, app/globals.css, app/tokens.css, app/page.tsx). Static design reference, not production code; the `.dc.html` files open in a browser with `support.js` alongside; images come from `assets/` at the project root.

## What is live on main, and preserved here

- No hero. I About (name on the top line), II Work, III Contact, IV Resume. Paragraphs in Source Sans 3. Ground #0E1512. No hairlines but plate rims and the diagram's strokes.
- The running margin pinned with its numeral's top 120 from the viewport's top; glyphs held, added, and exchanged across each boundary (`margin.module.css`, `glyphs.ts`); the label crossfading at the boundary. The mockups reproduce the I to II to III glyph entry by width and the recentre from the same boundary formula (lead on the outgoing chapter, trail on the incoming).
- The content fade (`globals.css`), the pinned running heads with their 24px fade and the push-out by the next title (`work.module.css`, `RunningHeads.tsx`), the pinned icon stack 130 above the bottom and hidden under 620 of height (`margin.module.css`, `SocialIcons.tsx`), the current-chapter rule on the midline for the nav (`current-chapter.ts`), the contact email as the one lit element.
- Anchors and landings: `employer-01` to `-03` land the title 24 under the frame; heroes land their employer's title; cells land their plate under the pinned row and clear of its tail (`scroll-margin-top`).

## Files

- `home-1440.dc.html`, `home-1024.dc.html`, `home-1440x620.dc.html`: the home page with the index, scrollable. `#frame=i|arriving|faith|faith-grid|handover-gap|handover|caesars|iii` renders one static viewport for export; ignore in production. Tweak: reduced motion.
- `storyboard.dc.html`: arrival (6 frames), the Faith Platforms to Etainement handover (6), the Prava to first-row handover (4), each with its scroll position and the scroll-to-brightness mapping.
- `spec.dc.html`: state model, type and spacing, alignment reasoning, clearance against the icons, links and keyboard, phone, Prava.
- `png/`: the five 1440 × 900 states the brief asked for (`1440-1` to `1440-6`, with `5a` the landed title between the handover's halves), 1024 × 768 (`1024-1` Faith Platforms, `1024-2` handover), 1440 × 620 (`1440x620-0` chapter I with icons, `1440x620-1` Faith Platforms with icons yielded), the storyboard and the spec.

## Decisions

**Alignment: left on the column's edge, project tier indented 16.** A two-tier list is read by its left edge; the indent is the only thing that says "under" and centring destroys it. Line lengths run from 5 to 25 characters; centred on the 80 axis the longest crosses the column's edge, and the label's own fallback (a wide label starts on the edge) would give the index two alignments. The column's edge is the margin's one fixed edge; the numeral's left ink moves with the chapter. The icons stay on the axis: a different object.

**Type.** JetBrains Mono 400 at 11 (the site's `--mono-small-size`), line 18, tracking .02em, sentence case as the names are written. Not caps: eight lines of .14em caps would outweigh the label. Widest line ("Lectionary authoring tool") is 187 with its indent; it clears the 200 column at 1024 by 13.

**Two levels of brightness, not three.** Rest is `--muted` #A89F90, current is `--text` #E4DBCB, mixed in sRGB as the scroll moves. The dim numeral #4A5A50 is offered by the brief but not used: at 2.5:1 on the ground it is below what a link may be, and the tier indent carries the structure so two levels suffice.

**Employers read the running head, literally.** An employer's line is as bright as its running head is visible: `pinned × (1 - pushed)`, where `pinned` is the row's own `--pinned` (0 to 1 over the 24px after the title's bottom passes the frame) and `pushed` is how far the next title has pushed the row behind the frame (0 to 1 over 74px: the row slides from its sticky top at 54 until its text is behind the frame's solid 54). The project tier opens and closes with the same number. Consequence worth confirming: between two running heads there is a window (about 230px at 1440) where the next employer's title is on screen and no line is bright, including the first 210px of the chapter. The title is the marker there. This is also what makes a jump honest: a jump to an employer lands its title inside that window, and the index does not keep claiming the employer the reader just left. The alternative (the first employer bright from the index's arrival, the next from its title reaching the landing line) contradicts the running heads and was rejected.

**Projects read the anchors' landings.** A grid row is current once its plates' top has passed 186 from the viewport's top (frame 96 + pinned row 48 + tail 42), which is where a jump to a cell lands it; the hero is current until then. Brightness moves over the next 24px, the running head's fade. Both cells of a row take the row's value: they stand on one line and a jump to either lands the same place. The brief says "the current project"; splitting a row's pass in half between its two cells would be a line that moves while both cells are fully in view, so this reads as one place with two names. Easy to change to left-then-right if Scott prefers.

**Arrival and departure on the margin's own variables.** Opacity = clamp((boundary-1 − .75) / .25) × (1 − clamp(boundary-2 / .25)): whole exactly when the II is whole (its recentre ends at 1), leaving the moment III's boundary opens. Reduced motion: the boundary variables already step on main, so the index steps with them; the running heads keep their 24px fade on main and so does E; the project tier's q steps at the line.

**Clearance.** Index bottom at 447 (1440) and 410 (1024); icons' top at height − 270. Clear by 183 at 1440 × 900 and 88 at 1024 × 768. Threshold = index bottom + 24 + 270: 741 of height from 1200 up, 704 below. Between 620 and the threshold the icons yield to the index (opacity 1 − P), leaving as it arrives and returning as it leaves, on the same scroll; in I and III they are as today. At 1440 × 620 this is the case: icons in I and III, none in II (`png/1440x620-*`). Under 620 they are hidden as today. Rejected: raising the icons' min-height to the threshold (loses them at 1366 × 768 and 1440 × 768 everywhere); collapsing the tier in short viewports; a smaller face.

**Links and keyboard.** Hover and focus in brass with the global 1px underline at .3em. The nav sits after the frame's chapter nav and before main. Closed tiers are inert; the absent index is inert and `visibility: hidden`. `aria-label="Work index"`, not `aria-hidden`; no `aria-current` (brightness is a reading position, and it would announce on every scroll).

**Phone: no index.** No margin to hold it under 960; the running heads already pin at 80 and name the employer; the chapter is one column of ten entries with its titles in flow; the nav shows numerals only on phone, so a second nav would outrank the first; and a drawer or sticky contents row would be a new pinned element, which the site has been removing.

**Prava page: absent.** Its margin has no chapter II.

## Research: taken and rejected

Mobbin's screen library is behind a login that is not reachable from here; its public glossary entry on tables of contents was read (anatomy, when not to use one: short or strictly sequential content). Taken: nothing structural, but its "sequential content" caution is the reason the index exists only in II, the one chapter the reader skips around in. Rejected: the pattern's usual placement in the content column and its active-state markers.

- Book apps (Apple Books, Kindle, Readest's TOC view): a contents tree that opens to the current chapter and highlights it. Taken: the two tiers, and opening only the current employer's children (Readest expands the branch the reading position is in). Rejected: the tree affordances (chevrons, disclosure), the sheet or sidebar container, page numbers.
- Documentation sidebars with a quiet "on this page" rail (Stripe, Vercel, docs.page): current heading in a stronger weight or colour as the page scrolls; nested headings indented. Taken: the indent as the only structural device, the single text-colour change for the current item, click lands the heading under the fixed header. Rejected: the vertical rail line and the moving marker beside the active item (every one of these is a scroll spy with a marker), bold weight (the site has one mono weight here), the rail's permanence on every page.
- Long magazine features with chapter navigation (NYT and Pudding multi-part pieces): a chapter list that appears with the piece's apparatus and recedes with it, part names set small in the margin. Taken: the index as part of the chapter's apparatus, arriving and leaving with the chapter rather than living on every screen; names in the mono voice. Rejected: progress bars and fills, dots per section, the sticky bar across the top.
- Print running indices (Chicago's flush-and-hang index style; running heads that carry chapter and section): main entry flush left, subentries indented, no ornament. Taken: flush-and-hang alignment, two tiers only, the reading position shown by the entry itself rather than a pointer. Rejected: locators (page numbers), run-in style, rules.

## Open items

- Confirm the "no bright employer while the next title is on screen" window; the alternative is described above.
- Confirm cells of a grid row brightening together.
- Years, roles, and the five placeholder project sentences remain the brief's placeholders.
- The mockups' scroll-driven values are written per frame by script; on main the presence and employer tiers can be CSS where view timelines exist (the inputs are the margin's boundary variables and the rows' `--pinned`), the project tier needs the per-frame script that already stands in for them.
