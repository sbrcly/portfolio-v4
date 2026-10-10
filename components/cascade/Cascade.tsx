import { guard, plan } from "./scripts";

/** The cascade's two inline scripts (scripts.ts); the third part, for a
    client-side navigation, is CascadeOnNavigation. */

/** In the head. */
export function CascadeGuard() {
  return <script dangerouslySetInnerHTML={{ __html: guard }} />;
}

/** At the end of the body, after everything it measures. */
export function CascadePlan() {
  return <script dangerouslySetInnerHTML={{ __html: plan }} />;
}
