import { Fragment } from "react";
import Link from "next/link";
import type { Project } from "./employers";
import { writeUpUrl } from "./links";
import { pageHref } from "./pages";
import styles from "./work-entry.module.css";

/** A Full or Standard page is a case study; a Note is reached by the
    project's name alone. */
const isCaseStudy = ({ depth }: Project) => depth !== "note";

/** Whether a project has anything for the links' line. */
export const hasLinks = (project: Project) =>
  Boolean(
    isCaseStudy(project) || project.verify || project.writeUp || project.note
  );

/** A project's links, one line: case study, where to verify, write-up. */
export default function ProjectLinks({ project }: { project: Project }) {
  const { verify, writeUp, note } = project;
  const parts = [
    isCaseStudy(project) && (
      <Link href={pageHref(project)} className={styles.caseStudy}>
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
          href={writeUpUrl(writeUp)}
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
