"use client";

import { useEffect } from "react";
import { hasViewTimelines, onScrollFrame } from "@/components/scroll/frames";

const BAND = 0.25; // full opacity within this of the midline, in viewport heights
const EDGE = 0.5; // the block's center on the viewport's edge
const FLOOR = 0.15;

/**
 * The content fade where CSS view timelines are missing: the same profile as
 * the keyframes in globals.css, written to --fade on each data-fade block.
 * The CSS applies it from 960px up, and not under reduced motion.
 */
export default function Fade() {
  useEffect(() => {
    if (hasViewTimelines()) return;

    const blocks = [...document.querySelectorAll<HTMLElement>("[data-fade]")];
    const active = window.matchMedia(
      "(min-width: 960px) and (prefers-reduced-motion: no-preference)"
    );

    const stop = onScrollFrame(() => {
      if (!active.matches) return;
      const height = window.innerHeight;
      for (const block of blocks) {
        const rect = block.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - height / 2) / height;
        const fall = Math.min(1, Math.max(0, (distance - BAND) / (EDGE - BAND)));
        const fade = String(+(1 - fall * (1 - FLOOR)).toFixed(4));
        if (block.style.getPropertyValue("--fade") !== fade) {
          block.style.setProperty("--fade", fade);
        }
      }
    });

    return () => {
      stop();
      blocks.forEach((block) => block.style.removeProperty("--fade"));
    };
  }, []);

  return null;
}
