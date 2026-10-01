"use client";

import { useEffect } from "react";
import { startPlateLight } from "./plate-light";

/** Runs the nearest-center plate light for one chapter (III by default). */
export default function PlateLight({ chapter = "iii" }: { chapter?: string }) {
  useEffect(() => startPlateLight(chapter), [chapter]);
  return null;
}
