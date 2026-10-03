/**
 * The scroll-driven pieces (the content fade, the running margin's numeral)
 * are CSS view timelines. Where those are missing, a script writes the same
 * values into CSS variables, once per frame at most.
 */
export const hasViewTimelines = () =>
  CSS.supports("animation-timeline: view()");

/**
 * Calls update now, then at most once a frame after a scroll, a resize, or a
 * change in the page's height. Returns the function that stops it.
 */
export function onScrollFrame(update: () => void) {
  let frame = 0;
  const request = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      update();
    });
  };

  const resized = new ResizeObserver(request);
  resized.observe(document.body);
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  update();

  return () => {
    cancelAnimationFrame(frame);
    resized.disconnect();
    window.removeEventListener("scroll", request);
    window.removeEventListener("resize", request);
  };
}
