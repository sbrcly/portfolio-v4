import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="content"
      style={{
        width: "var(--column)",
        margin: "0 auto",
        padding: "var(--chapter-pad) 0",
      }}
    >
      <h1>This page doesn&apos;t exist.</h1>
      <p style={{ marginTop: "var(--space-24)", color: "var(--muted)" }}>
        The link may be old, or the page may have moved.
      </p>
      <p style={{ marginTop: "var(--space-40)" }}>
        <Link href="/" style={{ color: "var(--brass)" }}>
          Back to the homepage
        </Link>
      </p>
    </main>
  );
}
