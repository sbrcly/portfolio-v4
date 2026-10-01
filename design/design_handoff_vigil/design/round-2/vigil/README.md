# Round 2: Vigil, refined

Vigil is the chosen direction. Everything here is a static design reference, not production code. Files open directly in a browser (each folder carries `support.js`; images resolve from `assets/` at the project root).

## Files

- `home-1920.dc.html`, `home-1440.dc.html`, `home-1024.dc.html`, `home-390.dc.html`
- `prava-1440.dc.html`, `prava-390.dc.html`
- `hero-options.dc.html` (A and B, each at 1440x900 and 1920x1080)
- `extension-diagram.dc.html` (two diagrams, each at 1120 and 350)
- `video-states.dc.html` (resting, playing, ended, plus rules)
- `spec.dc.html` (entrance storyboard, numeral sizes, nav table and fade, breakpoints, motion)
- `png/` full-page exports

## What changed from round 1, and why

**Hero.** The bottom-aligned name left a void on tall screens. Two resolutions in `hero-options`. Option A (used on all home pages) anchors the lit rule to the vertical middle and moves the chapter header row (I Home, rule, email, location, availability) to the top of the hero, so the dark above the name is bounded by a line the reader has already read. Option B keeps the name low and drops a 1px plumb line from the mono row to the lit rule, with a small chapter index beside it. A chose itself for the 1920 case: B's plumb line gets long.

**Dim numerals.** Now `span aria-hidden="true"`; the mono label is the `h2` and the section's `aria-labelledby` target. Sizes: 140px in a 280 column at 1440 and 1920; 96px in a 200 column at 1024; 72px inline with the label at 390 (down from 88 so "III" and the longest label share a line). Measured widths and clearances are in the spec.

**Extension plate.** The three-cell strip is gone. Two real diagrams in `extension-diagram`: an origin-boundary diagram (two dashed origins, the extension straddling the boundary, the message port the only thing that crosses, numbered steps beneath) and a sequence diagram (four lifelines, named payloads). The boundary diagram is on the home pages because it stacks cleanly at 390.

**Video plate.** Three states designed and specified: resting (poster, one play ring, mono meta), playing (ring and meta fade, rim rises to lit strength, native controls on hover only), ended (holds last frame, rim settles, ring returns, meta reads Replay). The mp4 exists on main but is larger than this tool can import, so the poster is a labeled slot; drop a frame export in and it replaces the striped field.

**Prava page.** Re-set in Vigil at 1440 and 390: hero-style title block with the lit rule and a two-column lede and spec, four-screen plate with mono captions, sections 01 to 05 as chapter openers with dim numerals, back-office plates full column width with captions.

**Nav.** Folio's ruled table replaces the row of links at 1440, 1920, and 1024. Current chapter steps to the lit color with no glow, so the nav never competes with the one lit element. Phone keeps numerals only, each link labeled for assistive tech. The sticky bar is 96px with the 72px bar inside and a specified gradient that is solid behind the type and transparent 24px below it; no border, no blur.

**Tablet.** `home-1024` added. The opener grid gives at 1199 (280 + 64 becomes 200 + 40, numeral 96, name 88) and again at 719 (stacks). Both breaks and what moves are in the spec.

**Entrance.** Fully storyboarded (six frames with timings and easing, 1400 ms total, reduced-motion variant 1200 ms) and implemented on `home-1440` as a reference: overlay over rendered content, sessionStorage, skip on click or key, the hero's rule receives the light at 1250 ms. Tweaks on that page replay it and show the reduced-motion variant.

**Motion.** Round 1 spec kept. Added: how the rim glow moves between plates (nearest center wins, 10% hysteresis, resolves on scroll end, 400 / 200 / 600 handover, a playing video forces its plate lit) and the 390 case with two plates partly visible.

**Copy.** Precious headings removed. Work heading is now "Five things built and shipped, most recent first." Still placeholder.

## Open items

- Poster frame for the odds console (first second of `odds-display-demo.mp4`).
- A current resume PDF for V.
- Scott's own copy.
