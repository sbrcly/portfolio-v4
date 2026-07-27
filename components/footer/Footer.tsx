import Link from "next/link";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer} style={{ viewTransitionName: "site-footer" }}>
      <div className={styles.inner}>
        <p className={styles.name}>Scott Barclay, software engineer &amp; founder</p>
        <Link href="/connect" className={styles.link}>
          Get in touch <span aria-hidden="true">→</span>
        </Link>
      </div>
    </footer>
  );
}
