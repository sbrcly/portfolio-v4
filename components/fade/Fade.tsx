"use client";

import { useEffect } from "react";
import { hasViewTimelines, onScrollFrame } from "@/components/scroll/frames";

// The fade's profile, in viewport heights: the same as the animation ranges
// in globals.css.
const ON = 0.6; // full once the top edge is this far down the viewport
const OFF = 0.15; // full until the bottom edge is this far down
const RAMP = 0.25; // the rise before ON and the fall after OFF
const FLOOR = 0.15;
// A block with parts taller than this is lit, and its parts fade instead.
const TALL = 0.8;

/**
 * Two things for the content fade (globals.css). Always: which blocks with
 * parts are tall, as data-fade-tall, measured again when a block or the
 * viewport changes size. Where CSS view timelines are missing: the fade
 * itself, the same profile as the animation ranges, written to --fade on
 * each block or part that fades. The CSS applies it from 960px up, and not
 * under reduced motion.
 */
export default function Fade() {
  useEffect(() => {
    const blocks = [...document.querySelectorAll<HTMLElement>("[data-fade]")];
    const withParts = blocks.filter((block) => block.dataset.fade === "parts");
    const parts = [
      ...document.querySelectorAll<HTMLElement>(
        '[data-fade="parts"] [data-fade-part]'
      ),
    ];

    const measure = () => {
      const limit = TALL * window.innerHeight;
      for (const block of withParts) {
        block.toggleAttribute("data-fade-tall", block.offsetHeight > limit);
      }
    };
    const resized = new ResizeObserver(measure);
    withParts.forEach((block) => resized.observe(block));
    window.addEventListener("resize", measure);
    measure();

    const fading = [...blocks, ...parts];
    let stop: (() => void) | undefined;
    if (!hasViewTimelines()) {
      const active = window.matchMedia(
        "(min-width: 960px) and (prefers-reduced-motion: no-preference)"
      );
      stop = onScrollFrame(() => {
        if (!active.matches) return;
        const height = window.innerHeight;
        for (const element of fading) {
          // A tall block is lit; a part fades only in a tall block.
          const lit = element.hasAttribute("data-fade")
            ? element.hasAttribute("data-fade-tall")
            : !element.closest("[data-fade-tall]");
          if (lit) {
            element.style.removeProperty("--fade");
            continue;
          }
          const rect = element.getBoundingClientRect();
          const rise = (height * (ON + RAMP) - rect.top) / (height * RAMP);
          const fall = (rect.bottom - height * (OFF - RAMP)) / (height * RAMP);
          const on = Math.min(1, Math.max(0, Math.min(rise, fall)));
          const fade = String(+(FLOOR + on * (1 - FLOOR)).toFixed(4));
          if (element.style.getPropertyValue("--fade") !== fade) {
            element.style.setProperty("--fade", fade);
          }
        }
      });
    }

    return () => {
      stop?.();
      resized.disconnect();
      window.removeEventListener("resize", measure);
      withParts.forEach((block) => block.removeAttribute("data-fade-tall"));
      fading.forEach((element) => element.style.removeProperty("--fade"));
    };
  }, []);

  return null;
}
