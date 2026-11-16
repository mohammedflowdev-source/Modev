"use client";
import { ReactNode, RefObject, useEffect, useState } from "react";
import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { cubicBezier } from "motion";

const EASE = cubicBezier(0.22, 1, 0.36, 1);
const STACK_QUERY = "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)";
// Stuck cards sit just below the fixed navbar (80px + iPhone safe area) with a small gap.
const STICKY_TOP = "calc(5rem + env(safe-area-inset-top) + 1rem)";

/** Phones only: true when cards should stack (below md, motion allowed). */
export const useStackCards = () => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(STACK_QUERY);
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return enabled;
};

/**
 * Wraps a project card. On phones it becomes a sticky layer; while the next card
 * overlaps it, it scales to 0.95 and fades to 0.6. Elsewhere it is a plain wrapper.
 */
const StackCard = ({ children, cardRef, nextRef, enabled }: { children: ReactNode; cardRef: RefObject<HTMLDivElement>; nextRef?: RefObject<HTMLDivElement>; enabled: boolean }) => {
  const stacking = enabled && !!nextRef;
  // Overlap progress: 0 until the next card's top edge reaches this card's bottom edge (at its
  // sticky position), 1 once the next card has slid all the way up to the same sticky top.
  const overlap = useMotionValue(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    if (!stacking) {
      overlap.set(0);
      return;
    }
    const update = () => {
      const card = cardRef.current;
      const next = nextRef?.current;
      if (!card || !next) return;
      const stickyTop = parseFloat(getComputedStyle(card).top) || 0;
      const height = card.offsetHeight; // layout height, unaffected by the scale transform
      const coveredBottom = stickyTop + height;
      const nextTop = next.getBoundingClientRect().top;
      overlap.set(Math.min(1, Math.max(0, (coveredBottom - nextTop) / height)));
    };
    update();
    const unsubscribe = scrollY.on("change", update);
    window.addEventListener("resize", update);
    return () => {
      unsubscribe();
      window.removeEventListener("resize", update);
    };
  }, [stacking, cardRef, nextRef, overlap, scrollY]);

  const scale = useTransform(overlap, [0, 1], [1, 0.95], { ease: EASE });
  const opacity = useTransform(overlap, [0, 1], [1, 0.6], { ease: EASE });

  return (
    <motion.div
      ref={cardRef}
      // Same background variable (and theme transition) as <body>, so the wrapper is invisible.
      className={enabled ? "sticky self-start bg-[var(--page-bg)] transition-colors duration-500 origin-top" : undefined}
      style={enabled ? {
        top: STICKY_TOP,
        scale: stacking ? scale : 1,
        opacity: stacking ? opacity : 1,
      } : undefined}
    >
      {children}
    </motion.div>
  );
};

export default StackCard;
