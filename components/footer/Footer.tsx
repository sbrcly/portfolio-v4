import { EMAIL, RESUME_HREF } from "@/components/frame/chapters";
import SocialIcons from "@/components/social/SocialIcons";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.colophon} data-cascade="">
        Scott Barclay · 2026
      </span>
      <a href={`mailto:${EMAIL}`} className={styles.email} data-cascade="">
        {EMAIL}
      </a>
      <SocialIcons className={styles.social} />
      <a href={RESUME_HREF} className={styles.resume} data-cascade="">
        <span className={styles.numeral}>IV</span>&nbsp;Resume
      </a>
    </footer>
  );
}
