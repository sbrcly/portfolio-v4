import { useId } from "react";
import styles from "./rating.module.css";

const STAR =
  "M5.5 0.27L6.8 4.26L11 4.26L7.6 6.73L8.9 10.73L5.5 8.26L2.1 10.73L3.4 6.73L0 4.26L4.2 4.26Z";
const SIZE = 11;
const GAP = 2;
const PITCH = SIZE + GAP;

/**
 * Five 11px stars filled to the rating: each star is drawn in the rule
 * color, then again in the text color clipped to its share of the value,
 * so a 4.8 shows four full and four fifths of the fifth.
 */
function Stars({ rating }: { rating: number }) {
  const starId = useId();
  const clipId = useId();

  return (
    <svg
      className={styles.stars}
      width={PITCH * 5 - GAP}
      height={SIZE}
      viewBox={`0 0 ${PITCH * 5 - GAP} ${SIZE}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <path id={starId} d={STAR} />
        <clipPath id={clipId}>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={i * PITCH}
              y={0}
              width={SIZE * Math.min(Math.max(rating - i, 0), 1)}
              height={SIZE}
            />
          ))}
        </clipPath>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => (
        <use key={i} href={`#${starId}`} x={i * PITCH} className={styles.empty} />
      ))}
      <g clipPath={`url(#${clipId})`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <use key={i} href={`#${starId}`} x={i * PITCH} />
        ))}
      </g>
    </svg>
  );
}

/**
 * The App Store rating: stars, the value, then the count. Compact, it is
 * the stars and the value alone, and the count is only in its label.
 */
export default function Rating({
  rating,
  count,
  compact = false,
}: {
  rating: number;
  count: number;
  compact?: boolean;
}) {
  const value = rating.toFixed(1);

  return (
    <span
      role="img"
      aria-label={`Rated ${value} on the App Store from ${count} ratings`}
    >
      <span className={styles.value}>
        <Stars rating={rating} />
        {value}
      </span>
      {!compact && <> · {count} ratings on the App Store</>}
    </span>
  );
}
