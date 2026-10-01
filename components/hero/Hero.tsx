import { EMAIL } from "@/components/frame/chapters";
import styles from "./hero.module.css";

export default function Hero() {
  return (
    <section id="i" className={styles.hero} aria-labelledby="h-i">
      <div className={styles.topRow}>
        <span className={styles.chapter}>
          <span className={styles.numeral}>I</span>&nbsp; Home
        </span>
        <span className={styles.fill} />
        <a href={`mailto:${EMAIL}`} className={styles.email}>
          {EMAIL}
        </a>
        <span className={styles.separator} aria-hidden="true">
          /
        </span>
        <span className={styles.location}>Seattle or remote</span>
        <span className={styles.separator} aria-hidden="true">
          /
        </span>
        <span className={styles.availability}>Available late 2026</span>
      </div>
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
        pricing portal and Chrome extension for a ticket brokerage, and an iOS
        app designed, built, and shipped alone.
      </p>
    </section>
  );
}
