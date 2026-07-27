import "react";

/**
 * Next's App Router runs on React canary, which ships the <ViewTransition>
 * component — @types/react (stable) doesn't declare it yet. Minimal typing
 * for the props this project uses.
 */
declare module "react" {
  interface ViewTransitionProps {
    children?: ReactNode;
    name?: string;
    enter?: string | Record<string, string>;
    exit?: string | Record<string, string>;
    update?: string | Record<string, string>;
    share?: string | Record<string, string>;
    default?: string | Record<string, string>;
  }

  export const ViewTransition: (props: ViewTransitionProps) => ReactNode;
}
