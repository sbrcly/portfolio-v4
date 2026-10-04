"use client";

import { useEffect } from "react";

/**
 * Marks the page loaded, which turns smooth scrolling on from 960px up
 * (globals.css): until then a chapter in the URL is landed on, not scrolled
 * to. Set in an effect, so <html> hydrates with the attributes it was served.
 */
export default function Loaded() {
  useEffect(() => {
    const mark = () =>
      requestAnimationFrame(() => {
        document.documentElement.dataset.loaded = "";
      });

    if (document.readyState === "complete") {
      mark();
      return;
    }
    window.addEventListener("load", mark, { once: true });
    return () => window.removeEventListener("load", mark);
  }, []);

  return null;
}
