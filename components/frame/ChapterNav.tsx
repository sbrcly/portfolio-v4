"use client";

import { useCurrentChapter } from "@/components/chapters/current-chapter";
import { CHAPTERS, RESUME_HREF } from "./chapters";
import styles from "./frame.module.css";

export default function ChapterNav() {
  const current = useCurrentChapter();

  return (
    <nav className={styles.nav} aria-label="Chapters">
      {CHAPTERS.map(({ id, numeral, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className={styles.cell}
          aria-label={`${numeral} ${label}`}
          aria-current={current === id ? "page" : undefined}
        >
          <span className={styles.numeral}>{numeral}</span>
          <span className={styles.label}>{label}</span>
        </a>
      ))}
      <a href={RESUME_HREF} className={styles.cell} aria-label="V Resume">
        <span className={styles.numeral}>V</span>
        <span className={styles.label}>Resume</span>
      </a>
    </nav>
  );
}
