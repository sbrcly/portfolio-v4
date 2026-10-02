import styles from "./work-entry.module.css";

type Props = {
  /** Decorative index, "01" to "05". */
  index: string;
  /** id for the h3; the article points aria-labelledby at it. */
  headingId: string;
  title: React.ReactNode;
  meta: string;
  /** The plate. */
  media: React.ReactNode;
  sentence: string;
  /** Mono spec run: stack, then links. */
  spec: React.ReactNode;
};

export default function WorkEntry({
  index,
  headingId,
  title,
  meta,
  media,
  sentence,
  spec,
}: Props) {
  return (
    <article
      className={styles.entry}
      aria-labelledby={headingId}
      data-reveal=""
    >
      <div className={styles.titleRow}>
        <h3 id={headingId} className={styles.title}>
          <span className={styles.index} aria-hidden="true">
            {index}
          </span>
          {title}
        </h3>
        <span className={styles.meta}>{meta}</span>
      </div>
      <div className={styles.media}>{media}</div>
      <div className={styles.caption}>
        <p id={`${headingId}-summary`} className={styles.sentence}>
          {sentence}
        </p>
        <div className={styles.spec}>{spec}</div>
      </div>
    </article>
  );
}
