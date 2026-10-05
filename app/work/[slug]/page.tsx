import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectPage from "@/components/project-page/ProjectPage";
import { PAGES, findPage } from "@/components/work/pages";
import { OPEN_GRAPH } from "@/lib/open-graph";
import { OG_SIZE } from "@/lib/og-image";

type Props = { params: Promise<{ slug: string }> };

// Every project has a page and all of them are known at build time; any
// other slug is not found.
export const dynamicParams = false;

export function generateStaticParams() {
  return PAGES.map(({ project }) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = findPage((await params).slug);
  if (!page) return {};
  const { project, description, share } = page;
  return {
    title: project.name,
    description,
    // A page with a picture to share names it here, which keeps the card
    // (opengraph-image.tsx) off it. Naming an image replaces the layout's
    // whole openGraph, so the rest is said again.
    ...(share && {
      openGraph: {
        ...OPEN_GRAPH,
        images: [
          { url: share.src, alt: share.alt, type: "image/png", ...OG_SIZE },
        ],
      },
    }),
  };
}

export default async function Page({ params }: Props) {
  const page = findPage((await params).slug);
  if (!page) notFound();
  return <ProjectPage page={page} />;
}
