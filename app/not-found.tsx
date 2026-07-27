import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container page">
      <p className="eyebrow entranceMask">
        <span>404</span>
      </p>
      <h1 className="pageTitle entranceMask">
        <span>This page doesn&apos;t exist.</span>
      </h1>
      <p className="lede">
        The link may be old, or the page may have moved.
      </p>
      <p style={{ marginTop: "2.5rem" }}>
        <Link href="/" className="button buttonSecondary">
          Back to the homepage
        </Link>
      </p>
    </section>
  );
}
