"use client";

import { useCurrentChapter } from "@/components/chapters/current-chapter";
import NavTable from "./NavTable";

/** The home page nav: the current cell follows the scroll position. */
export default function ChapterNav() {
  return <NavTable current={useCurrentChapter()} />;
}
