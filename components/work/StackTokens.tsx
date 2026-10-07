import styles from "./stack-tokens.module.css";

type Props = {
  items: string[];
  /** The stack is a guess to correct: the row says so first. */
  placeholder?: true;
  className?: string;
};

/**
 * A project's stack as tokens: each tool in the small mono, upper case, in
 * the text color, 16px apart, wrapping. The same under a hero's sentence,
 * in a cell, and in a page's spec.
 */
export default function StackTokens({ items, placeholder, className }: Props) {
  return (
    <ul
      className={className ? `${styles.tokens} ${className}` : styles.tokens}
      aria-label="Stack"
      // The role restores the list semantics list-style: none drops.
      role="list"
    >
      {placeholder && <li className={styles.placeholder}>Placeholder.</li>}
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
