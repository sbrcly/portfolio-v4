"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import styles from "./entrance.module.css";

/**
 * "Ember". A veil over content that is already rendered. The timeline is CSS
 * (entrance.module.css) and starts at first paint; the script in the root
 * layout decides before paint whether it plays (data-entrance on <html>).
 * This component only handles skipping and removing the veil. Nothing on the
 * page takes the light from it: the rule cools and the veil lifts.
 */

// Where the veil starts to clear. Skipping jumps here.
const CLEAR_MS = 1008;
const CLEAR_REDUCED_MS = 900;

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
  document.documentElement.dataset.entrance = "done";
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
      const clear = window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches
        ? CLEAR_REDUCED_MS
        : CLEAR_MS;
      for (const animation of el.getAnimations({ subtree: true })) {
        if (Number(animation.currentTime) < clear) {
          animation.currentTime = clear;
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
