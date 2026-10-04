"use client";

import { useEffect } from "react";
import { hasViewTimelines, onScrollFrame } from "@/components/scroll/frames";

const FADE = 24; // --row-fade in work.module.css

/**
 * The employers' pinned rows where CSS view timelines are missing: the same
 * profile as the keyframes in work.module.css, written to --pinned on each
 * row marked data-running-head. A row is hidden until its title, the element
 * before it, is under the frame, and comes in over the next 24px of scroll.
 */
export default function RunningHeads() {
  useEffect(() => {
    if (hasViewTimelines()) return;

    const rows = [
      ...document.querySelectorAll<HTMLElement>("[data-running-head]"),
    ];

    const stop = onScrollFrame(() => {
      const frame = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--frame-height"
        )
      );
      for (const row of rows) {
        const title = row.previousElementSibling;
        if (!title) continue;
        const under = frame - title.getBoundingClientRect().bottom;
        const pinned = String(+Math.min(1, Math.max(0, under / FADE)).toFixed(4));
        if (row.style.getPropertyValue("--pinned") !== pinned) {
          row.style.setProperty("--pinned", pinned);
          row.style.visibility = pinned === "0" ? "" : "visible";
        }
      }
    });

    return () => {
      stop();
      rows.forEach((row) => {
        row.style.removeProperty("--pinned");
        row.style.visibility = "";
      });
    };
  }, []);

  return null;
}
