import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectPage from "@/components/project-page/ProjectPage";
import { PAGES, findPage } from "@/components/work/pages";

type Props = { params: Promise<{ slug: string }> };

// Every project has a page and all of them are known at build time; any
// other slug is not found.
export const dynamicParams = false;

export function generateStaticParams() {
  return PAGES.map(({ project }) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = findPage((await params).slug);
  return page
    ? { title: page.project.name, description: page.description }
    : {};
}

export default async function Page({ params }: Props) {
  const page = findPage((await params).slug);
  if (!page) notFound();
  return <ProjectPage page={page} />;
}
