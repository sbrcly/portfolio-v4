import type { Metadata } from "next";
import Lightbox from "@/components/lightbox/Lightbox";
import arbitrageTable from "@/public/images/arbitrage-table.png";
import inplayOdds from "@/public/images/inplay-odds.png";
import tradingSchedule from "@/public/images/trading-schedule.png";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Before founding Prava, I built internal tools and revenue systems in sports betting and ticketing. Every tool exists because my team and I needed it.",
  openGraph: {
    title: "Experience · Scott Barclay",
    description:
      "Internal tools and revenue systems in sports betting and ticketing.",
  },
};

const repoLinkStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.8125rem",
  marginTop: "0.5rem",
};

const captionStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.75rem",
  color: "var(--ink-dim)",
  marginTop: "0.75rem",
};

const mediaStyle: React.CSSProperties = {
  width: "100%",
  height: "auto",
};

/* Prose blocks that follow a full-width band re-open outside it, so the
   band's own spacing rule can't cover them. */
const afterBandStyle: React.CSSProperties = { marginTop: "2.5rem" };

/* Shared between the band figcaption and the lightbox caption */
const scheduleCaption = "Every game we offered, with an owner.";
const inplayCaption =
  "Implied probability, Brewers @ Cubs: our line vs. the market.";
const arbitrageCaption = "Live arb detection across ~50 books.";

function RepoLink({ slug }: { slug: string }) {
  return (
    <a href={`https://github.com/${slug}`} target="_blank" rel="noopener">
      github.com/{slug}
    </a>
  );
}

function MediaBand({
  caption,
  children,
}: {
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="screenshotBand">
      {children}
      <figcaption style={captionStyle}>{caption}</figcaption>
    </figure>
  );
}

export default function ExperiencePage() {
  return (
    <article className="container page">
      <header>
        <p className="eyebrow entranceMask">
          <span>Experience</span>
        </p>
        <h1 className="pageTitle entranceMask">
          <span>Proprietary work, told in prose.</span>
        </h1>
        <p className="lede">
          Before founding Prava, I built internal tools and revenue systems in
          sports betting and ticketing. I came to engineering from the trading
          desk. Every tool below exists because my team and I needed it. Some
          of this work is proprietary; where a sanitized public repo exists,
          it&apos;s linked.
        </p>
      </header>

      <section className="section">
        <h2 className="eyebrow">Caesars (William Hill): Sports Trading</h2>
        <div className="prose">
          <p style={{ marginTop: "1.25rem" }}>
            I worked as a sports trader and taught myself to code by building
            the tools the desk was missing.
          </p>

          <h3 className="subheading">Live Odds Display</h3>
          <p>
            A real-time market view for the trading desk. An ingestion service
            I built separately pulls competitor odds via APIs into Google
            BigQuery; the display streams that data to traders over Socket.io,
            updating every five seconds with movement coloring: green when a
            line moves toward the bettor, red when it moves away. Traders used
            it to see exactly where our lines sat against the market on
            moneyline, spread, and total.
          </p>
          <p style={repoLinkStyle}>
            <RepoLink slug="sbrcly/Odds-Display-Public" /> ·{" "}
            <RepoLink slug="sbrcly/Odds-Tracker-Public" />
          </p>
        </div>

        <MediaBand caption="Live market view: green toward the bettor, red against. Click to play.">
          <video
            controls
            preload="metadata"
            playsInline
            aria-label="Demo video of the live odds display updating in real time"
            style={mediaStyle}
          >
            <source src="/videos/odds-display-demo.mp4" type="video/mp4" />
          </video>
        </MediaBand>

        <div className="prose" style={afterBandStyle}>
          <h3 className="subheading" style={{ marginTop: 0 }}>
            Trading Schedule
          </h3>
          <p>
            A scheduling system that pulls every game we offered across sports
            from BetRadar and BetGenius feeds and assigns traders to them based
            on their schedules and league coverage. Traders filter by date,
            keyword, or league; games without an assigned trader are flagged
            until someone owns them.
          </p>
          <p style={repoLinkStyle}>
            <RepoLink slug="sbrcly/Trading-Schedule-Public" />
          </p>
        </div>

        <MediaBand caption={scheduleCaption}>
          <Lightbox
            src={tradingSchedule}
            alt="The trading schedule home screen: a table of upcoming games across sports with assigned traders."
            caption={scheduleCaption}
            sizes="(max-width: 72rem) 100vw, 69rem"
          />
        </MediaBand>

        <div className="prose" style={afterBandStyle}>
          <h3 className="subheading" style={{ marginTop: 0 }}>
            In-Play Odds Tracker
          </h3>
          <p>
            A Python tool charting in-play implied probability across the
            course of a game: our line against DraftKings, FanDuel, Pinnacle,
            and Unibet, update by update.
          </p>
        </div>

        <MediaBand caption={inplayCaption}>
          <Lightbox
            src={inplayOdds}
            alt="Chart of in-play implied probability for a Brewers at Cubs game, comparing Caesars' line against four competitors over two hours of updates."
            caption={inplayCaption}
            sizes="(max-width: 72rem) 100vw, 69rem"
          />
        </MediaBand>

        <div className="prose" style={afterBandStyle}>
          <h3 className="subheading" style={{ marginTop: 0 }}>
            Arbitrage Calculator
          </h3>
          <p>
            Compared every market we offered against roughly fifty competitor
            sportsbooks, live. Server side pulls the books&apos; odds via APIs
            and emits over Socket.io on a one-minute cycle; the client flags
            any price of ours that opens an arbitrage a bettor could lock in,
            so traders could correct the line before it was exploited.
          </p>
          <p style={repoLinkStyle}>
            <RepoLink slug="sbrcly/Arbitrage-Public" />
          </p>
        </div>

        <MediaBand caption={arbitrageCaption}>
          <Lightbox
            src={arbitrageTable}
            alt="The arbitrage calculator's live table, with flagged arbitrage opportunities against competitor sportsbooks."
            caption={arbitrageCaption}
            sizes="(max-width: 72rem) 100vw, 69rem"
          />
        </MediaBand>
      </section>

      <section className="section">
        <h2 className="eyebrow">Etainement: Ticketing</h2>
        <div className="prose">
          <p style={{ marginTop: "1.25rem" }}>
            Revenue systems for a ticket brokerage: a pricing portal and the
            browser tooling that connected it to the marketplaces. Both
            proprietary. Happy to walk through either in an interview.
          </p>

          <h3 className="subheading">Pricing Portal</h3>
          <p>
            The core system I worked on: a portal for analyzing our ticket
            inventory against the live market, and setting and adjusting prices
            across it.
          </p>

          <h3 className="subheading">Ticket Broker Extension</h3>
          <p>
            A Chrome extension that sits inside major ticketing sites,
            including Ticketmaster, and communicates with our pricing portal.
            One example of what it did: buyers set purchasing rules in the
            portal, and the extension fetched those rules and altered
            Ticketmaster&apos;s venue maps in-page, so the employees buying
            inventory knew exactly which seats to buy without having to think
            about it. Cross-origin messaging, DOM automation against sites
            hostile to automation, and state kept in sync between systems never
            designed to talk to each other.
          </p>
        </div>
      </section>
    </article>
  );
}
