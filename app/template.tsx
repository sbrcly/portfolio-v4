import { ViewTransition } from "react";

/**
 * Remounts on every navigation, so the outgoing page exits and the incoming
 * page enters through the View Transitions API. Browsers without support
 * (and reduced-motion users) get today's hard cut — see globals.css.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="vt-page-enter" exit="vt-page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
