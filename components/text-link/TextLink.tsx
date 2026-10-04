import Link from "next/link";
import styles from "./text-link.module.css";

type Props = {
  /** An anchor on this page ("#work-prava"), a route ("/work/prava"), or a URL. */
  href: string;
  children: React.ReactNode;
};

/**
 * A link inside running text. The paragraph around it is expected to be
 * muted; the link is in the full text color, at 600 in sans text and 400
 * in serif.
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
