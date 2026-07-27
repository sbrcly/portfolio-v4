import type { Metadata } from "next";
import Image from "next/image";
import incognitoBefore from "@/public/images/incognito-before.png";
import incognitoAfter from "@/public/images/incognito-after.png";

const beforeAfterScreens = [
  {
    src: incognitoBefore,
    caption: "Before: the site the business had.",
    alt: "The previous Incognito Wraps website, a dated 90s-era layout.",
  },
  {
    src: incognitoAfter,
    caption: "After: the rebuild in staging.",
    alt: "The rebuilt Incognito Wraps homepage: flat black hero with bold type reading Wrap it. Protect it. Drive it. over a photo of a wrapped truck.",
  },
];

export const metadata: Metadata = {
  title: "Incognito Wraps: client rebuild",
  description:
    "Case study in progress: ground-up rebuild of a car wrap company's site with a headless CMS handoff.",
  openGraph: {
    title: "Incognito Wraps: client rebuild",
    description:
      "Ground-up rebuild of a car wrap company's site with a headless CMS handoff.",
  },
};

export default function IncognitoWrapsPage() {
  return (
    <article className="container page">
      <header>
        <p className="eyebrow entranceMask">
          <span>Case study: in progress</span>
        </p>
        <h1 className="pageTitle entranceMask">
          <span>Incognito Wraps</span>
        </h1>
        <p className="lede">
          A ground-up rebuild of a car wrap company&apos;s 90s-era website:
          modern site, modern stack, and a CMS the owner actually runs.
        </p>
      </header>

      <div className="caseLayout">
        <aside className="caseAside" aria-label="Project spec">
          <div className="specCard">
            <h2 className="specLabel">Spec</h2>
            <dl>
              <div>
                <dt>Role</dt>
                <dd>Sole developer, client work</dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd>Next.js 16 · Sanity · Vercel</dd>
              </div>
              <div>
                <dt>Timeline</dt>
                <dd>2026</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>In staging</dd>
              </div>
            </dl>
          </div>
        </aside>

        <div className="caseMain">
          <section className="section">
            <p className="eyebrow">01: The brief</p>
            <h2 className="sectionTitle">
              Replace a 90s-era site without creating a developer dependency.
            </h2>
            <div className="prose">
              <p>
                Incognito Wraps came with a site that predated the business it
                was selling: dated layout, no mobile experience, and every
                content change routed through whoever built it last. The rebuild
                has two jobs: make the work look as good online as it does on
                the cars, and hand the owner the keys.
              </p>
              <p>
                The second job is the interesting one. The site is wired to a
                headless CMS so the owner updates photos, services, and pricing
                without a developer in the loop. A portfolio business that
                photographs its own work every week shouldn&apos;t need to file
                a ticket to show it off.
              </p>
            </div>
            <div className="screenshotBand">
              <div className="screenshotGrid twoUp">
                {beforeAfterScreens.map((screen) => (
                  <figure key={screen.caption}>
                    <Image
                      src={screen.src}
                      alt={screen.alt}
                      sizes="(max-width: 800px) 100vw, (max-width: 959px) 50vw, 33vw"
                    />
                    <figcaption>{screen.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          <section className="section">
            <p className="eyebrow">02: The design direction</p>
            <div className="prose">
              <p>
                The first build leaned dark, glossy, and techy. It photographed
                well and sold nothing. The redesign went the other way: flat
                surfaces, a bold condensed display face, and the shop&apos;s
                black and orange used like tape stripes instead of glow. The
                copy changed register with it. Lines like &ldquo;join elite
                vehicle owners&rdquo; became &ldquo;straight answers, clean
                installs, and a price that doesn&apos;t change.&rdquo; The site
                sounds like the front counter now, not a showroom.
              </p>
            </div>
          </section>

          <section className="section">
            <p className="eyebrow">03: The honesty constraint</p>
            <div className="prose">
              <p>
                The strictest rule on the project: nothing renders that the
                business can&apos;t stand behind. The rating on the site is 4.7
                stars across 126 reviews because that is the real Google
                number. The testimonials are real customers with their real
                names. Claims that haven&apos;t been verified with the owner,
                like warranty terms, certifications, and track record stats,
                are held out of the render entirely rather than dressed up. For
                a local business, invented proof is a legal liability and a
                trust leak. Empty is acceptable. Invented is not.
              </p>
            </div>
          </section>

          <section className="section">
            <p className="eyebrow">04: The handoff</p>
            <div className="prose">
              <p>
                The site reads everything from Sanity: business info, services,
                packages, portfolio, testimonials, and hero photography. The
                schema does the protecting. Site Settings is a single locked
                document, alt text is required on every image, and slugs
                can&apos;t be omitted. The owner logs into a hosted Studio,
                uploads photos of the week&apos;s work, presses Publish, and
                the site follows within the hour. No developer in the loop,
                which was the whole point.
              </p>
            </div>
          </section>

          <section className="section">
            <p className="eyebrow">05: What&apos;s left</p>
            <div className="prose">
              <p>
                The site is in staging while the owner&apos;s photo library and
                verified claims come in. Still ahead: a quote form, an
                interactive coverage map that highlights which panels each
                package covers on a photo of a real car, and the DNS cutover to
                the live domain.
              </p>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
