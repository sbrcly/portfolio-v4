import styles from "./chapter-opener.module.css";

type Props = {
  /** The chapter's heading. Its numeral is the running margin's. */
  label: string;
  /** id for the h2; the enclosing section points aria-labelledby at it. */
  headingId: string;
  /**
   * The measure's opening line. Without one it opens with its children;
   * with neither there is no measure and the opener is its heading alone.
   */
  statement?: string;
  /** The statement is the page's h1, and a name. */
  titled?: boolean;
  /**
   * The statement is what the running margin reads the chapter by, on a
   * page read that way: it carries the chapter's timeline (data-chapter-edge,
   * globals.css).
   */
  edge?: boolean;
  children?: React.ReactNode;
};

export default function ChapterOpener({
  label,
  headingId,
  statement,
  titled = false,
  edge = false,
  children,
}: Props) {
  const Statement = titled ? "h1" : "p";
  return (
    <div className={styles.opener} data-reveal="">
      {/* The grid's first cell: the running margin's column. */}
      <div>
        <h2 id={headingId} className={styles.label}>
          {label}
        </h2>
      </div>
      {(statement || children) && (
        <div className={styles.measure} data-fade="parts">
          {statement && (
            <Statement
              className={
                titled ? `${styles.statement} ${styles.name}` : styles.statement
              }
              data-cascade=""
              data-fade-part=""
              data-chapter-edge={edge ? "" : undefined}
            >
              {statement}
            </Statement>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
