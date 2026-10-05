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
  /**
   * Where that chapter's cell leads, if not to the chapter's top: a project
   * page's employer ("/#employer-02").
   */
  back?: string;
};

/**
 * The still frame: a sticky region with the bar inside it. The region fades
 * to transparent below the bar and ignores the pointer; only the bar is
 * interactive. Below 960px the bar's left is where the chapter's numeral and
 * label are (components/margin), over the frame.
 */
export default function Frame({ chapter, back }: Props) {
  return (
    <header className={styles.frame}>
      <div className={styles.bar}>
        {chapter ? (
          <NavTable current={chapter} away back={back} />
        ) : (
          <ChapterNav />
        )}
      </div>
    </header>
  );
}
