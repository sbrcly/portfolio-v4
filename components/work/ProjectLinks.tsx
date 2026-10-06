import { Fragment } from "react";
import Link from "next/link";
import { hasPage, type Project, type System } from "./employers";
import { writeUpUrl } from "./links";
import { pageHref } from "./pages";
import styles from "./work-entry.module.css";

/** A Full or Standard page is a case study; a Note is reached by the
    project's name alone. */
const isCaseStudy = ({ depth }: Project) => depth !== "note";

type Props = {
  project: Project | System;
  /** A system's projects: it links to each one's page by name. */
  made?: Project[];
};

/** Whether a project has anything for the links' line. */
export const hasLinks = ({ project, made = [] }: Props) =>
  Boolean(
    made.length ||
      (hasPage(project) && isCaseStudy(project)) ||
      project.verify ||
      project.writeUp ||
      project.note
  );

/** A project's links, one line: case study (or a system's projects' pages),
    where to verify, write-up, then the note in plain text. */
export default function ProjectLinks({ project, made = [] }: Props) {
  const { verify, writeUp, note } = project;
  const parts = [
    ...made.map((part) => (
      <Link key={part.id} href={pageHref(part)} className={styles.caseStudy}>
        {part.name}
      </Link>
    )),
    hasPage(project) && isCaseStudy(project) && (
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
