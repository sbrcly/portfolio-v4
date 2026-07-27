import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  description:
    "Software engineer and founder. Most recently: Prava, an AI faith journal for iOS. Designed, built, and shipped solo, from first commit to the App Store.",
  openGraph: {
    title: "Scott Barclay · Software engineer & founder",
    description:
      "I ship products end-to-end. Most recently: Prava, an AI faith journal for iOS.",
  },
};

const RECORD = [
  {
    href: "/work/prava",
    date: "2026",
    name: "Prava",
    status: "Live on App Store",
  },
  {
    href: "/work/incognito-wraps",
    date: "2026",
    name: "Incognito Wraps",
    status: "In staging",
  },
  {
    href: "/experience",
    date: "2019–25",
    name: "Caesars Sportsbook & Etainement",
    status: "Internal tools",
  },
];

export default function HomePage() {
  return (
    <section className={`container ${styles.hero}`}>
      <p className={`eyebrow ${styles.mask}`}>
        <span className={styles.lineEyebrow}>
          Software engineer &amp; founder
        </span>
      </p>
      <h1 className={`${styles.headline} ${styles.mask}`}>
        <span className={styles.lineHeadline}>I ship products end-to-end.</span>
      </h1>
      <p className={`${styles.support} ${styles.mask}`}>
        <span className={styles.lineSupport}>
          Most recently: <strong>Prava</strong>, an AI faith journal for iOS.
          Designed, built, and shipped solo, from first commit to the App
          Store.
        </span>
      </p>

      <h2 className={styles.ledgerLabel}>Shipping record</h2>
      <ul className={styles.ledger}>
        {RECORD.map(({ href, date, name, status }) => (
          <li key={href} className={styles.entry}>
            <Link href={href} className={styles.row}>
              <span className={styles.date}>{date}</span>
              <span className={styles.name}>{name}</span>
              <span className={styles.status}>{status}</span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <Link href="/work/prava" className="button buttonPrimary">
          Read the Prava case study
        </Link>
        <Link href="/connect" className={styles.contactLink}>
          Get in touch <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
