"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useAnimate } from "motion/react";
import { useSmoothScroll } from "@/components/SmoothScroll";
import { SIGNATURE_ORANGE } from "@/components/SignatureLogo";
import { TRANSITION_REVEAL_EVENT } from "@/lib/preloader";

const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;
const HALF = 0.4; // seconds to cover, and again to reveal; with the (prefetched) route swap the total stays under 1s
const NAV_TIMEOUT = 4000; // never leave the screen covered if a navigation stalls

// Name shown on the curtain for each destination.
const PAGE_NAMES: Record<string, string> = { "/": "Home", "/contact": "Contact" };
const pageName = (path: string) => PAGE_NAMES[path] ?? (path.replace(/^\//, "").replace(/[-/]/g, " ") || "Home");

/**
 * Curtain page transition for internal page links (home ↔ /contact, 404 → home):
 * cover from the bottom (0.45s) with the destination name, navigate client-side, scroll to top,
 * then lift off the top (0.45s) while the new page's entrance animations start.
 * Client-side navigation also means the preloader never replays. Reduced motion → instant navigation.
 * Browser back/forward keep Next's normal behaviour.
 */
export default function PageTransition({ children }: { children?: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { lenis } = useSmoothScroll();
  const [scope, animate] = useAnimate();
  const [label, setLabel] = useState("");
  const busy = useRef(false);
  const pendingPath = useRef<string | null>(null);
  const arrived = useRef<(() => void) | null>(null);

  // Prefetch the pages we transition between so the swap under the curtain is near-instant.
  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/contact");
  }, [router]);

  const scrollTop = useCallback(() => {
    if (lenis) {
      lenis.start();
      lenis.scrollTo(0, { immediate: true, force: true });
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [lenis]);

  // Resolve the pending navigation once the new route has rendered.
  useEffect(() => {
    if (pendingPath.current && pathname === pendingPath.current) {
      pendingPath.current = null;
      arrived.current?.();
      arrived.current = null;
    }
  }, [pathname]);

  const run = useCallback(async (href: string, path: string) => {
    if (busy.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      router.push(href, { scroll: false });
      scrollTop();
      return;
    }
    busy.current = true;
    const root = document.documentElement;
    setLabel(pageName(path));

    // 1. Cover: curtain slides up from the bottom, the destination name fades in.
    await Promise.all([
      animate(scope.current, { y: ["100%", "0%"] }, { duration: HALF, ease: CURTAIN_EASE }),
      animate("[data-transition-label]", { opacity: [0, 1], y: [12, 0] }, { duration: 0.3, delay: 0.15, ease: [0.22, 1, 0.36, 1] }),
    ]);
    root.dataset.transition = "covering"; // new page holds its entrance animations until the reveal

    // 2. Navigate under the curtain and wait for the new route to render.
    await new Promise<void>((resolve) => {
      pendingPath.current = path;
      arrived.current = resolve;
      router.push(href, { scroll: false });
      window.setTimeout(resolve, NAV_TIMEOUT);
    });
    scrollTop();
    await new Promise((r) => requestAnimationFrame(r)); // let the new page paint once before lifting

    // 3. Reveal: curtain continues upward off the screen; entrance animations start now.
    delete root.dataset.transition;
    window.dispatchEvent(new Event(TRANSITION_REVEAL_EVENT));
    await animate(scope.current, { y: ["0%", "-100%"] }, { duration: HALF, ease: CURTAIN_EASE });
    animate(scope.current, { y: "100%" }, { duration: 0 });
    busy.current = false;
  }, [animate, router, scope, scrollTop]);

  // Intercept clicks on internal page links (plain <a> and next/link) before they navigate.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page (hash links, logo on home)
      e.preventDefault();
      e.stopPropagation();
      run(url.pathname + url.search + url.hash, url.pathname);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [run]);

  return (
    <>
      {children}
      <motion.div
        ref={scope}
        className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0C0A09] text-stone-100 pointer-events-none"
        style={{ y: "100%" }}
        aria-hidden="true"
      >
        <span data-transition-label className="inline-flex items-baseline text-[40px] md:text-[64px] tracking-[-0.03em] leading-none opacity-0">
          {label}
          <span className="ml-1.5 inline-block size-1.5 rounded-full" style={{ backgroundColor: SIGNATURE_ORANGE }} />
        </span>
      </motion.div>
    </>
  );
}
