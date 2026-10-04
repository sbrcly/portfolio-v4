import { EMAIL, RESUME_HREF } from "@/components/frame/chapters";
import SocialIcons from "@/components/social/SocialIcons";
import styles from "./footer.module.css";

const COLOPHON = "Scott Barclay · 2026";
const RESUME = (
  <>
    <span className={styles.numeral}>IV</span>&nbsp;Resume
  </>
);

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.colophon}>{COLOPHON}</span>
      {/* From 960px up: where the running margin's icons end the page. */}
      <span className={styles.slot} />
      <a href={`mailto:${EMAIL}`} className={styles.email}>
        {EMAIL}
      </a>
      <SocialIcons className={styles.social} />
      <a href={RESUME_HREF} className={styles.resume}>
        {RESUME}
      </a>
    </footer>
  );
}

/**
 * The footer's line again, with nothing in it seen, for the running margin
 * to pin to the viewport's bottom: exactly where the footer is when the page
 * can scroll no further. Its children go in the lead, the box that runs from
 * the line's left edge to the slot's, so a child can be placed on the slot
 * (left: 100%) without the slot being measured.
 */
export function FooterGhost({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${styles.footer} ${styles.ghost}`}>
      <div className={styles.lead}>
        <span className={styles.unseen} aria-hidden="true">
          {COLOPHON}
        </span>
        {children}
      </div>
      <span className={styles.slot} />
      <div className={`${styles.rest} ${styles.unseen}`} aria-hidden="true">
        <span>{EMAIL}</span>
        <span>{RESUME}</span>
      </div>
    </div>
  );
}
