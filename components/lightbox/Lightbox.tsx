"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./lightbox.module.css";

type LightboxProps = {
  src: StaticImageData;
  alt: string;
  caption: string;
  /** sizes for the in-band thumbnail; the dialog always requests full width */
  sizes?: string;
};

/**
 * Band screenshot that opens full size in a native <dialog>. showModal()
 * supplies the focus trap, top-layer rendering, and Escape handling; this
 * component adds the paper scrim, the body scroll lock, explicit focus
 * return to the trigger, and the single entrance beat.
 */
export default function Lightbox({ src, alt, caption, sizes }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const close = () => {
    // Close the dialog and clear state together rather than trusting the
    // close event to bridge them — it doesn't fire in every engine
    dialogRef.current?.close();
    setOpen(false);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    if (!open || !dialog) return;
    // Escape is handled natively by the dialog; these listeners only keep
    // React state in sync with it. keydown backstops engines where the
    // dialog's close event never fires.
    const handleClose = () => setOpen(false);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("keydown", handleKeyDown);
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
      // Explicit, not left to the dialog's native restore: mouse-opened
      // triggers never held focus, so native restore would land on <body>
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-label={`View full size: ${alt}`}
        onClick={() => setOpen(true)}
      >
        <Image src={src} alt={alt} sizes={sizes} />
      </button>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={alt}
        onClick={(event) => {
          // Only clicks on the scrim itself — not the figure or close button
          if (event.target === event.currentTarget) close();
        }}
      >
        {open && (
          <>
            <button
              type="button"
              className={styles.close}
              aria-label="Close"
              onClick={close}
            >
              &#x2715;
            </button>
            <figure className={styles.figure}>
              <Image
                src={src}
                alt={alt}
                sizes="92vw"
                loading="eager"
                className={styles.full}
              />
              <figcaption className={styles.caption}>{caption}</figcaption>
            </figure>
          </>
        )}
      </dialog>
    </>
  );
}
