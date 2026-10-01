"use client";

import { useEffect, useState } from "react";
import { CHAPTERS, RESUME_HREF, type ChapterId } from "./chapters";
import styles from "./frame.module.css";

export default function ChapterNav() {
  const [current, setCurrent] = useState<ChapterId>("i");

  useEffect(() => {
    // One observer for all chapters. The root is narrowed to the middle 20%
    // of the viewport. When two chapters share that band, the later one is
    // current, so the handover happens at the same line in both directions.
    const inBand = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        }
        const last = CHAPTERS.findLast(({ id }) => inBand.has(id));
        if (last) setCurrent(last.id);
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    for (const { id } of CHAPTERS) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

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
