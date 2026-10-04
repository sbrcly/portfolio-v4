"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import styles from "./entrance.module.css";

/**
 * "Ember". A veil over content that is already rendered. The timeline is CSS
 * (entrance.module.css) and starts at first paint; the script in the root
 * layout decides before paint whether it plays (data-entrance on <html>).
 * This component only handles skipping and removing the veil. The hero's
 * hairline takes the light at the handoff and cools after the veil is gone
 * (hero.module.css), which is why "done" is a state of its own.
 */

// Where the veil starts to clear. Skipping jumps here.
const HANDOFF_MS = 1008;
const HANDOFF_REDUCED_MS = 900;

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const isPlaying = () => document.documentElement.dataset.entrance === "play";
// The veil is in the server markup, hidden by CSS unless the entrance plays.
const isPlayingOnServer = () => true;

function finish() {
  // Only an entrance that played is "done"; a load without one stays "skip".
  if (isPlaying()) document.documentElement.dataset.entrance = "done";
  listeners.forEach((listener) => listener());
}

export default function Entrance() {
  const playing = useSyncExternalStore(subscribe, isPlaying, isPlayingOnServer);
  const veil = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = veil.current;
    if (!playing || !el) return;

    const fade = el.getAnimations()[0];
    if (!fade || fade.playState === "finished") {
      finish();
      return;
    }

    const skip = () => {
      const handoff = window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches
        ? HANDOFF_REDUCED_MS
        : HANDOFF_MS;
      const heroRule = document.querySelector("[data-handoff]");
      const animations = [
        ...el.getAnimations({ subtree: true }),
        ...(heroRule?.getAnimations() ?? []),
      ];
      for (const animation of animations) {
        if (Number(animation.currentTime) < handoff) {
          animation.currentTime = handoff;
        }
      }
    };

    fade.addEventListener("finish", finish);
    window.addEventListener("keydown", skip);
    el.addEventListener("click", skip);

    return () => {
      fade.removeEventListener("finish", finish);
      window.removeEventListener("keydown", skip);
      el.removeEventListener("click", skip);
    };
  }, [playing]);

  // Leaving the page ends the entrance for good, so a hero that mounts again
  // in this document (Prava, then home) has a plain hairline.
  useEffect(
    () => () => {
      if (document.documentElement.dataset.entrance === "done") {
        document.documentElement.dataset.entrance = "skip";
      }
    },
    []
  );

  if (!playing) return null;

  return (
    <div ref={veil} className={styles.veil} aria-hidden="true">
      <div className={styles.stack}>
        <div className={styles.mark}>
          <span className={styles.tick} />
          <span className={styles.markRow}>
            <span className={styles.vertical} />
            <span className={styles.initials}>SB</span>
            <span className={styles.vertical} />
          </span>
          <span className={styles.tick} />
        </div>
        <div className={styles.rule} />
      </div>
    </div>
  );
}
