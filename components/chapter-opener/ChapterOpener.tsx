import styles from "./chapter-opener.module.css";

type Props = {
  /** Decorative numeral. The label is the heading. */
  numeral: string;
  label: string;
  /** id for the h2; the enclosing section points aria-labelledby at it. */
  headingId: string;
  statement: string;
  children?: React.ReactNode;
};

export default function ChapterOpener({
  numeral,
  label,
  headingId,
  statement,
  children,
}: Props) {
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
      <div className={styles.measure}>
        <p className={styles.statement}>{statement}</p>
        {children}
      </div>
    </div>
  );
}
