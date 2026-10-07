"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import LightboxDialog, { useLightbox } from "@/components/lightbox/LightboxDialog";
import posterSmall from "@/public/images/odds-console-poster-1200.webp";
import posterFull from "@/public/images/odds-console-poster.webp";
import plate from "./plate.module.css";
import styles from "./video-plate.module.css";

const SRC = "/videos/odds-display-demo.mp4";
const AUTOPLAY_RATIO = 0.6;
const BAR_IDLE_MS = 2000;

type State = "resting" | "playing" | "paused" | "ended";

// The poster is chosen once, in the browser, before the video element
// exists, so a phone never requests the full-size frame. The server render
// has no video and so no poster to fetch.
const noSubscription = () => () => {};
const choosePoster = () =>
  window.matchMedia("(max-width: 719px)").matches
    ? posterSmall.src
    : posterFull.src;
const noPoster = () => null;

function clock(seconds: number) {
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

/** Moves a node, keeping its state (a playing video keeps playing) where
    the browser can, and by taking it out and putting it in where not. */
function move(node: Element, parent: Element, before: Node | null) {
  const mover = parent as Element & {
    moveBefore?: (node: Node, child: Node | null) => void;
  };
  try {
    if (mover.moveBefore) {
      mover.moveBefore(node, before);
      return;
    }
  } catch {
    // Not movable that way: fall through.
  }
  parent.insertBefore(node, before);
}

/**
 * The live odds console's plate: the odds console recording. The plate is
 * the button. Three visual states: resting (poster, ring, meta), playing
 * (ring and meta gone, bar on hover or focus), ended (last frame held,
 * ring back, meta reads Replay). A Full size control, bottom right, opens
 * the recording in a lightbox: the video element itself moves into the
 * dialog, at its time and in its state, with the browser's controls, and
 * moves back when the dialog closes.
 */
export default function VideoPlate({ describedBy }: { describedBy?: string }) {
  const button = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const ring = useRef<HTMLSpanElement>(null);
  const fullSize = useRef<HTMLButtonElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const barTimer = useRef<number | undefined>(undefined);
  // Autoplay bookkeeping: one automatic start, and resume only after a pause
  // caused by leaving the viewport.
  const autoplayed = useRef(false);
  const pausedByExit = useRef(false);

  const [state, setState] = useState<State>("resting");
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(33);
  const [barShown, setBarShown] = useState(false);
  const [full, setFull] = useState(false);
  const poster = useSyncExternalStore(noSubscription, choosePoster, noPoster);
  const lightbox = useLightbox();

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
    };
  }, [poster]);

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

  const onPause = () => {
    // The pause that precedes "ended" is handled there.
    if (video.current?.ended) return;
    setState("paused");
  };

  // Into the dialog, as it is: time, playing or not, ended or not. The
  // dialog's own controls take over, and the plate's state follows the
  // video's events wherever it is.
  const openFull = () => {
    const media = video.current;
    if (!media || !slot.current) return;
    // Any manual action ends automatic control.
    autoplayed.current = true;
    pausedByExit.current = false;
    move(media, slot.current, null);
    setFull(true);
    if (!lightbox.open(fullSize.current)) {
      // Already open: leave it where it is.
      return;
    }
  };

  // Back to the plate, first among its parts, at the same time and in the
  // same state; the plate's ring, meta, and bar read that state.
  const onCloseFull = () => {
    const media = video.current;
    if (media && button.current) {
      move(media, button.current, ring.current);
    }
    setFull(false);
    lightbox.onClose();
  };

  const playing = state === "playing";
  const progress = duration > 0 ? Math.min(time / duration, 1) : 0;

  return (
    <div className={`${plate.plate} ${styles.frame}`}>
      <button
        ref={button}
        type="button"
        className={styles.video}
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
        {poster && (
          <video
            ref={video}
            className={styles.media}
            data-full={full ? "" : undefined}
            src={SRC}
            poster={poster}
            width={posterFull.width}
            height={posterFull.height}
            muted
            playsInline
            controls={full}
            preload="metadata"
            onPlay={() => setState("playing")}
            onPause={onPause}
            onEnded={() => setState("ended")}
            onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
            onLoadedMetadata={(event) =>
              setDuration(event.currentTarget.duration)
            }
          />
        )}

        <span ref={ring} className={styles.ring} aria-hidden="true">
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

      {poster && (
        <button
          ref={fullSize}
          type="button"
          className={styles.fullSize}
          aria-label="View the odds console recording full size"
          aria-haspopup="dialog"
          onClick={openFull}
        >
          Full size
        </button>
      )}

      <LightboxDialog
        dialog={lightbox.dialog}
        label="The odds console recording"
        onClose={onCloseFull}
      >
        <div ref={slot} className={styles.slot} />
      </LightboxDialog>
    </div>
  );
}
