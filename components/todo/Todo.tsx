import styles from "./todo.module.css";

/**
 * Visible placeholder for unfinished content. Nothing ships silently
 * half-done — every gap is marked on the page until it's filled.
 */
export default function Todo({ children }: { children: React.ReactNode }) {
  return (
    <p className={styles.todo}>
      <span className={styles.label}>todo</span>
      {children}
    </p>
  );
}
