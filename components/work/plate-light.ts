import {
  getCurrentChapter,
  subscribeChapter,
} from "@/components/chapters/current-chapter";
import {
  requestLightUpdate,
  setLightResolver,
} from "@/components/light/handover";
import { onScrollFrame } from "@/components/scroll/frames";

/**
 * Chooses a chapter's lit plate: of the eligible plates, the one whose
 * center is nearest the viewport center. Distances are fractions of the
 * viewport height. From 960px up a plate is eligible while its center is
 * within BAND of the midline, the band in which content is at full opacity
 * (globals.css); a plate that leaves it goes dark at once, and with none in
 * it none is lit and the running margin's second line is empty. Below 960px
 * every plate on screen is eligible.
 */
const QUIET_MS = 120; // no handover while scroll events are this recent
const HYSTERESIS = 0.1; // a new plate must be this much nearer than the lit one
const REACH = 0.35; // beyond this from center, the lit plate keeps the light
const BAND = 0.25; // from 960px up, only plates this near the midline are lit
const TIE = 0.02; // distances closer than this count as equal (covers the 12px reveal rise)

let forced: HTMLElement | null = null;
let rested: HTMLElement | null = null;

/**
 * Forces a plate lit wherever it is among the eligible plates (a playing
 * video), or releases it with null so the nearest-center rule resumes.
 */
export function forcePlateLit(plate: HTMLElement | null) {
  forced = plate;
  if (plate) rested = null;
  requestLightUpdate();
}

/**
 * Sends a plate back to its resting rim even though it may be nearest the
 * center (a video that has ended). It stays dark until the light has moved
 * to another plate, the chapter is left, or it is forced lit again.
 */
export function restPlate(plate: HTMLElement) {
  rested = plate;
  requestLightUpdate();
}

export function startPlateLight(chapter: string) {
  forced = rested = null;
  const plates = [
    ...document.querySelectorAll<HTMLElement>(`[data-light="${chapter}"]`),
  ];
  let current: HTMLElement | null = null;
  let lastScroll = -Infinity;
  let quietTimer: number | undefined;
  const banded = window.matchMedia("(min-width: 960px)");

  const distance = (plate: HTMLElement) => {
    const rect = plate.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    return Math.abs(center - window.innerHeight / 2) / window.innerHeight;
  };

  const onScreen = (plate: HTMLElement) => {
    const rect = plate.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  };

  const eligible = (plate: HTMLElement) =>
    banded.matches ? distance(plate) <= BAND : onScreen(plate);

  const resolve = () => {
    // A playing video holds the light, but from 960px up only inside the band.
    if (forced && (!banded.matches || eligible(forced))) {
      return (current = forced);
    }
    if (rested && current === rested) current = null;
    // Leaving the band is not a handover: it happens mid-scroll too.
    if (banded.matches && current && !eligible(current)) current = null;
    // Mid-scroll the light stays put; the scroll-end check settles it.
    if (current && performance.now() - lastScroll < QUIET_MS) return current;
    // A lit plate that has left the screen (scrolled off, or jumped away
    // from) gives up the light.
    if (current && !eligible(current)) current = null;

    let nearest: HTMLElement | null = null;
    let nearestDistance = Infinity;
    for (const plate of plates) {
      if (!eligible(plate)) continue;
      const d = distance(plate);
      // Side-by-side plates tie; the first in document order wins.
      if (d < nearestDistance - TIE) {
        nearest = plate;
        nearestDistance = d;
      }
    }
    if (!nearest) return current;

    // Entering the chapter: light the nearest plate.
    if (!current) {
      if (nearest === rested) return null;
      rested = null;
      return (current = nearest);
    }

    if (
      nearest !== current &&
      nearestDistance <= REACH &&
      distance(current) - nearestDistance >= HYSTERESIS
    ) {
      current = nearest;
    }
    return current;
  };

  const onScroll = () => {
    lastScroll = performance.now();
    window.clearTimeout(quietTimer);
    quietTimer = window.setTimeout(requestLightUpdate, QUIET_MS + 10);
  };

  const observer = new IntersectionObserver(requestLightUpdate, {
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
  });
  plates.forEach((plate) => observer.observe(plate));
  window.addEventListener("scroll", onScroll, { passive: true });
  // Outside the chapter no plate is lit, so re-entry starts fresh.
  const unsubscribe = subscribeChapter(() => {
    if (getCurrentChapter() !== chapter) current = rested = null;
  });
  const unregister = setLightResolver(chapter, resolve);
  // The band's edge is a scroll position, not something an observer reports.
  const stopFrames = onScrollFrame(() => {
    if (banded.matches) requestLightUpdate();
  });

  return () => {
    unregister();
    unsubscribe();
    observer.disconnect();
    stopFrames();
    window.removeEventListener("scroll", onScroll);
    window.clearTimeout(quietTimer);
  };
}
