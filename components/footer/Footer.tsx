import { EMAIL, RESUME_HREF } from "@/components/frame/chapters";
import SocialIcons from "@/components/social/SocialIcons";
import styles from "./footer.module.css";

/**
 * The page's last line. The icon links are here below 960px, where the
 * running margin has no room for them, and at every width on a page whose
 * margin holds none (icons): the project pages.
 */
export default function Footer({ icons = false }: { icons?: boolean }) {
  return (
    <footer className={styles.footer}>
      <span className={styles.colophon} data-cascade="">
        Scott Barclay · 2026
      </span>
      <a href={`mailto:${EMAIL}`} className={styles.email} data-cascade="">
        {EMAIL}
      </a>
      <SocialIcons
        className={icons ? `${styles.social} ${styles.row}` : styles.social}
      />
      <a href={RESUME_HREF} className={styles.resume} data-cascade="">
        <span className={styles.numeral}>IV</span>&nbsp;Resume
      </a>
    </footer>
  );
}
