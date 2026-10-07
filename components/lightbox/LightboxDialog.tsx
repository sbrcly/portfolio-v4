"use client";

import { useEffect, useRef } from "react";
import styles from "./lightbox.module.css";

/** On <html> while a lightbox is open: the page's scroll is locked
    (globals.css). */
const LOCK = "data-lightbox";

const FOCUSABLE =
  'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

/**
 * A lightbox's state: the dialog's element, and open and close. Opening
 * locks the page's scroll and puts the focus on the Close control; closing,
 * however it comes about, unlocks and puts the focus back where it was.
 */
export function useLightbox() {
  const dialog = useRef<HTMLDialogElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  // Unmounted while open (a navigation): the lock goes with it.
  useEffect(
    () => () => {
      if (dialog.current?.open) {
        document.documentElement.removeAttribute(LOCK);
      }
    },
    []
  );

  /** Opens, unless already open. The focus returns to `from`, or to what
      has it now. */
  const open = (from?: HTMLElement | null) => {
    const el = dialog.current;
    if (!el || el.open) return false;
    returnTo.current =
      from ?? (document.activeElement as HTMLElement | null);
    document.documentElement.setAttribute(LOCK, "");
    el.showModal();
    el.querySelector<HTMLElement>("[data-close]")?.focus();
    return true;
  };

  const close = () => dialog.current?.close();

  const onClose = () => {
    document.documentElement.removeAttribute(LOCK);
    returnTo.current?.focus({ preventScroll: true });
  };

  return { dialog, open, close, onClose };
}

type Props = {
  dialog: React.RefObject<HTMLDialogElement | null>;
  /** The dialog's name. */
  label: string;
  /** Whatever closed it: Escape, the control, the scrim. */
  onClose: () => void;
  /** What it shows, centered in the view. */
  children: React.ReactNode;
};

/**
 * The browser's own dialog, modal, with the ground as its scrim: a Close
 * control top right, and the view, which closes on a click beside what it
 * holds. Tab stays inside: the browser keeps the page inert, and this
 * keeps the focus from going to the browser's own controls and back.
 */
export default function LightboxDialog({
  dialog,
  label,
  onClose,
  children,
}: Props) {
  const onClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    const target = event.target as HTMLElement;
    if (target === event.currentTarget || target.dataset.scrim !== undefined) {
      dialog.current?.close();
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab" || !dialog.current) return;
    const focusable = Array.from(
      dialog.current.querySelectorAll<HTMLElement>(FOCUSABLE)
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === dialog.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-label={label}
      onClose={onClose}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        className={styles.close}
        data-close=""
        onClick={() => dialog.current?.close()}
      >
        Close
      </button>
      <div className={styles.view} data-scrim="">
        {children}
      </div>
    </dialog>
  );
}
