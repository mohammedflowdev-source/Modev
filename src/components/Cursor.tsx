"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import useFinePointerMotion from "@/hooks/useFinePointerMotion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Desktop-only cursor accent: a small dot that trails the pointer and grows into a
 * labelled circle over any element with a `data-cursor` attribute (e.g. "View").
 */
export default function Cursor() {
  const enabled = useFinePointerMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const handleOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.("[data-cursor]");
      setLabel(target ? target.getAttribute("data-cursor") : null);
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

  const active = !!label;

  return (
    <motion.div
      aria-hidden="true"
      className={`fixed top-0 left-0 z-50 pointer-events-none ${active ? "" : "mix-blend-difference"}`}
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center overflow-hidden"
        initial={false}
        animate={{
          width: active ? 88 : 12,
          height: active ? 88 : 12,
          opacity: visible ? 1 : 0,
          backgroundColor: active
            ? "color-mix(in srgb, #ef4444 50%, #f97316 50%)"
            : "#ffffff",
        }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <motion.span
          className="text-sm text-white tracking-wide whitespace-nowrap"
          initial={false}
          animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.6 }}
          transition={{ duration: 0.3, ease: EASE, delay: active ? 0.1 : 0 }}
        >
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
