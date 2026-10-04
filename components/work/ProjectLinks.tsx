import { Fragment } from "react";
import Link from "next/link";
import type { Project } from "./employers";
import styles from "./work-entry.module.css";

/** Whether a project has anything for the links' line. */
export const hasLinks = ({ caseStudy, verify, writeUp, note }: Project) =>
  Boolean(caseStudy || verify || writeUp || note);

/** A project's links, one line: case study, where to verify, write-up. */
export default function ProjectLinks({ project }: { project: Project }) {
  const { caseStudy, verify, writeUp, note } = project;
  const parts = [
    caseStudy && (
      <Link href={caseStudy} className={styles.caseStudy}>
        Read the case study
      </Link>
    ),
    verify && (
      <a
        href={verify.href}
        className={styles.verify}
        target="_blank"
        rel="noopener"
      >
        {verify.label}
      </a>
    ),
    writeUp && (
      <>
        Write-up:{" "}
        <a
          href={`https://github.com/sbrcly/${writeUp}`}
          className={styles.verify}
          target="_blank"
          rel="noopener"
        >
          {writeUp}
        </a>
      </>
    ),
    note,
  ].filter(Boolean);

  return parts.map((part, index) => (
    <Fragment key={index}>
      {index > 0 && <> &nbsp;·&nbsp; </>}
      {part}
    </Fragment>
  ));
}
