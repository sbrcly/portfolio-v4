import Plate from "./Plate";
import styles from "./extension-diagram.module.css";

/** Entry 05's plate: the origin-boundary diagram, built in HTML and CSS. */
export default function ExtensionDiagram() {
  return (
    <Plate
      as="figure"
      className={styles.figure}
      aria-label="Diagram: purchase rules saved in the pricing portal on one origin are fetched by the extension's background worker, passed over a chrome.runtime message port to its content script, and used to rewrite the seat map on the marketplace page on another origin."
    >
      <div className={styles.grid}>
        <div className={styles.origin}>
          <div className={styles.originHead}>
            <span>Origin A</span>
            <span>portal.brokerage.internal</span>
          </div>
          <div className={styles.box}>
            <div className={styles.boxLabel}>Pricing portal</div>
            <div className={styles.boxText}>
              Buyers write purchase rules: sections, price ceilings,
              quantities.
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.boxLabel}>Rules API</div>
            <div className={`${styles.boxText} ${styles.quiet}`}>
              GET /rules?event=… JSON, authenticated by session cookie.
            </div>
          </div>
        </div>

        <div className={styles.boundary}>
          <div className={styles.boundaryLine} aria-hidden="true" />
          <div className={styles.extension}>
            <div className={styles.boxLabel}>Extension</div>
            <div className={styles.part}>Background worker</div>
            <div className={styles.port}>
              chrome.runtime
              <br />
              message port
            </div>
            <div className={styles.part}>Content script</div>
          </div>
          <div className={styles.boundaryLabel}>origin boundary</div>
        </div>

        <div className={styles.origin}>
          <div className={styles.originHead}>
            <span>Origin B</span>
            <span>ticketmaster.com</span>
          </div>
          <div className={styles.box}>
            <div className={styles.boxLabel}>Marketplace page</div>
            <div className={styles.boxText}>
              Venue map DOM, rendered by the site&apos;s own app. Hostile to
              automation.
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.boxLabel}>Rewritten map</div>
            <div className={`${styles.boxText} ${styles.quiet}`}>
              Seats outside the rules dimmed; matching seats and ceilings
              annotated in place.
            </div>
          </div>
        </div>
      </div>

      <ol className={styles.steps}>
        <li>
          <span className={styles.stepNumber}>1</span>&nbsp; Buyer saves rules
          in the portal.
        </li>
        <li>
          <span className={styles.stepNumber}>2</span>&nbsp; Worker fetches
          rules on tab load, caches per event, refreshes on a timer.
        </li>
        <li>
          <span className={styles.stepNumber}>3</span>&nbsp; Content script
          receives rules over the port; observes the map with a
          MutationObserver.
        </li>
        <li>
          <span className={styles.stepNumber}>4</span>&nbsp; Map rewritten in
          place; state echoed back so the portal knows what was bought.
        </li>
      </ol>
    </Plate>
  );
}
