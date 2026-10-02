import Link from "next/link";
import ChapterNav from "./ChapterNav";
import NavTable from "./NavTable";
import type { ChapterId } from "./chapters";
import styles from "./frame.module.css";

type Props = {
  /**
   * Off the home page: the chapter this page belongs to. The nav shows it as
   * current and its links lead back to the home page anchors.
   */
  chapter?: ChapterId;
};

/**
 * The still frame: a sticky region with the bar inside it. The region fades
 * to transparent below the bar and ignores the pointer; only the bar is
 * interactive.
 */
export default function Frame({ chapter }: Props) {
  const mark = (
    <>
      <span className={styles.tick} />
      <span className={styles.markRow}>
        <span className={styles.vertical} />
        <span className={styles.initials}>SB</span>
        <span className={styles.vertical} />
      </span>
      <span className={styles.tick} />
    </>
  );

  return (
    <header className={styles.frame}>
      <div className={styles.bar}>
        {chapter ? (
          <Link href="/" className={styles.mark} aria-label="SB, Scott Barclay, home">
            {mark}
          </Link>
        ) : (
          <a href="#i" className={styles.mark} aria-label="SB, Scott Barclay, home">
            {mark}
          </a>
        )}
        {chapter ? <NavTable current={chapter} away /> : <ChapterNav />}
      </div>
    </header>
  );
}
