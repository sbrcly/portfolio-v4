import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connect",
  description: "Email, GitHub, LinkedIn, and resume for Scott Barclay.",
  openGraph: {
    title: "Connect · Scott Barclay",
    description: "Email, GitHub, LinkedIn, and resume.",
  },
};

export default function ConnectPage() {
  return (
    <article className="container page">
      <header>
        <p className="eyebrow entranceMask">
          <span>Connect</span>
        </p>
        <h1 className="pageTitle entranceMask">
          <span>Talk to me about your team.</span>
        </h1>
        <p className="lede">
          I read everything sent to my inbox, and I&apos;m happy to walk
          through any project on this site in as much depth as you want.
        </p>
      </header>

      <dl className="factList" style={{ marginTop: "3rem" }}>
        <div>
          <dt>Email</dt>
          <dd>
            <a href="mailto:scottbarclay02@gmail.com">
              scottbarclay02@gmail.com
            </a>
          </dd>
        </div>
        <div>
          <dt>GitHub</dt>
          <dd>
            <a href="https://github.com/sbrcly" target="_blank" rel="noopener">
              github.com/sbrcly
            </a>
          </dd>
        </div>
        <div>
          <dt>LinkedIn</dt>
          <dd>
            <a
              href="https://www.linkedin.com/in/scott-barclay-a27077425"
              target="_blank"
              rel="noopener"
            >
              linkedin.com/in/scott-barclay
            </a>
          </dd>
        </div>
        <div>
          <dt>Resume</dt>
          <dd>
            <a href="/resume.pdf" download>
              Download resume (PDF)
            </a>
          </dd>
        </div>
      </dl>
    </article>
  );
}
