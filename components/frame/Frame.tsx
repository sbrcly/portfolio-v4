import ChapterNav from "./ChapterNav";
import styles from "./frame.module.css";

/**
 * The still frame: a sticky region with the bar inside it. The region fades
 * to transparent below the bar and ignores the pointer; only the bar is
 * interactive.
 */
export default function Frame() {
  return (
    <header className={styles.frame}>
      <div className={styles.bar}>
        <a href="#i" className={styles.mark} aria-label="Scott Barclay, home">
          <span className={styles.tick} />
          <span className={styles.markRow}>
            <span className={styles.vertical} />
            <span className={styles.initials}>SB</span>
            <span className={styles.vertical} />
          </span>
          <span className={styles.tick} />
        </a>
        <ChapterNav />
      </div>
    </header>
  );
}
