import { EMAIL } from "@/components/frame/chapters";
import TextLink from "@/components/text-link/TextLink";
import styles from "./hero.module.css";

export default function Hero() {
  return (
    <section
      id="i"
      className={styles.hero}
      aria-labelledby="h-i"
      data-chapter="0"
    >
      <div className={styles.opener}>
        {/* Below 960px only; above it the running margin reads I Home. */}
        <div className={styles.head} aria-hidden="true">
          <span className={styles.numeral}>I</span>
          <span className={styles.label}>Home</span>
        </div>
        <div className={styles.measure} data-fade="">
          <h1 id="h-i" className={styles.name}>
            Scott Barclay
          </h1>
          <p className={styles.statement}>
            Software engineer.{" "}
            <TextLink href="#employer-03">Trading desk tools</TextLink> for a Las
            Vegas sportsbook,{" "}
            <TextLink href="#employer-02">
              a pricing portal and Chrome extension
            </TextLink>{" "}
            for a ticket brokerage, and{" "}
            <TextLink href="#employer-01">an iOS app</TextLink> designed, built, and
            shipped alone.
          </p>
          <a href={`mailto:${EMAIL}`} className={styles.email}>
            {EMAIL}
          </a>
        </div>
      </div>
    </section>
  );
}
