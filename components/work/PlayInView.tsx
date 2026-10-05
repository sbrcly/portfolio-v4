"use client";

import { useEffect, useRef } from "react";

const STATE = "data-loop";

/**
 * Says when what it holds may play: data-loop is "playing" while at least
 * half of it is in view under the frame, and "ready" otherwise. What
 * "ready" and "playing" look like is the stylesheet's (venue-loop.module.css
 * holds its animations at their first frame, then runs them). Leaving view
 * rewinds, so each entry starts from the first frame. Without script there
 * is no data-loop, and nothing plays.
 */
export default function PlayInView({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Without the attribute for one style pass, the animations end; with it
    // again they are new, at their start.
    const rewind = () => {
      element.removeAttribute(STATE);
      void element.offsetWidth;
      element.setAttribute(STATE, "ready");
    };
    rewind();

    const frame = getComputedStyle(document.documentElement)
      .getPropertyValue("--frame-height")
      .trim();
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (entry.intersectionRatio >= 0.5) {
          element.setAttribute(STATE, "playing");
        } else if (element.getAttribute(STATE) === "playing") {
          rewind();
        }
      },
      { rootMargin: `-${frame || "0px"} 0px 0px 0px`, threshold: 0.5 }
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      element.removeAttribute(STATE);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
