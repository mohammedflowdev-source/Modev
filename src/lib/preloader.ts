"use client";

import { useEffect, useState } from "react";

/**
 * Preloader state lives on <html data-preloader>:
 * - "show": set by the inline script on the home page when the preloader should play (first visit this session)
 * - "done": set once the curtain has lifted
 * - "skip"/missing: no preloader (already seen, reduced motion, other page, or client-side navigation)
 */
export const PRELOADER_DONE_EVENT = "site:preloader-done";
export const PRELOADER_SEEN_KEY = "site-preloader-seen";

/** Runs before first paint (inline in the HTML) so returning visitors never see the overlay flash. */
export const PRELOADER_INIT_SCRIPT = `(function(){var d=document.documentElement;try{var seen=sessionStorage.getItem("${PRELOADER_SEEN_KEY}");var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;d.dataset.preloader=(seen||reduce)?"skip":"show";}catch(e){d.dataset.preloader="skip";}})();`;

export const isPreloaderShowing = () =>
  typeof document !== "undefined" && document.documentElement.dataset.preloader === "show";

export function markPreloaderDone() {
  document.documentElement.dataset.preloader = "done";
  window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
}

/** True once the page may play its entrance animations (immediately when there's no preloader). */
export function usePreloaderDone() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!isPreloaderShowing()) {
      setDone(true);
      return;
    }
    const onDone = () => setDone(true);
    window.addEventListener(PRELOADER_DONE_EVENT, onDone);
    return () => window.removeEventListener(PRELOADER_DONE_EVENT, onDone);
  }, []);
  return done;
}
