import type { Metadata } from "next";
import Image from "next/image";
import pravaHome from "@/public/images/prava-home.png";
import pravaLectio from "@/public/images/prava-lectio.png";
import pravaJournal from "@/public/images/prava-journal.png";
import pravaCircle from "@/public/images/prava-circle.png";
import pravaCockpit from "@/public/images/prava-cockpit.png";
import pravaPromptLab from "@/public/images/prava-prompt-lab.png";
import pravaSimulator from "@/public/images/prava-simulator.png";

const heroScreens = [
  {
    src: pravaHome,
    caption: "The week is the spine. No streak anywhere.",
    alt: "Prava's home screen for the 17th Sunday in Ordinary Time: a verse card from Romans 8, this week's readings with completed checkmarks, and the Prayers and Creeds row.",
  },
  {
    src: pravaLectio,
    caption: "One verse, slowly. Prayer in your own words.",
    alt: "The Pray movement of Lectio Divina: Romans 8:28-30 with a phrase highlighted, a text field labeled In your own words, and a Help me pray this button.",
  },
  {
    src: pravaJournal,
    caption: "The daily journal: honest yes and no, nothing pre-filled.",
    alt: "The daily journal asking How was yesterday, with Light, Normal, and Heavy load options and yes or no questions including Pray, Read your Bible, and Confess something to God.",
  },
  {
    src: pravaCircle,
    caption: "A few people keeping the same week.",
    alt: "A Circle group screen: nine members reading Romans, this week's verse, and a feed of marks such as a member praying the Examen.",
  },
];

const backOfficeScreens = [
  {
    src: pravaCockpit,
    caption: "The cockpit: eleven tools, one stack.",
    alt: "Prava's admin home: a grid of eleven internal tool cards including Analytics, Commitments, Memory Verse, Prayers and Creeds, Lectionary, Teaching, Discovery, Prompt Lab, and more.",
    sizes: "(max-width: 959px) 100vw, 66vw",
  },
  {
    src: pravaPromptLab,
    caption: "Prompt Lab: versioned prompts, diffed and drift-checked.",
    alt: "The Prompt Lab: versioned system prompt surfaces with history, diffs, and drift between database and in-code fallback.",
    sizes: "(max-width: 800px) 100vw, (max-width: 959px) 50vw, 33vw",
  },
  {
    src: pravaSimulator,
    caption: "Profile Simulator: the matching algorithm, testable in an afternoon.",
    alt: "The Profile Simulator: a built user profile on the left, simulation results and a scored daily selection preview on the right.",
    sizes: "(max-width: 800px) 100vw, (max-width: 959px) 50vw, 33vw",
  },
];

export const metadata: Metadata = {
  title: "Prava: AI faith journal for iOS",
  description:
    "Case study: Prava, an AI faith journal for iOS. Designed, built, and shipped solo, from first commit to the App Store.",
  openGraph: {
    title: "Prava: AI faith journal for iOS",
    description:
      "Designed, built, and shipped solo, from first commit to the App Store.",
  },
};

