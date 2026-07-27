import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Self-taught engineer: trading desk at William Hill, then the tools the desk needed, then a year as the sole developer of Prava.",
  openGraph: {
    title: "About · Scott Barclay",
    description:
      "Self-taught engineer, from the trading desk to solo founder of Prava.",
  },
};

export default function AboutPage() {
  return (
    <article className="container page">
      <header>
        <p className="eyebrow entranceMask">
          <span>About</span>
        </p>
        <h1 className="pageTitle entranceMask">
          <span>From the trading desk to the App Store.</span>
        </h1>
      </header>

      <div className="prose" style={{ marginTop: "2.5rem" }}>
        <p>
          I&apos;m self-taught, and my route into engineering ran through a
          trading desk. At William Hill I priced sport for a living, got tired
          of the gap between what the desk needed and what it had, and started
          building the tools myself: an arbitrage calculator, a scheduling
          system, a live odds dashboard. Building for colleagues ten feet away
          is an unforgiving feedback loop, and it taught me to love it.
        </p>
        <p>
          The desk led to Etainement, a ticket brokerage, where I spent three
          years building revenue systems: a portal for pricing our inventory
          against the live market, and the Chrome extension that connected it
          to Ticketmaster itself. Different market, same job: build the system
          that knows what things are worth.
        </p>
        <p>
          Then I spent a year as the founder and sole developer of Prava, an
          AI faith journal for iOS. Every migration, every App Store
          submission, every support email: mine. There is no better forcing
          function for engineering judgment than knowing that nobody is coming
          to review the deploy.
        </p>
        <p>
          Solo work taught me habits I didn&apos;t expect: writing decisions
          down because future-me is the only reviewer, shipping everything
          behind flags because rollback is a one-person on-call rotation, and
          holding a quality bar when no one is checking. What it can&apos;t
          teach is the thing I want next: the sharpening that only comes from
          strong colleagues. That&apos;s why I&apos;m looking for a team.
        </p>
        <p>
          The honest version of why a founder is job-hunting: I have spent the
          past year building Prava full time, and a product this young
          doesn&apos;t pay a salary. I have a family. I&apos;m not winding
          Prava down and I&apos;m not waiting for it to rescue me. It moves to
          a contained evenings-and-weekends scope, run with the same
          discipline it was built with, while my working day belongs to a
          team. And after a year of shipping alone, I genuinely miss the thing
          an office is actually for: people who are better than me at
          something, ten feet away.
        </p>
        <p>
          Away from a keyboard: I run marathons, play tennis and piano, spend
          time with my family, and keep one day a week fully offline.
        </p>
      </div>
    </article>
  );
}
