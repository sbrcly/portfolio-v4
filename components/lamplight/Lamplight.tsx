"use client";

import { useEffect, useRef } from "react";
import styles from "./lamplight.module.css";

/**
 * A warm glow that follows the cursor — a desk lamp over the ledger.
 * Renders nothing on touch devices and under reduced motion (the element
 * is display:none via CSS, and the listener never attaches).
 */
export default function Lamplight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches)
      return;

    let x = 0;
    let y = 0;
    let raf = 0;

    // Coalesce pointer moves: at most one style write per frame.
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (raf === 0) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          el.style.setProperty("--lamp-x", `${x}px`);
          el.style.setProperty("--lamp-y", `${y}px`);
        });
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className={styles.lamp} aria-hidden="true" />;
}
