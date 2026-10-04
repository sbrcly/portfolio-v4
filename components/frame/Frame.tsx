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
  return (
    <header className={styles.frame}>
      <div className={styles.bar}>
        {chapter ? <NavTable current={chapter} away /> : <ChapterNav />}
      </div>
    </header>
  );
}
