"use client";

import { useEffect } from "react";
import { startPlateLight } from "./plate-light";

export default function PlateLight() {
  useEffect(() => startPlateLight(), []);
  return null;
}
