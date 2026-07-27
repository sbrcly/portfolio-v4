# scott-barclay: portfolio v4

Personal portfolio for Scott Barclay: software engineer & founder. Built with
Next.js (App Router, TypeScript) and CSS Modules. No canvas, no ambient
animation.

## Stack

- Next.js 16 / React 19, App Router, TypeScript
- CSS Modules + one `app/globals.css` (design tokens, reset, shared primitives)
- Fonts via `next/font/google`: Schibsted Grotesk (display), Inter (body),
  IBM Plex Mono (the data voice: ledger, spec sidebars, eyebrows, nav, labels)

## Structure

```
app/
  page.tsx                    Hero: positioning statement + shipping-record ledger
  work/prava/                 Flagship case study (prose + sticky spec sidebar)
  work/incognito-wraps/       Client case study (marked in progress)
  experience/                 Proprietary professional work, prose only
  about/
  connect/
  sitemap.ts, robots.ts       SEO routes
components/
  main-nav/                   Sticky nav, active-link logic, aria-current
  footer/
  todo/                       Visible TODO marker for unfinished content
```

## Design direction: "The Record"

The site's product philosophy borrows from Prava's founding principle:
*record, not score*. The portfolio is a precise, honest ledger of shipped
work: light paper, dense structured information, monospace data voice, zero
atmosphere or decoration. Spec sheet, not splash page.

- **Tokens** (`globals.css`): warm-white `--paper` background, `--paper-raised`
  for cards and screenshot bands, hairline `--line` rules, deep amber
  `--accent` for text-sized accents (4.5:1 on paper), `--accent-bright` for
  large/non-text uses only (underlines, hover arrows, the primary button fill).
- **The ledger** (home hero): the signature element. Entirely IBM Plex Mono:
  date / project / status / arrow rows, each row a full-width link into its
  case study. Hairline rules between rows only.
- **Motion layer**: everything is a response to something the visitor did.
  Nothing loops or runs ambiently. No animation libraries: CSS keyframes and
  transitions, one IntersectionObserver, and the View Transitions API.
  Timing: micro-interactions 120–200 ms (`--ease-hover`), entrances
  400–600 ms (`--ease-entrance`, ease-out-expo feel); the home load
  choreography (header → masked hero lines → ledger label + rows → CTAs)
  completes within ~900 ms. Details:
  - *Lamplight* (`components/lamplight/`): a warm cursor-following glow,
    `--accent-bright` at 5% over 500 px, desktop pointers only, one style
    write per frame via rAF-coalesced `pointermove`.
  - *Route transitions*: `experimental.viewTransition` + React's
    `<ViewTransition>` in `app/template.tsx`; old page fades slightly down,
    new page rises 8 px, ~200 ms; header/footer are pinned with their own
    `view-transition-name`. No browser support → hard cut, no polyfill.
  - *Scroll reveals* (`components/scroll-reveal/`): sections, spec sidebar,
    and screenshot bands rise 12 px on first viewport entry, once; the
    hidden pre-state is applied by JS only to below-fold elements, so
    content is never hidden without JS.
  - *Micro-interactions*: ledger group-dim via `:has()`, left-growing link
    underlines, 4 px arrow nudges, 1 px button lift, all with keyboard
    (`:focus-visible`) parity.
  - *Reduced motion*: all movement lives inside
    `@media (prefers-reduced-motion: no-preference)` blocks:
    correct-by-construction disabled, not shortened; color/opacity feedback
    remains.
- **Case studies**: two-column on desktop, prose plus a sticky mono spec
  sidebar (Role / Stack / Timeline / Status) on `--paper-raised`. Screenshot
  TODOs sit in full-width `--paper-raised` bands.
- **Restraint rules**: no shadows (depth = raised surface + hairlines), one
  border-radius (6px, used sparingly), no gradients, no icon library: the
  only icon is a typed `→`.

## Content TODOs

Every unfinished piece of content is marked in the UI by the `<Todo>`
component (mono amber type, dashed border on the raised surface). Search for
`<Todo>` to list them.
Highlights:

- Prava hero screenshots
- Incognito Wraps before/after shots (project in progress)
- Production domain swap in `app/layout.tsx`, `app/sitemap.ts`, and
  `app/robots.ts` before deploy

## Deploy checklist

- [ ] Replace `https://scottbarclay.dev` placeholder domain in
      `app/layout.tsx` (`metadataBase`), `app/sitemap.ts`, and `app/robots.ts`
- [ ] Clear every visible `<Todo>` on the site
- [ ] Add `public/resume.pdf`
- [ ] Add a real favicon / OG image
- [ ] `npm run build` clean, `npx eslint .` clean
- [ ] Check at 390px wide, keyboard-only, and with reduced motion enabled

## Commands

```bash
npm run dev     # dev server
npm run build   # production build
npm start       # serve the production build
npx eslint .    # lint
```
# portfolio-v4
