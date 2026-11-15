"use client";

import Lenis from "lenis";
import { cancelFrame, frame } from "motion/react";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type SmoothScrollContextValue = {
  /** The Lenis instance, or null when reduced motion is on (or before mount). */
  lenis: Lenis | null;
  /** Scroll to "#id" (or "#"/"" for top), offset by the fixed navbar height. */
  scrollToHash: (hash: string) => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  scrollToHash: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

// Height of the fixed navbar (80px + iPhone safe-area inset), read from the blur strip.
const getNavbarOffset = () =>
  document.querySelector<HTMLElement>("[data-navbar]")?.offsetHeight ?? 80;

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  // Create Lenis once; tear it down (and keep it off) when reduced motion is preferred.
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let instance: Lenis | null = null;
    let update: ((data: { timestamp: number }) => void) | null = null;

    const destroy = () => {
      if (update) cancelFrame(update);
      instance?.destroy();
      instance = null;
      update = null;
      setLenis(null);
    };

    const init = () => {
      if (media.matches || instance) return;
      instance = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false, // keep native touch scrolling on phones
        autoRaf: false,
      });
      // Drive Lenis from Framer Motion's frame loop so useScroll animations stay in sync.
      const lenisInstance = instance;
      update = (data) => lenisInstance.raf(data.timestamp);
      frame.update(update, true);
      setLenis(instance);
    };

    const onChange = () => (media.matches ? destroy() : init());

    init();
    media.addEventListener("change", onChange);
    return () => {
      media.removeEventListener("change", onChange);
      destroy();
    };
  }, []);

  const scrollToHash = useCallback(
    (hash: string) => {
      const offset = getNavbarOffset();
      const target =
        hash && hash !== "#" ? document.querySelector<HTMLElement>(hash) : null;
      if (hash && hash !== "#" && !target) return;

      if (lenis) {
        lenis.start(); // a stopped Lenis (menu open) blocks scrolling
        lenis.scrollTo(target ?? 0, { offset: target ? -offset : 0, force: true });
        return;
      }

      const top = target
        ? target.getBoundingClientRect().top + window.scrollY - offset
        : 0;
      window.scrollTo({ top, behavior: "instant" });
    },
    [lenis]
  );

  // Handle plain in-page anchor links (e.g. "View my work") that have no custom handler.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.("a[href]");
      const href = anchor?.getAttribute("href");
      if (!anchor || !href?.startsWith("#") || anchor.getAttribute("target")) return;
      e.preventDefault();
      scrollToHash(href);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [scrollToHash]);

  return (
    <SmoothScrollContext.Provider value={{ lenis, scrollToHash }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
