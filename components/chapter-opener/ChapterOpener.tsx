import styles from "./chapter-opener.module.css";

type Props = {
  /** Decorative numeral. The label is the heading. */
  numeral: string;
  label: string;
  /** id for the h2; the enclosing section points aria-labelledby at it. */
  headingId: string;
  /**
   * The measure's opening line. Without one it opens with its children;
   * with neither there is no measure and the opener is its heading alone.
   */
  statement?: string;
  /** The statement is the page's h1. */
  titled?: boolean;
  children?: React.ReactNode;
};

export default function ChapterOpener({
  numeral,
  label,
  headingId,
  statement,
  titled = false,
  children,
}: Props) {
  const Statement = titled ? "h1" : "p";
  return (
    <div className={styles.opener} data-reveal="">
      <div className={styles.head}>
        <span className={styles.numeral} aria-hidden="true">
          {numeral}
        </span>
        <h2 id={headingId} className={styles.label}>
          {label}
        </h2>
      </div>
      {(statement || children) && (
        <div className={styles.measure} data-fade="">
          {statement && (
            <Statement className={styles.statement}>{statement}</Statement>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
