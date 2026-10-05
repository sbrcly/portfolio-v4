import Diagram from "@/components/diagram/Diagram";
import PlayInView from "./PlayInView";
import styles from "./venue-loop.module.css";

/**
 * The on-sale system's plate: a synthetic venue in the pricing portal. From
 * 960px up it is a 14-second loop, played while at least half the plate is
 * in view: a rule is dragged across section 105, the seats in its band
 * light, the rule appears in the panel and is resolved at save, and the
 * buyer's screen paints the same seats (venue-loop.module.css has the
 * timings). Below 960px, under reduced motion, and without script it is
 * the drawing as the file has it: the loop's last frame, the still.
 */
export default function VenueLoop({ label }: { label: string }) {
  return (
    <PlayInView className={styles.loop}>
      <Diagram name="on-sale-system" label={label} />
    </PlayInView>
  );
}
