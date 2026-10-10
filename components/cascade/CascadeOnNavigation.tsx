"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { PENDING, plan } from "./scripts";

/**
 * The load cascade on a client-side navigation (scripts.ts has the load
 * itself). When the pathname changes, the new page is in the document and
 * Next has put the scroll where it lands (the top, or a chapter in the
 * URL), but nothing has been painted: a layout effect runs before the
 * paint. So, as the head's script would, it marks the page pending, which
 * hides every part, and runs the plan's text as a script element, which
 * measures what is in the viewport, starts its animations, and clears the
 * mark, all before that first paint. Nothing else plays it: not the
 * mount, where the inline scripts have already run; not a hash change on
 * the same page, where the pathname is the same; and not going back or
 * forward (popstate), where the browser restores a position, as the head's
 * script holds for a back-forward load. Reduced motion is checked as the
 * head's script checks it.
 */
export default function CascadeOnNavigation() {
  const pathname = usePathname();
  // The pathname on screen; null until the mount.
  const shown = useRef<string | null>(null);
  // Set by a popstate that changes the pathname, read by the change.
  const traversal = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      if (location.pathname !== shown.current) traversal.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useLayoutEffect(() => {
    const arrived = shown.current !== null && shown.current !== pathname;
    shown.current = pathname;
    const traversed = traversal.current;
    traversal.current = false;
    if (!arrived || traversed) return;

    const root = document.documentElement;
    if (
      !root.animate ||
      !matchMedia("(prefers-reduced-motion: no-preference)").matches
    ) {
      return;
    }
    root.setAttribute(PENDING, "");
    const script = document.createElement("script");
    script.text = plan;
    document.body.append(script);
    script.remove();
    // The plan clears the mark itself; this is for a plan that could not run.
    root.removeAttribute(PENDING);
  }, [pathname]);

  return null;
}
