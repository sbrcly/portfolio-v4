import { EMAIL } from "@/components/frame/chapters";
import styles from "./hero.module.css";

export default function Hero() {
  return (
    <section
      id="i"
      className={styles.hero}
      aria-labelledby="h-i"
      data-chapter=""
    >
      <div className={styles.opener}>
        {/* Below 960px only; above it the running margin reads I Home. */}
        <div className={styles.head} aria-hidden="true">
          <span className={styles.numeral}>I</span>
          <span className={styles.label}>Home</span>
        </div>
        <div className={styles.measure}>
          {/* The chapter's lit element. Lit in the markup so it is lit at first paint. */}
          <div
            className={styles.rule}
            data-light="i"
            data-lit="true"
            aria-hidden="true"
          />
          <h1 id="h-i" className={styles.name}>
            Scott Barclay
          </h1>
          <p className={styles.statement}>
            Software engineer. Trading desk tools for a Las Vegas sportsbook, a
            pricing portal and Chrome extension for a ticket brokerage, and an
            iOS app designed, built, and shipped alone.
          </p>
          <a href={`mailto:${EMAIL}`} className={styles.email}>
            {EMAIL}
          </a>
        </div>
      </div>
    </section>
  );
}
