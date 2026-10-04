import Link from "next/link";
import { CHAPTERS, RESUME_HREF } from "./chapters";
import styles from "./frame.module.css";

type Props = {
  current: string;
  /** Off the home page, chapter links lead back to its anchors. */
  away?: boolean;
};

/** The nav table: one cell per chapter, then the resume. */
export default function NavTable({ current, away = false }: Props) {
  return (
    <nav className={styles.nav} aria-label="Chapters">
      {CHAPTERS.map(({ id, numeral, label }) => {
        const props = {
          className: styles.cell,
          "aria-current": current === id ? ("page" as const) : undefined,
        };
        // The link's name is its text, "II About". On phone the label is
        // hidden visually but stays in the name.
        const content = (
          <>
            <span className={styles.numeral}>{numeral}</span>{" "}
            <span className={styles.label}>{label}</span>
          </>
        );
        return away ? (
          <Link key={id} href={`/#${id}`} {...props}>
            {content}
          </Link>
        ) : (
          <a key={id} href={`#${id}`} {...props}>
            {content}
          </a>
        );
      })}
      <a href={RESUME_HREF} className={styles.cell}>
        <span className={styles.numeral}>V</span>{" "}
        <span className={styles.label}>Resume</span>
      </a>
    </nav>
  );
}
