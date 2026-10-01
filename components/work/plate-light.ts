import {
  getCurrentChapter,
  subscribeChapter,
} from "@/components/chapters/current-chapter";
import {
  requestLightUpdate,
  setLightResolver,
} from "@/components/light/handover";

/**
 * Chooses chapter III's lit plate: the one whose center is nearest the
 * viewport center. Distances are fractions of the viewport height.
 */
const QUIET_MS = 120; // no handover while scroll events are this recent
const HYSTERESIS = 0.1; // a new plate must be this much nearer than the lit one
const REACH = 0.35; // beyond this from center, the lit plate keeps the light

let forced: HTMLElement | null = null;
let rested: HTMLElement | null = null;

/**
 * Forces a plate lit regardless of position (a playing video), or releases
 * it with null so the nearest-center rule resumes.
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

export function startPlateLight() {
  const plates = [
    ...document.querySelectorAll<HTMLElement>('[data-light="iii"]'),
  ];
  let current: HTMLElement | null = null;
  let lastScroll = -Infinity;
  let quietTimer: number | undefined;

  const distance = (plate: HTMLElement) => {
    const rect = plate.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    return Math.abs(center - window.innerHeight / 2) / window.innerHeight;
  };

  const resolve = () => {
    if (forced) return (current = forced);
    if (rested && current === rested) current = null;
    // Mid-scroll the light stays put; the scroll-end check settles it.
    if (current && performance.now() - lastScroll < QUIET_MS) return current;

    let nearest: HTMLElement | null = null;
    let nearestDistance = Infinity;
    for (const plate of plates) {
      const d = distance(plate);
      if (d < nearestDistance) {
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
    if (getCurrentChapter() !== "iii") current = rested = null;
  });
  const unregister = setLightResolver("iii", resolve);

  return () => {
    unregister();
    unsubscribe();
    observer.disconnect();
    window.removeEventListener("scroll", onScroll);
    window.clearTimeout(quietTimer);
  };
}
