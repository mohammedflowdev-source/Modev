"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { PointerEvent, ReactNode } from "react";
import useFinePointerMotion from "@/hooks/useFinePointerMotion";

/** Pulls its child toward the cursor on hover (desktop pointers only, off with reduced motion). */
export default function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const enabled = useFinePointerMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.2 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.2 });

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="inline-flex"
      style={{ x: springX, y: springY }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}
