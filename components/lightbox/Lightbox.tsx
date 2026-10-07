"use client";

import { useRef } from "react";
import plate from "@/components/work/plate.module.css";
import LightboxDialog, { useLightbox } from "./LightboxDialog";
import styles from "./lightbox.module.css";

type Props = {
  /** The picture's alt, which names the button and the dialog. */
  alt: string;
  /** On the plate, with the rim. */
  className?: string;
  /** Without the rim: a screen on a surface that has its own. */
  bare?: boolean;
  /** The plate's content, as the page shows it. */
  children: React.ReactNode;
  /**
   * What the dialog shows: the picture again, at full size. Without it the
   * drawing inside the plate is copied into the dialog when it opens, so
   * an inlined SVG is sent once.
   */
  full?: React.ReactNode;
};

/** A drawing's shape, from its viewBox, as --ratio: the dialog sizes it
    to its bounds with that (lightbox.module.css). */
function copyDrawing(svg: SVGSVGElement) {
  const copy = svg.cloneNode(true) as SVGSVGElement;
  const [, , width, height] = (copy.getAttribute("viewBox") ?? "")
    .trim()
    .split(/[\s,]+/);
  if (Number(width) > 0 && Number(height) > 0) {
    copy.style.setProperty("--ratio", String(Number(width) / Number(height)));
  }
  return copy;
}

/**
 * A plate that opens at full size. The plate is a button; the dialog is
 * LightboxDialog's. While it is open the page does not scroll; the
 * scrollbar's gutter is kept so nothing moves (globals.css). The video
 * plate (components/work/VideoPlate) opens its own, and the on-sale loop
 * does not open.
 */
export default function Lightbox({
  alt,
  className,
  bare,
  children,
  full,
}: Props) {
  const opener = useRef<HTMLButtonElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const { dialog, open, onClose } = useLightbox();

  const onOpen = () => {
    if (dialog.current?.open) return;
    // A copied drawing stays through the fade out and is replaced here.
    if (!full && copy.current && opener.current) {
      const drawings = opener.current.querySelectorAll("svg");
      copy.current.replaceChildren(...Array.from(drawings, copyDrawing));
    }
    open(opener.current);
  };

  const frame = [styles.frame, bare ? "" : plate.plate, className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={frame}>
      <button
        ref={opener}
        type="button"
        className={styles.opener}
        aria-label={`View full size: ${alt}`}
        aria-haspopup="dialog"
        onClick={onOpen}
      >
        {children}
      </button>
      <LightboxDialog dialog={dialog} label={alt} onClose={onClose}>
        {full ?? <div ref={copy} className={styles.copy} />}
      </LightboxDialog>
    </div>
  );
}
