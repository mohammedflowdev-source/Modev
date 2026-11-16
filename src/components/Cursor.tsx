"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import useFinePointerMotion from "@/hooks/useFinePointerMotion";

const EASE = [0.22, 1, 0.36, 1] as const;
// Elements that turn the dot into a ring. Anything with [data-cursor] (e.g. project cards) shows the label instead.
const INTERACTIVE = "a, button, [role='button'], [data-cursor-hover]";
const MORPH_SPRING = { type: "spring", stiffness: 380, damping: 30, mass: 0.6 } as const;

type Mode = "dot" | "ring" | "label";

/**
 * Desktop-only cursor accent:
 * - dot: small white dot with mix-blend-difference (inverts over the page)
 * - ring: over links/buttons, a ~40px white ring (normal blend, so it stays white over orange buttons)
 * - label: over [data-cursor] elements, the orange circle with its label (e.g. "View" on project cards)
 */
export default function Cursor() {
  const enabled = useFinePointerMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>("dot");
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const handleOver = (e: PointerEvent) => {
      const el = e.target as Element | null;
      const labelled = el?.closest?.("[data-cursor]");
      if (labelled) {
        setLabel(labelled.getAttribute("data-cursor"));
        setMode("label");
      } else if (el?.closest?.(INTERACTIVE)) {
        setMode("ring");
      } else {
        setMode("dot");
      }
    };
    const handleLeaveWindow = () => setVisible(false);

    window.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerover", handleOver);
    document.documentElement.addEventListener("pointerleave", handleLeaveWindow);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerover", handleOver);
      document.documentElement.removeEventListener("pointerleave", handleLeaveWindow);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = mode === "label" ? 88 : mode === "ring" ? 40 : 12;
  const background = mode === "label" ? "rgba(244, 92, 45, 1)" : mode === "ring" ? "rgba(255, 255, 255, 0)" : "rgba(255, 255, 255, 1)";

  return (
    <motion.div
      aria-hidden="true"
      className={`fixed top-0 left-0 z-50 pointer-events-none ${mode === "dot" ? "mix-blend-difference" : "mix-blend-normal"}`}
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center overflow-hidden border-solid border-white"
        // Hairline dark edge keeps the white ring visible on the light page background too.
        style={{ boxShadow: mode === "ring" ? "0 0 0 0.5px rgba(28, 25, 23, 0.25), inset 0 0 0 0.5px rgba(28, 25, 23, 0.25)" : "none" }}
        initial={false}
        animate={{
          width: size,
          height: size,
          borderWidth: mode === "ring" ? 1.5 : 0,
          backgroundColor: background, // red-orange-500 as rgba (color-mix() can't be animated)
          opacity: visible ? 1 : 0,
        }}
        transition={{
          width: MORPH_SPRING,
          height: MORPH_SPRING,
          borderWidth: MORPH_SPRING,
          backgroundColor: { duration: 0.3, ease: EASE },
          opacity: { duration: 0.3, ease: EASE },
        }}
      >
        <motion.span
          className="text-sm text-white tracking-wide whitespace-nowrap"
          initial={false}
          animate={{ opacity: mode === "label" ? 1 : 0, scale: mode === "label" ? 1 : 0.6 }}
          transition={{ duration: 0.3, ease: EASE, delay: mode === "label" ? 0.1 : 0 }}
        >
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
