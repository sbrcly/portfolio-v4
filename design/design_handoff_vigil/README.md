# Handoff: scottbarclay.dev, Vigil (round 2, build-ready design)

## Overview
Design reference for Scott Barclay's portfolio: one scrolling page with chapters I to V (Home, About, Work, Contact, Resume link) and a separate Prava case-study page. Audience: engineering managers and senior engineers giving sixty seconds per page. Direction "Vigil": green-black ground, bone text, brass only as light, Spectral with JetBrains Mono, one lit element per viewport.

## About the design files
Everything in `design/round-2/vigil/` is a **design reference written in HTML**, not production code. Recreate it in the target codebase (sbrcly/portfolio-v4: Next.js 16 App Router, TypeScript, CSS Modules, `next/font/google`) using its own patterns. Files open directly in a browser; `support.js` sits beside them and images resolve from `assets/` at the bundle root. `README.md` in that folder lists what changed from round 1.

## Fidelity
**High-fidelity** for layout, palette, type, spacing, states, motion timings, and accessibility markup. **Placeholder** for copy (realistic length; Scott's words to come), verify links (`#`), the resume PDF, and the video poster (first frame of `public/videos/odds-display-demo.mp4`, which exists in the repo).

## Tokens
Colors: ground #121A16, surface #1A2520, wood #2B2019 (reserved), rule #2E3B34, dim numeral #4A5A50 (decorative only), text #E4DBCB (12.9:1 on ground), muted #A89F90 (6.8:1), brass #E0AE62 (8.8:1), lit #F3C77E (11.2:1).
Glow (lit text and rule): `text-shadow`/`box-shadow` 0 0 8px rgba(243,199,126,.6), 0 0 24px rgba(224,174,98,.35).
Plate rim resting: `box-shadow: 0 0 0 1px rgba(224,174,98,.35), 0 0 72px rgba(224,174,98,.10)`. Lit: 1px at .6, 96px at .18.
Type: Spectral 200/300/400 (display and body), JetBrains Mono 300/400/500 (labels, nav, specs; uppercase .10 to .14em tracking for labels).
Scale at 1440: name 112/1.0 (200), chapter statement 40/1.2 (300), work title 44/1.1 (300), body 20/1.6 (300), hero statement 24/1.45, mono 12 and 11. At 1024: 88 / 32 / 36 / 20. At 390: 60 / 28 / 32 / 17, mono 11 and 10.
Spacing: 4 8 12 16 24 32 40 48 64 128 176 (between work entries) 225 (chapter pad, 25svh capped; 192 at 1024, 150 at 390). Radii 0 except the 50% play ring. Hairlines 1px. Dashed strokes only for origin boundaries in the diagram.

## Layout
Column 1120 centered (min(1120, 100vw - 160)); 960 at 1024; full width with 20px insets at 390 where plates bleed to the edge (margin -20).
Still frame: sticky element 96px tall (80 on phone) containing a 72px bar (60 on phone); background `linear-gradient(to bottom, #121A16 0%, #121A16 56%, rgba(18,26,22,.72) 78%, rgba(18,26,22,0) 100%)`; no border, no blur; `pointer-events: none` except on the bar. Left: SB mark (two 1px brass verticals 18px tall flanking mono "SB" 12px .14em, 1x5 brass ticks above and below). Right: ruled nav table, one cell per chapter, 1px #2E3B34 border and dividers, padding 9px 16px, mono 12 uppercase .08em, numeral brass, label muted; current chapter: both to #F3C77E, no glow, `aria-current="page"`. Phone: numerals only, 12px, 18px gaps, each link `aria-label="II About"` etc.

**I Home (option A).** `min-height: 100svh`, content anchored to vertical center. Absolute top row at 112px (128 at 1920, 96 at 1024, 84 at 390 where it wraps to two lines): "I Home", a 1px rule, email (bone, not uppercase), "/" separators in rule color, "Seattle or remote", "Available late 2026", mono 12 uppercase .10em. Center group: 72x2 lit rule (56x2 on phone) with glow, 40px, name, 40px, statement max-width 720.

**Chapter openers (II, III, IV; Prava 01 to 05).** Grid 280 + 64 + 1fr (200 + 40 at 1024; stacked below 720). Left: `<span aria-hidden="true">` numeral Spectral 200, 140px/.85 tracking -.04em, color #4A5A50 (96px at 1024; 72px inline beside the label at 390), then the `<h2>` mono 12 uppercase .14em muted, 12px below. Right: 1px top rule, 28px, chapter statement 40/1.2, 32px, body paragraphs 20/1.6 max-width 680 with 20px gaps (last paragraph muted), then a ruled mono fact row (three columns: Working in, Looking for, Verify) 48px below.

**Work entries (treatment T3).** Title row: `<h3>` 44/1.1 weight 300 with a mono index "01" (13px .10em muted, `aria-hidden`) 20px before it; right-aligned mono meta 12 .06em muted; 16px padding-bottom; 1px rule. 40px. Media full column width with the plate rim. 32px. Caption row grid 1fr 1fr gap 64: sentence 20/1.55 left; mono 12/1.8 muted spec run right with a brass "Read the case study" link (1px underline at brass .4) and bone verify links (1px underline in rule color). Entries 176px apart (112 on phone, where caption rows go single column).
- 01 Prava: four screenshots in a 4-col grid, gap 24, padding 48 on surface (2 screenshots, gap 14, padding 24 20 on phone).
- 02 Live odds console (video): see states below.
- 03 Arbitrage detector, 04 Trading schedule: image plates.
- 05 Marketplace extension: origin-boundary diagram (see `extension-diagram.dc.html`, option 1): figure on surface with 48 padding; grid 1fr 160 1fr; two dashed (#4A5A50) origin boxes each with a mono header row (Origin A / hostname) and two inner boxes (1px rule border on ground); center column with a vertical dashed boundary line and a brass-bordered Extension box containing Background worker, "chrome.runtime message port", Content script; label "origin boundary" above; four numbered steps in a ruled 4-col row beneath. Phone: the three parts stack with a horizontal dashed boundary.

**IV Contact.** Opener, statement "Email is the only channel.", email as the lit element: Spectral 200, 48px, #F3C77E with glow (26px with `word-break: break-all` on phone), muted paragraph 20.

**Footer.** 1344 wide (960 at 1024; inset 20 on phone), 1px top rule, mono 12 muted: "Scott Barclay · 2026" left; email and "V Resume" right.

**Prava page.** Same frame, nav current = III. Title block like the hero (top row "III Work / 01 ... 2025 to now / iOS / Live on the App Store", lit rule, "Prava" 112, two-column row: lede 24 left, mono spec `dl` right: Role, Stack, Verify). Four-screen plate with mono 11 captions. Sections 01 to 05 as chapter openers (numerals "01" to "05", labels The problem, What was built, Three decisions, The back office, Outcome). 02 includes a ruled `dl` (120 + 1fr). 03 lists three decisions with lowercase roman mono indices and 26px subheads. 04 has a full-width cockpit plate and a 2-up plate row, each with mono captions. 05 closes with three mono links. Phone version in `prava-390.dc.html` (title 64px, numerals 72 inline, back-office plates stacked full-bleed).

## Video plate states (`video-states.dc.html`)
`<video poster muted playsinline preload="metadata">` wrapped in a button labeled "Play the odds console recording, 33 seconds, silent" (label becomes "Pause" while playing).
- Resting: poster at full brightness; 72px play ring (1px brass, fill rgba(18,26,22,.55), 18px brass triangle); mono meta bottom-left "odds-display-demo.mp4" bone, "· 33 s · silent" muted; rim resting. Focus: rim 1px steps to .6.
- Playing: ring and meta fade out 200 ms; rim to lit over 600 ms; native controls hidden, shown on hover/focus as a 44px bottom gradient bar with a 1px progress rule (brass fill) and mono "0:12 / 0:33" bottom-right, 160 ms fade.
- Ended: hold last frame; rim back to resting over 400 ms; ring returns 200 ms; meta reads "Replay" in brass.
- Autoplay muted at 60% visibility, pause on exit, resume on re-entry (never restart), one loop then end. No autoplay under reduced motion or Save-Data. Phone: 52px ring, 10px meta, tap toggles, controls hide after 2 s idle.

## Entrance ("Ember", `spec.dc.html`; reference implementation in `home-1440.dc.html` logic)
Overlay (position fixed, ground color, z above content) over content already in the DOM; once per session via `sessionStorage`; click, tap, Esc, any key skips to the handoff. Total 1400 ms.
- 0 to 400: 120x2 rule draws from center (scaleX 0 to 1), #F3C77E, glow 0 0 10px .9 and 0 0 32px .5; `cubic-bezier(.22,1,.36,1)`.
- 300 to 700: SB bracket mark fades in above the rule, bone, no glow, linear.
- 700 to 1000: rule cools #F3C77E to #E0AE62, glow to 0, ease-in-out.
- 1000 to 1400: veil opacity 1 to 0, `cubic-bezier(.4,0,.2,1)`. At 1250 the hero's rule (flat brass until now) warms to #F3C77E and takes its glow over 150 ms.
- 1400: overlay removed. Skip jumps to 1000.
- Reduced motion: mark and rule appear together, flat brass, hold 900, 300 ms opacity fade; hero rule lit from first paint; 1200 ms total.

## Motion
- One lit thing per viewport: Home the rule; About nothing; Work one plate rim; Contact the email. Handover: cool 400 ms, dark 200 ms, warm 600 ms, `cubic-bezier(.16,1,.3,1)`, never overlapping.
- Plate to plate: lit plate = center nearest viewport center (IntersectionObserver with 10% thresholds plus scroll-end check); 10%-of-viewport hysteresis; no handover while scroll events are within the last 120 ms; if no plate within 35% of center the current stays lit; animate a CSS variable driving the shadow alpha, not box-shadow keyframes. A playing video forces its plate lit.
- Reveals: opener numeral opacity 0 to 1 over 900 ms, no movement; measure and plate opacity plus 12px rise, 600 ms, staggered 120/200 ms; fire once at 20% visibility, unobserve, never replay; hidden pre-state applied by JS to below-fold elements only.
- Hover: links to brass with underline, 160 ms. No lift or scale anywhere.
- Reduced motion: no translate; 200 ms opacity reveals; rim swap instant after the 200 ms gap; no autoplay.

## Accessibility
Chapter numerals `aria-hidden`; mono labels are the `h2` and `aria-labelledby` targets; work indices `aria-hidden`; nav links carry numeral plus name; dim numeral contrast (2.3:1) is decorative by design. Body and muted text pass AA on ground and surface.

## Breakpoints
1920+: column stays 1120, hero 100svh, chapter pad 25svh. 1199: opener to 200 + 40, numeral 96, name 88, titles 36, plate padding 32. 719: opener stacks (numeral 72 inline with label), caption rows single column, plates bleed, hero top row wraps.

## State
Session flag for the entrance; current chapter (nav + lit handover); revealed set; lit plate id; video state (resting, playing, ended).

## Assets
`assets/`: Prava screens (1320x2868), cockpit/prompt-lab/simulator (~3440x1975), arbitrage-table (3840x1983), trading-schedule (2551x1366), inplay-odds, incognito-after. In repo but not in this bundle: `public/videos/odds-display-demo.mp4` (33 s, silent); export its first frame as the poster. Needed: current resume PDF.

## Files
- `design/round-2/vigil/home-1920.dc.html`, `home-1440.dc.html` (entrance reference), `home-1024.dc.html`, `home-390.dc.html`
- `design/round-2/vigil/prava-1440.dc.html`, `prava-390.dc.html`
- `design/round-2/vigil/hero-options.dc.html` (A chosen; B alternative), `extension-diagram.dc.html` (1 chosen; 2 alternative), `video-states.dc.html`, `spec.dc.html`, `README.md`
- `design/round-2/vigil/png/` full-page exports of every page and state
- `design/round-1/` kept for history; not the build target
