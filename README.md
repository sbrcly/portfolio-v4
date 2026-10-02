# scottbarclay.dev

Scott Barclay's portfolio: one scrolling home page in four chapters (Home,
About, Work, Contact, plus a resume link) and a case study page for Prava at
`/work/prava`. The design direction is called Vigil: a green-black ground,
bone text, brass used only as light, and one lit element per viewport.

## Stack

- Next.js 16 (App Router, Turbopack) and React 19, TypeScript
- CSS Modules, with two global stylesheets: `app/tokens.css` and
  `app/globals.css`
- Fonts through `next/font/google`, self-hosted: Spectral 200 and 300 (plus
  italic 200 and 300) and JetBrains Mono
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
rule, dim numeral, text, muted, brass, lit), the glow and plate-rim shadow
recipes, the spacing scale, the type scale, and the layout widths (column,
footer, frame). Each breakpoint redefines the same custom properties, so
components read a token and never repeat a media query for it.

`app/globals.css` holds the reset, the link and focus styles, the skip link,
and the `--light` property described below.

## Entrance and light

The entrance ("Ember") is a ground-colored veil over content that is already
rendered. A small inline script in the root layout runs before first paint
and sets `data-entrance` on `<html>`: it plays only on the first page load of
a browser session, only when that load is the home page, and never when
session storage is unusable. The 1400 ms timeline is plain CSS in
`components/entrance/`: a rule draws from its center, the SB mark fades in,
the rule cools, the veil clears, and the hero's own rule takes the light as
it does. Any key or click skips to the handoff. Under reduced motion the mark
and rule appear together, hold, and fade.

The light is one registered custom property, `--light`, that runs from 0 to
1 on any element marked `data-light`. It drives both the color and the glow,
so nothing keyframes a shadow. `components/chapters/current-chapter.ts`
tracks which chapter is crossing the middle of the viewport with a single
IntersectionObserver, and `components/light/handover.ts` moves the light:
the outgoing element cools over 400 ms, nothing is lit for 200 ms, and the
incoming one warms over 600 ms, never overlapping. Chapters with several
candidates (the work plates, the back-office plates on the Prava page) pick
the plate nearest the viewport center in `components/work/plate-light.ts`. A
playing video holds the light on its own plate until it ends.

## Breakpoints

| Width | What changes |
| --- | --- |
| 1200 and up | Column `min(1120px, 100vw - 160px)`, opener grid 280 + 64, chapter padding 25svh capped at 225px |
| 1199 and down | Column 960, opener grid 200 + 40, numerals 96, name 88, titles 36, chapter padding 192 |
| 719 and down | Full width with 20px insets, openers stack, plates bleed to the edge, nav shows numerals only, chapter padding 150 |

The hero's top row also moves to 128px from the top at 1920 and wider.

## Structure

```
app/
  layout.tsx, tokens.css, globals.css
  page.tsx                    Home: chapters I to IV
  work/prava/                 Prava case study
  icon.tsx, apple-icon.tsx    Generated icons (the SB mark)
  opengraph-image.tsx         Generated share card (Prava has its own)
  sitemap.ts, robots.ts
components/
  frame/                      Sticky frame, SB mark, nav table
  hero/, chapter-opener/      Chapter I and the opener used everywhere else
  work/                       Work entries, plates, video plate, diagram
  entrance/, light/, chapters/, reveals/
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

- `public/resume.pdf`: the resume behind "V Resume"
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
