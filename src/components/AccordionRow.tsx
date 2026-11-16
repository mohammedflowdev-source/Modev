"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";

export const ACCORDION_EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.55;

/**
 * Shared timing for the Services and FAQ accordions: staggered entrance delay per row and the
 * expand/collapse variants (smooth height, content fades + rises).
 */
export const accordionMotion = (reduceMotion: boolean) => ({
  rowDelay: (index: number) => (reduceMotion ? 0 : 0.3 + index * 0.06),
  panelVariants: {
    collapsed: { height: 0, transition: { duration: reduceMotion ? 0 : DURATION, ease: ACCORDION_EASE } },
    open: { height: "auto", transition: { duration: reduceMotion ? 0 : DURATION, ease: ACCORDION_EASE } },
  },
  contentVariants: {
    collapsed: { opacity: 0, y: reduceMotion ? 0 : 8, transition: { duration: reduceMotion ? 0 : 0.2, ease: ACCORDION_EASE } },
    open: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.1, ease: ACCORDION_EASE } },
  },
});

/** Light hover, devices with real hover only (no stuck states on touch). Use with `group/row`. */
export const ROW_HOVER_SHIFT =
  "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none [@media(hover:hover)]:group-hover/row:translate-x-2";

/**
 * One accordion row, identical on desktop and phones:
 * - open: a 2px orange line draws down the left edge (~0.5s) and the content eases in with left padding
 * - while any row in the section is open, the other rows fade to 50%
 * - divider draws in on entrance; content fades + rises in, staggered by `index`
 * Children can style themselves from the row state with `group-hover/row:` and `group-data-[open=true]/row:`.
 */
export default function AccordionRow({
  isOpen, anyOpen, index, show, reduceMotion, className, onClick, children,
}: {
  isOpen: boolean;
  anyOpen: boolean;
  index: number;
  show: boolean;
  reduceMotion: boolean;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  const { rowDelay } = accordionMotion(reduceMotion);
  const transition = "duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";
  return (
    <div
      data-open={isOpen}
      onClick={onClick}
      className={twMerge("relative group/row transition-opacity", transition, anyOpen && !isOpen && "opacity-50", className)}
    >
      {/* Orange line on the left edge: draws top → bottom on open, retracts on close */}
      <div
        className={twMerge("absolute left-0 top-0 bottom-0 w-[2px] bg-red-orange-500 origin-top scale-y-0 transition-transform group-data-[open=true]/row:scale-y-100", transition)}
        aria-hidden="true"
      />
      {/* Divider draws left → right on entrance, exactly the row width */}
      <motion.div
        className="absolute top-0 inset-x-0 h-px bg-stone-900/15 dark:bg-stone-100/15 origin-left"
        initial={{ scaleX: reduceMotion ? 1 : 0 }}
        animate={show ? { scaleX: 1 } : undefined}
        transition={{ duration: 0.8, delay: rowDelay(index), ease: ACCORDION_EASE }}
      />
      <motion.div
        className={twMerge("transition-[padding] group-data-[open=true]/row:pl-4", transition)}
        initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 16 }}
        animate={show ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6, delay: rowDelay(index) + (reduceMotion ? 0 : 0.1), ease: ACCORDION_EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Closing divider under the last row (draws in after the rows). */
export function AccordionEndDivider({ count, show, reduceMotion }: { count: number; show: boolean; reduceMotion: boolean }) {
  return (
    <motion.div
      className="h-px w-full bg-stone-900/15 dark:bg-stone-100/15 origin-left"
      initial={{ scaleX: reduceMotion ? 1 : 0 }}
      animate={show ? { scaleX: 1 } : undefined}
      transition={{ duration: 0.8, delay: accordionMotion(reduceMotion).rowDelay(count), ease: ACCORDION_EASE }}
    />
  );
}
