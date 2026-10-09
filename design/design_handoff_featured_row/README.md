# Round 10: the featured row

The home page's first screen gains two featured projects, one engineering (the Buyer extension, with its loop) and one AI (Ask the reading, a grounded question surface for Prava, designed here as a defined slot), in a lean row directly under the opening line. The name stays where it is. Built against main as read on 2026-10-09 (app/page.tsx, app/page.module.css, app/tokens.css, components/chapter-opener, cascade, fade, reveals, work/ExtensionLoop, PlayInView, WorkEntry, work.module.css, margin/WorkIndex, work-index.ts, work/employers.ts) and the round 9 handoff. Static design reference, not production code; the `.dc.html` files open in a browser with `support.js` alongside. No em dashes anywhere in the deliverables.

## Files

- `home-1440.dc.html`, `home-1920.dc.html`, `home-1024.dc.html`: the first screen at 1440x900, 1920x1080, 1024x768. One template; the Tweaks panel switches the viewport, scrolls the page, swaps the extension plate between the loop and the still, and switches the plate's crop (map, or the whole drawing).
- `home-390.dc.html`, `home-844x390.dc.html`: the phone, upright and on its side. Same template, two defaults.
- `storyboard.dc.html`: the first screen loading, eight frames with timings, and the Work index with the two marked.
- `svg/ask-the-reading.svg`: the AI plate's still, 1200 by 750 (16:10), drawn to read at the row's width. `svg/hero-extension.svg`, `hero-extension-still.svg`: the round 9 drawings, unchanged, for the mockups to inline.
- `png/`: exports of each first screen.

## The row

**Where.** Directly under the opening line, which already names both halves (the trading floor, the prayer app), and before the About paragraphs. The name, subtitle, and opening line are exactly where main has them: the name's top edge on the top line beside the numeral. The row is one more child of the About body, in the body's 20px rhythm, spanning the measure (776 at 1440) the way Work's plates do while the paragraphs keep their 680 max-width.

**What each plate carries.** The plate (16:10, the rim, no card); a mono label, "Featured · engineering" and "Featured · AI", with "Featured" in brass as on the project page's top row; the name at 20px, a link; one sentence in the muted colour; "Read the case study" in brass. Nothing else: no stack, no years, no meta line. Those are Work's.

**Half the measure or the full measure.** Half: 372px at 1440, 344 at 1024, side by side. Stacked at the full measure the row would be two heroes, the second below the fold, and About would start a screen down; the brief's "both above the fold" decides it. At 1440x900 the row's links sit at about 780px; at 1024x768 at about 690. The 1920 screen has the same column (1120 is the cap) and simply more room under the row.

**Does the loop read at 372px.** Not the whole drawing: its 10 to 12px mono labels would be 3 to 4px. So the row shows the loop cropped to the map, viewBox `40 100 760 475` of the 1200 by 630 drawing (16:10 exactly), where the rings are 3.7px rings on 1.8px seats, the fill is a wedge, the note is off-frame, and the stop overlay fills the plate. The paint reads as paint; the page's label and sentence say what it is. The Tweaks panel has "whole" for comparison, and it is the weaker plate. For production this is one prop on ExtensionLoop (a `crop` viewBox applied to the inlined drawing), not a second drawing; the Work hero and the case study keep the whole.

**The AI plate.** "Ask the reading" is kept as the name; it says what the surface is for in three words and reads as a verb phrase like the app's other surfaces. The still shows the three things the brief names and nothing more: the question ("Why is Isaiah read beside this Sunday's Gospel?"), the retrieved passage with its source (Isaiah 9:2 in the King James wording, public domain; "the first reading"), and the answer that cites it, with the citation in brass and a brass arrow from the answer to the passage. One line under the three boxes states the promise: every answer cites the passage it was given; a question with no passage gets the reading, not an answer. It is drawn at 20 to 44px so it reads at 372 wide; the case study's version, when the surface exists, can be the round 8 vocabulary at 10 to 12px. The question is invented; nothing of a person's appears.

**1024.** Same row, 344px plates, the name at 88px. Fits above 768.

**390.** The plates stack at the column's width and bleed to the viewport's edges, as Work's plates do on the phone; the loop is the still, as ExtensionLoop already does below 960; the gap between the two is 40. The first screen at 390x844 shows the name, the opening line, and the whole first plate with its label; the second plate begins below the fold. Side by side at 167px each was rejected: neither plate reads.

**844x390.** The 780 measure of the round 6 landscape screen, the name at 64px, the two plates side by side at 374px as on the desktop, and the still (below 960). The first screen shows the name, the opening line, and the tops of both plates; the row is reached on the first scroll.

**The cascade and the fade.** The row is inside the About measure, which is one `data-fade` block, so it fades with the scroll as the paragraphs do; nothing new. For the cascade each plate is one part (`data-cascade="children"` on the body already makes it so), and the two share a top edge, so they share a delay and arrive together, about 170 ms at 1440x900 and settled by 650. The loop's first second paints nothing, so the cascade is over before the first ring at 1.0 s; no sequencing between Cascade and PlayInView is needed. The storyboard has the frames.

**"featured" in Work's hero meta.** Yes, it goes. The first screen carries the word in brass twice; the Work hero's meta line reads "Chrome extension · proprietary", and the Featured depth keeps its one mark on the project page's top row. The data decides it (below), not a second string.

**The Work index.** A 4px brass square in the gutter before the two featured lines, under their employers' tiers, the same brass as the row's word. The index reads position by brightness, so colour on the name was rejected (it would read as current), as were a word after the name and a numeral. Ask the reading joins Faith Platforms' tier under Prava, since it joins the grid as a cell. The storyboard page shows the index with both marks.

**Rejected, as the brief asked.** A hero above the name (the name is the first screen's signature); a carousel (two things, no rotation); cards (plates have a rim and nothing behind the text).

## What changes in app/page.tsx and the data

**employers.ts.** `Shown` gains `featured?: "engineering" | "ai"`, the label's second word; two at most, enforced by a module-level check that throws at build if more than one project carries each value. The Buyer extension gets `featured: "engineering"`. Faith Platforms gains a project, `ask-the-reading`, `depth: "note"`, `pending: true` (the grid shows its labeled slot until it is built), `featured: "ai"`, with the still as its page plate when the page is written. A `FEATURED` export selects the two in label order, engineering then AI, which is the order the opening line names them.

**app/page.tsx.** After the opening paragraph, inside the About body (so `data-cascade="children"` and the body's gap apply), a `FeaturedRow` with the two. Each item: the plate (ExtensionLoop with `crop="map"` for the loop, DiagramDrawing for the AI still), the mono label with "Featured" in brass, the name linking to the page (or to the Work cell while there is no page), the sentence, and "Read the case study" through ProjectLinks' link style. Styles in page.module.css: a two-column grid with 32px gap spanning the measure; one column with 40px gap and the plates bleeding below 720; the label at mono-small-size.

**ExtensionLoop.** One optional prop, `crop`, which sets the viewBox on the inlined drawing (and on the still). The keyframes do not change.

**Work.** The hero's meta string drops "featured"; `WorkIndex` reads `featured` and draws the square.

**OG.** Unchanged: the home page's share card stays the name.

## Open items

- The AI surface is not built. Its plate is a defined slot; its page (and the sentence, marked Placeholder here) wait on the surface. Until the page exists the row's name and link go to its Work cell.
- Every sentence in the row is marked "Placeholder." for Scott's wording.
- The loop's crop is a proposal to test on the real page at 372px; the Tweak has both for comparison.
- The exports show the still in the extension plate; the loop cannot be rasterised by the screenshot tool.
