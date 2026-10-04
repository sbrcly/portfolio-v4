"use client";

import { useEffect } from "react";
import { hasViewTimelines, onScrollFrame } from "@/components/scroll/frames";
import { pinned } from "./running-head";

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
        const value = String(+pinned(row, frame).toFixed(4));
        if (row.style.getPropertyValue("--pinned") !== value) {
          row.style.setProperty("--pinned", value);
          row.style.visibility = value === "0" ? "" : "visible";
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
