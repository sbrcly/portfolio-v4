import {
  EMPLOYERS,
  type Employer,
  type NotePage,
  type PageLink,
  type PagePlate,
  type Project,
  type Rich,
  type Section,
  type SpecRow,
  hasPage,
} from "./employers";
import { writeUpUrl } from "./links";

/** A project's route. */
export const pageHref = ({ slug }: Pick<Project, "slug">) => `/work/${slug}`;

/**
 * The way back from a page: its employer's block in chapter II, whose title
 * a jump lands 24px under the frame (work.module.css). Never the top of
 * Work.
 */
export const employerHref = ({ id }: Pick<Employer, "id">) =>
  `/#employer-${id}`;

/** A project's page, whole: what the template (components/project-page)
    renders. */
export type ProjectPage = {
  project: Project;
  employer: Employer;
  kind?: string;
  fact?: string;
  lede: string;
  /** For search results and share cards. */
  description: string;
  spec: SpecRow[];
  plate?: PagePlate;
  /** Empty on a Note, */
  sections: Section[];
  /** and a Note's body. */
  paragraphs: Rich[];
  links: {
    note?: string;
    primary?: PageLink;
    more: PageLink[];
    /** The employer's next Full or Standard page, in a ring. */
    next?: PageLink;
  };
  back: string;
  /** The share card's line: the top row's left half. */
  ogLine: string;
};

const WALKTHROUGH = "Walkthrough on request";

/**
 * A Note nobody has written yet: the project's sentence from Work, then two
 * paragraphs to replace, each marked so that none ships by accident. The
 * spec is what the project's entry already says, with the employer's role.
 */
function unwritten(project: Project, employer: Employer): NotePage {
  const { sentence, stack, writeUp, verify } = project;
  const last: SpecRow = writeUp
    ? {
        label: "Write-up",
        value: [{ text: writeUp, href: writeUpUrl(writeUp) }],
      }
    : verify
      ? {
          label: "Verify",
          value: [{ text: verify.label, href: verify.href }],
        }
      : { label: "Code", value: WALKTHROUGH };

  return {
    lede: "Placeholder. One sentence on what it is and who it was for.",
    spec: [
      { label: "Role", value: employer.role },
      { label: "Stack", value: stack.items.join(" · ") },
      last,
    ],
    paragraphs: [
      sentence,
      "Placeholder. What was hard about it: the one problem that took the most iteration, and how it was settled. Three or four sentences, in the first person, with the detail an engineer would ask about.",
      "Placeholder. How it was used and what came of it: who ran it and when, what it changed for them, and where the work can be checked or walked through.",
    ],
    links: {
      note: WALKTHROUGH,
      primary: writeUp
        ? { label: `Write-up: ${writeUp}`, href: writeUpUrl(writeUp) }
        : undefined,
    },
  };
}

function resolve(project: Project, employer: Employer): ProjectPage {
  const page =
    project.depth === "note"
      ? {
          ...unwritten(project, employer),
          ...project.page,
          plate: undefined,
          sections: [],
        }
      : { ...project.page, paragraphs: [] };

  // "Next" goes round the employer's Full and Standard pages only; one
  // page alone has nowhere to go.
  const ring: Project[] = employer.projects
    .filter(hasPage)
    .filter(({ depth }) => depth !== "note");
  const place = ring.indexOf(project);
  const next =
    place >= 0 && ring.length > 1
      ? ring[(place + 1) % ring.length]
      : undefined;

  return {
    project,
    employer,
    ...page,
    description: project.page?.lede ?? project.sentence,
    links: {
      ...page.links,
      more: page.links.more ?? [],
      next: next && { label: `Next: ${next.name}`, href: pageHref(next) },
    },
    back: employerHref(employer),
    ogLine: `II Work · ${employer.id} ${employer.name}`,
  };
}

/** Every project's page, in the order of Work. A system has none. */
export const PAGES: ProjectPage[] = EMPLOYERS.flatMap((employer) =>
  employer.projects
    .filter(hasPage)
    .map((project) => resolve(project, employer))
);

export const findPage = (slug: string) =>
  PAGES.find(({ project }) => project.slug === slug);
