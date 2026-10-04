# scottbarclay.dev

Scott Barclay's portfolio: one scrolling home page in three chapters (About,
Work, Contact, plus a resume link) and a case study page for Prava at
`/work/prava`. The design direction is called Vigil: a green-black ground,
bone text, brass used only as light, and one lit element per viewport.

## Stack

- Next.js 16 (App Router, Turbopack) and React 19, TypeScript
- CSS Modules, with two global stylesheets: `app/tokens.css` and
  `app/globals.css`
- Fonts through `next/font/google`, self-hosted: Spectral 200, 300, and 400
  (plus italic 200 and 300) and JetBrains Mono
- No animation library, no client data fetching, no analytics, no third
  party scripts

## Design reference

`design/design_handoff_vigil/` is the handoff this site was built from.
`README.md` there holds the tokens, layout, motion, and accessibility notes.
The `.dc.html` files under `design/round-2/vigil/` are static mockups to
measure against, not code to ship; `png/` has full-page exports of each.
`reports/PORTFOLIO_DISCOVERY.md` is the audit of the previous site that the
rebuild started from.

## Tokens

`app/tokens.css` is the single source for the palette (ground, surface,
rule, dim numeral, text, muted, brass, lit), the glow recipe, the spacing
scale, the type scale, and the layout widths (column, frame). Each breakpoint redefines the same custom properties, so
components read a token and never repeat a media query for it.

`app/globals.css` holds the reset, the link and focus styles, the skip link,
and the `--light` property described below.

## Light

The light is one registered custom property, `--light`, that runs from 0 to
1 on any element marked `data-light`. It drives both the color and the glow,
so nothing keyframes a shadow. `components/chapters/current-chapter.ts`
tracks which chapter is crossing the middle of the viewport with a single
IntersectionObserver, and `components/light/handover.ts` moves the light:
the outgoing element cools over 400 ms, nothing is lit for 200 ms, and the
incoming one warms over 600 ms, never overlapping. The contact email in
chapter III is the only element that takes it. Plates have a one-pixel rim in
the rule color and nothing more, in every state.

Each employer's block has an anchor, `employer-01` to `employer-03`, and
each project one named for it, `work-prava`. A jump to an employer lands its
row under the frame (the page's scroll padding); a jump to a project lands
its top, a hero's title row or a cell's plate, under the pinned row and clear
of its tail. Either sets chapter II at once. Nothing on the site links to the
employers now. Chapter I's paragraphs link to six of the projects through
`components/text-link/` (Spectral 400 in the text color inside a muted 300
paragraph, no underline, brass on hover and focus).

The only hairlines are the plates' rims and the strokes inside the extension
diagram. Nothing else on either page is ruled: not the employer rows, the
title rows, the fact rows, the openers, or the footer.

## Scroll-driven motion

From 960px up, two things move with the scroll rather than on a timer, as
CSS scroll-driven animations where `animation-timeline: view()` is supported
and through a per-frame script writing the same values into CSS variables
where it is not (`components/scroll/`, `components/fade/`). Content blocks
marked `data-fade` are at full opacity while their center is within 25svh of
the viewport's midline and fall to 0.15 as it reaches an edge (`globals.css`).
The running margin (`components/margin/`) is pinned with its numeral's top
edge 120px from the viewport's top (the frame's 96 and 24); its numeral is
individual glyphs that are held, added, or exchanged across each chapter
boundary, and its label crossfades at the boundary. Reduced motion has no
fade and swaps the numeral at the boundary. Below 960px there is no margin
and content reveals once as it enters (`components/reveals/`).

From 960px up chapter I's block from the name to the fact row starts on the
same line as the margin's numeral, the name's top edge 120px from the
viewport's top at load (`app/page.module.css`). Below 960px it is an opener
like the others.

Chapters are one gap apart, from a chapter's last element to the next
chapter's first (`--chapter-gap`, the next chapter's top padding): 120px
from 1200 up, 96px below. The same gap is above the footer, and on the
Prava page between its sections. A page that ends before its last chapter's
top reaches the midline ends on that chapter all the same: the numeral, the
nav, and the docked icons finish with the page.

## Breakpoints

| Width | What changes |
| --- | --- |
| 1200 and up | Column `min(1120px, 100vw - 160px)`, opener grid 280 + 64, chapter gap 120 |
| 1199 and down | Column 960, opener grid 200 + 40, numerals 96, name 88, titles 36, chapter gap 96 |
| 719 and down | Full width with 20px insets, openers stack, plates bleed to the edge, nav shows numerals only |

The Prava title's top row also moves to 128px from the top at 1920 and wider.

The frame's bar holds only the nav table, centered at every width. The
footer spans the column at every width.

## Structure

```
app/
  layout.tsx, tokens.css, globals.css
  page.tsx                    Home: chapters I to III
  work/prava/                 Prava case study
  icon.tsx, apple-icon.tsx    Generated icons (the SB mark)
  opengraph-image.tsx         Generated share card (Prava has its own)
  sitemap.ts, robots.ts
components/
  frame/                      Sticky frame, nav table
  chapter-opener/             The opener every chapter starts with
  work/                       Work entries, plates, video plate, diagram
  margin/                     Running margin: numeral, label, icon links
  light/, chapters/, reveals/, fade/, scroll/
  text-link/                  Link inside running text
  footer/
lib/                          Image generators for the icons and share cards
```

## Run

```bash
npm ci
npm run dev      # development server
npm run build    # production build
npm start        # serve the production build
npx tsc --noEmit
npx eslint .
```

Node 22. The build fetches glyph subsets from Google Fonts to draw the icons
and share cards, so it needs network access.

## Deploy

The site is hosted on Vercel and deploys from `main`. CI
(`.github/workflows/ci.yml`) runs the install, type check, lint, and build
on every pull request and on pushes to `main`. `next.config.ts` sets three
response headers: `X-Content-Type-Options`, `Referrer-Policy`, and
`Permissions-Policy`. The canonical origin, `https://scottbarclay.dev`, is
set in `app/layout.tsx`, `app/sitemap.ts`, and `app/robots.ts`.

## Assets

- `public/resume.pdf`: the resume behind "IV Resume"
- `public/videos/odds-display-demo.mp4`: the odds console recording, 33
  seconds, silent, H.264, 2062 x 1080
- `public/images/odds-console-poster.webp` and
  `odds-console-poster-1200.webp`: the video's poster frame at full size and
  for phones; `odds-console-poster.jpg` is the same frame as a JPEG, kept as
  a source
- `public/images/prava-home.png`, `prava-lectio.png`, `prava-journal.png`,
  `prava-circle.png`: the four app screens
- `public/images/prava-cockpit.png`, `prava-prompt-lab.png`,
  `prava-simulator.png`: the back-office screens
- `public/images/arbitrage-table.png`, `trading-schedule.png`: work entries
  03 and 04
- Three images from the previous site are still in `public/images/` and are
  not referenced by any page
