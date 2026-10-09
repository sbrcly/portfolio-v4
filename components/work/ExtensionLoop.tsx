import { DiagramDrawing } from "@/components/diagram/Diagram";
import Plate from "./Plate";
import PlayInView from "./PlayInView";
import styles from "./extension-loop.module.css";

/**
 * The buyer extension's plate: a synthetic venue on a buyer's Ticketmaster
 * screen, with the extension's overlay. From 960px up, with motion allowed,
 * it is a 14-second loop, played while at least half the plate is in view:
 * the rings on rule 01's seats, the section's fill, the note, then the stop
 * overlay, and everything out before it starts again (the stylesheet has
 * the timings). The loop's drawing carries no timing of its own: inlined,
 * its classed groups are driven by the keyframes here, in the page's mono.
 * Below 960px and under reduced motion the plate is the still, a second
 * drawing that says all four things at once, which is the share image too
 * (app/og/buyer-extension.png). Without script the loop's drawing is at
 * rest: rings, fill, and note, with no stop.
 */
export default function ExtensionLoop({ label }: { label: string }) {
  return (
    <PlayInView className={styles.loop}>
      <Plate>
        <DiagramDrawing
          name="buyer-extension"
          label={label}
          className={styles.moving}
        />
        <DiagramDrawing
          name="buyer-extension-still"
          label={label}
          className={styles.still}
        />
      </Plate>
    </PlayInView>
  );
}
