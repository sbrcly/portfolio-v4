import Link from "next/link";
import styles from "./text-link.module.css";

type Props = {
  /** An anchor on this page ("#work-02"), a route ("/work/prava"), or a URL. */
  href: string;
  children: React.ReactNode;
};

/**
 * A link inside running text. The paragraph around it is expected to be
 * muted (Spectral 300, --muted); the link is 400 in the full text color.
 */
export default function TextLink({ href, children }: Props) {
  return href.startsWith("/") ? (
    <Link href={href} className={styles.link}>
      {children}
    </Link>
  ) : (
    <a href={href} className={styles.link}>
      {children}
    </a>
  );
}