export default function PravaPage() {
  return (
    <article className="container page">
      <header>
        <p className="eyebrow entranceMask">
          <span>Case study: flagship</span>
        </p>
        <h1 className="pageTitle entranceMask">
          <span>Prava</span>
        </h1>
        <p className="lede">
          An AI faith journal for iOS. Designed, built, and shipped solo, from
          first commit to the App Store.
        </p>
        <div className="screenshotBand">
          <div className="screenshotGrid">
            {heroScreens.map((screen) => (
              <figure key={screen.caption}>
                <Image
                  src={screen.src}
                  alt={screen.alt}
                  sizes="(max-width: 800px) 50vw, 25vw"
                />
                <figcaption>{screen.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </header>

      <div className="caseLayout">
        <aside className="caseAside" aria-label="Project spec">
          <div className="specCard">
            <h2 className="specLabel">Spec</h2>
            <dl>
              <div>
                <dt>Role</dt>
                <dd>Founder &amp; sole developer</dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd>
                  TypeScript · Next.js · Capacitor · Postgres/Prisma ·
                  Anthropic API
                </dd>
              </div>
              <div>
                <dt>Timeline</dt>
                <dd>2025–present</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>Live on the App Store</dd>
              </div>
            </dl>
          </div>
        </aside>

        <div className="caseMain">
          <section className="section">
            <p className="eyebrow">01: The problem</p>
            <h2 className="sectionTitle">
              Faith apps borrow the wrong mechanics.
            </h2>
            <div className="prose">
              <p>
                Prava exists because I went looking for it and it didn&apos;t
                exist. I grew up in a Methodist church without any idea what
                made it Methodist, drifted away from the faith entirely, and
                came back years later through whatever church was closest.
                Something always felt like it was missing, so I started
                studying what Christians in each tradition actually believe and
                why. That question has taken my family through
                non-denominational, Lutheran, and Pentecostal churches, and is
                now leading us into the Catholic Church. Along the way I
                learned how much of what Christians think they know about other
                traditions is caricature. The apps I tried didn&apos;t help:
                verse graphics, streak counters, content with no tradition
                behind it. What I actually wanted already existed and was two
                thousand years old. The Church&apos;s week: her lectionary, her
                prayers, her creeds. Prava puts that at the center, across
                twelve traditions, in each tradition&apos;s own words.
              </p>
              <p>
                Most faith apps are habit trackers wearing vestments: streaks,
                scores, completion rings, and the quiet guilt that follows a
                missed day. Those mechanics optimize for showing up, but they
                punish honesty: the moment a spiritual practice becomes a
                scoreboard, people start performing for the app instead of
                telling it the truth.
              </p>
              <p>
                Prava&apos;s founding principle is{" "}
                <strong>record, not score</strong>. The journal is a place to be
                honest about where you actually are, not a meter to keep green.
                That principle sounds like product copy, but it turned out to be
                an engineering constraint: it shaped the schema, the AI
                prompts, and what the app refuses to measure.
              </p>
            </div>
          </section>

          <section className="section">
            <p className="eyebrow">02: What I built</p>
            <h2 className="sectionTitle">
              A full consumer product, run by one person.
            </h2>
            <div className="prose">
              <p>
                Prava is a native-feeling iOS app with a daily journal, prayer
                and scripture surfaces, a weekly lectionary, and social
                accountability circles. AI runs through the product: reflective
                journaling prompts, scripture guidance, and a voice prayer
                pipeline that records audio in the browser layer, stores it in
                Cloudflare R2, transcribes it with Whisper, and returns an
                LLM-written reflection.
              </p>
            </div>
            <dl className="factList" style={{ marginTop: "2rem" }}>
              <div>
                <dt>Platform</dt>
                <dd>
                  Next.js + TypeScript shipped inside Capacitor / WKWebView as a
                  native iOS app
                </dd>
              </div>
              <div>
                <dt>Revenue</dt>
                <dd>
                  Freemium subscriptions via RevenueCat, monthly and annual
                  plans
                </dd>
              </div>
              <div>
                <dt>AI</dt>
                <dd>
                  Anthropic models across five product surfaces, plus a voice
                  prayer pipeline: MediaRecorder → Cloudflare R2 → Whisper → LLM
                </dd>
              </div>
              <div>
                <dt>Data</dt>
                <dd>Neon Postgres with Prisma, additive-only migrations</dd>
              </div>
              <div>
                <dt>Analytics</dt>
                <dd>PostHog: product analytics and feature flags</dd>
              </div>
            </dl>
          </section>

          <section className="section">
            <p className="eyebrow">
              03: Engineering decisions worth talking about
            </p>
            <h2 className="sectionTitle">
              Three decisions I&apos;d defend in any interview.
            </h2>
            <div className="prose">
              <h3 className="subheading">AI cost optimization in three waves</h3>
              <p>
                The AI bill got attacked in order of leverage. First, waste
                elimination: cutting redundant calls and oversized context.
                Second, small-model routing: five product surfaces were moved to
                cheaper models where quality held. Third, prompt caching, with
                a usage-event table in Postgres that verifies the cache metrics
                the provider reports, because a cost optimization you can&apos;t
                independently measure is a rumor.
              </p>

              <h3 className="subheading">
                Product philosophy as engineering constraint
              </h3>
              <p>
                &ldquo;Record, not score&rdquo; is enforced in the data model,
                not the marketing site. The schema stores what happened, never a
                performance grade, and the automatic unlimited grace system
                means a missed day is recorded honestly without ever becoming a
                punishment mechanic. Deciding what the database refuses to know
                turned out to be one of the most interesting design problems in
                the product.
              </p>

              <h3 className="subheading">Solo-operator discipline</h3>
              <p>
                With no one to catch a bad deploy, the process had to be the
                second engineer: additive-only database migrations so nothing is
                ever un-shippable, snapshot-tested prompt fallbacks so an AI
                regression fails a test instead of a user, and features
                dark-shipped behind flags with written flip runbooks, so
                turning something on is a decision, not an event.
              </p>
            </div>
          </section>

          <section className="section">
            <p className="eyebrow">04: The back office</p>
            <div className="prose">
              <p>
                A product this size runs on a second product nobody sees.
                Prava&apos;s cockpit is eleven internal tools built on the same
                stack as the app: an analytics dashboard, authoring surfaces for
                prayers, teaching, and the lectionary, and the operational tools
                that keep the AI honest. Three earn a closer look.
              </p>
              <p>
                The Prompt Lab versions every system prompt behind the
                app&apos;s thirteen AI surfaces. Each surface reads its prompt
                from Postgres with an in-code fallback bound by snapshot tests,
                and the Lab shows history, diffs, and drift between the two.
                When a prompt changes, there is a record of what changed and
                when.
              </p>
              <p>
                The Profile Simulator tests the personalization engine without
                waiting on real users. Build a user profile from life contexts,
                run the selection algorithm, and see exactly which commitments
                it would serve that person, scores included. It turned tuning
                the matcher from guesswork into an afternoon.
              </p>
              <p>
                The lectionary tools manage the appointed Sunday readings
                across two traditions and seven Bible translations, with
                per-reading rights flags and a staging to production pipeline.
                Scripture licensing is a legal constraint, so the workflow
                enforces it: text only enters the app through cleared lanes.
              </p>
            </div>
            <div className="screenshotBand">
              <div className="screenshotGrid backOffice">
                {backOfficeScreens.map((screen) => (
                  <figure key={screen.caption}>
                    <Image
                      src={screen.src}
                      alt={screen.alt}
                      sizes={screen.sizes}
                    />
                    <figcaption>{screen.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          <section className="section">
            <p className="eyebrow">05: Outcomes</p>
            <h2 className="sectionTitle">
              Live, growing, and paying for itself.
            </h2>
            <div className="prose">
              <p>
                Prava has been live on the App Store since Easter 2026.
                It&apos;s used across a dozen Christian denominations, and it
                has paying subscribers on both monthly and annual plans. I keep
                the specific numbers off the internet on purpose. Happy to talk
                specifics in an interview.
              </p>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
