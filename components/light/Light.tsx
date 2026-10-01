"use client";

import { useEffect } from "react";
import { startLight } from "./handover";

export default function Light() {
  useEffect(() => startLight(), []);
  return null;
}
