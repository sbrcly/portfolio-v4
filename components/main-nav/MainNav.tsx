"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./main-nav.module.css";

const LINKS = [
  { href: "/work/prava", label: "Prava" },
  { href: "/work/incognito-wraps", label: "Incognito Wraps" },
  { href: "/experience", label: "Experience" },
  { href: "/about", label: "About" },
  { href: "/connect", label: "Connect" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export default function MainNav() {
  const pathname = usePathname();

  return (
    <header className={styles.header} style={{ viewTransitionName: "site-header" }}>
      <nav className={styles.nav} aria-label="Main">
        <Link href="/" className={styles.brand} aria-current={pathname === "/" ? "page" : undefined}>
          Scott Barclay
        </Link>
        <ul className={styles.links}>
          {LINKS.map(({ href, label }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={active ? `${styles.link} ${styles.active}` : styles.link}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
