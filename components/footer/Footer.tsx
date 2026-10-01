import { EMAIL, RESUME_HREF } from "@/components/frame/chapters";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.colophon}>Scott Barclay · 2026</span>
      <a href={`mailto:${EMAIL}`} className={styles.email}>
        {EMAIL}
      </a>
      <a href={RESUME_HREF} className={styles.resume}>
        <span className={styles.numeral}>V</span>&nbsp;Resume
      </a>
    </footer>
  );
}
