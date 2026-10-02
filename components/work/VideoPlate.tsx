"use client";

import { useEffect, useRef, useState } from "react";
import poster from "@/public/images/odds-console-poster.webp";
import { forcePlateLit, restPlate } from "./plate-light";
import plate from "./plate.module.css";
import styles from "./video-plate.module.css";

const SRC = "/videos/odds-display-demo.mp4";
const AUTOPLAY_RATIO = 0.6;
const BAR_IDLE_MS = 2000;

type State = "resting" | "playing" | "paused" | "ended";

function clock(seconds: number) {
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

/**
 * Entry 02's plate: the odds console recording. The whole plate is the
 * button. Three visual states: resting (poster, ring, meta), playing (ring
 * and meta gone, rim lit, bar on hover or focus), ended (last frame held,
 * ring back, meta reads Replay).
 */
export default function VideoPlate({ describedBy }: { describedBy?: string }) {
  const button = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const barTimer = useRef<number | undefined>(undefined);
  // Autoplay bookkeeping: one automatic start, and resume only after a pause
  // caused by leaving the viewport.
  const autoplayed = useRef(false);
  const pausedByExit = useRef(false);

  const [state, setState] = useState<State>("resting");
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(33);
  const [barShown, setBarShown] = useState(false);

  useEffect(() => {
    const el = button.current;
    const media = video.current;
    if (!el || !media) return;

    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData === true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Off screen, state changes land without their fades.
        el.toggleAttribute("data-away", !entry.isIntersecting);
        if (!entry.isIntersecting) {
          if (!media.paused) {
            pausedByExit.current = true;
            media.pause();
          }
          return;
        }
        if (entry.intersectionRatio < AUTOPLAY_RATIO) return;
        if (saveData || reduced.matches || media.ended) return;

        if (pausedByExit.current || !autoplayed.current) {
          autoplayed.current = true;
          pausedByExit.current = false;
          // Blocked autoplay leaves the plate resting.
          media.play().catch(() => {});
        }
      },
      { threshold: [0, AUTOPLAY_RATIO] }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.clearTimeout(barTimer.current);
      forcePlateLit(null);
    };
  }, []);

  const toggle = () => {
    const media = video.current;
    if (!media) return;

    // Any manual action ends automatic control.
    autoplayed.current = true;
    pausedByExit.current = false;

    if (media.paused) {
      if (media.ended) media.currentTime = 0;
      media.play().catch(() => {});
    } else {
      media.pause();
    }

    // Touch has no hover: show the bar on tap, hide it after two idle seconds.
    setBarShown(true);
    window.clearTimeout(barTimer.current);
    barTimer.current = window.setTimeout(
      () => setBarShown(false),
      BAR_IDLE_MS
    );
  };

  const onPlay = () => {
    setState("playing");
    forcePlateLit(button.current);
  };

  const onPause = () => {
    // The pause that precedes "ended" is handled there.
    if (video.current?.ended) return;
    setState("paused");
    forcePlateLit(null);
  };

  const onEnded = () => {
    setState("ended");
    forcePlateLit(null);
    if (button.current) restPlate(button.current);
  };

  const playing = state === "playing";
  const progress = duration > 0 ? Math.min(time / duration, 1) : 0;

  return (
    <button
      ref={button}
      type="button"
      className={`${plate.plate} ${styles.video}`}
      data-light="iii"
      data-state={state}
      data-bar={barShown ? "true" : undefined}
      aria-label={
        playing
          ? "Pause the odds console recording"
          : "Play the odds console recording, 33 seconds, silent"
      }
      aria-describedby={describedBy}
      onClick={toggle}
    >
      <video
        ref={video}
        className={styles.media}
        src={SRC}
        poster={poster.src}
        width={poster.width}
        height={poster.height}
        muted
        playsInline
        preload="metadata"
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) =>
          setDuration(event.currentTarget.duration)
        }
      />

      <span className={styles.ring} aria-hidden="true">
        <span className={styles.triangle} />
      </span>

      <span className={styles.meta} aria-hidden="true">
        {state === "ended" ? (
          <span className={styles.replay}>Replay</span>
        ) : (
          "odds-display-demo.mp4"
        )}{" "}
        <span className={styles.metaQuiet}>· 33 s · silent</span>
      </span>

      <span className={styles.bar} aria-hidden="true">
        <span className={styles.pauseGlyph} />
        <span className={styles.track}>
          <span
            className={styles.elapsed}
            style={{ width: `${progress * 100}%` }}
          />
        </span>
        <span className={styles.time}>
          {clock(time)} <span className={styles.slash}>/</span>{" "}
          {clock(duration)}
        </span>
      </span>
    </button>
  );
}
