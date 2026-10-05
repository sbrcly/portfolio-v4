import { PAGES, findPage } from "@/components/work/pages";
import { OG_SIZE, ogImage } from "@/lib/og-image";

type Props = { params: Promise<{ slug: string }> };

// The description cannot follow the route (and a card made with
// generateImageMetadata, which could, is not made at build time), so it is
// one for every page.
export const alt = "The project's name over its employer in II Work";
export const size = OG_SIZE;
export const contentType = "image/png";

// One card a page, made at build time.
export function generateStaticParams() {
  return PAGES.map(({ project }) => ({ slug: project.slug }));
}

/** The share card: the project's name, then the top row's left half. */
export default async function Image({ params }: Props) {
  const page = findPage((await params).slug);
  return ogImage(page?.project.name ?? "", page?.ogLine ?? "");
}
