"use client";

import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { Fragment, useRef } from "react";

const items = ["Next.js", "React", "Node.js", "TypeScript", "Tailwind CSS", "Motion", "Vite", "Figma"];

// Percent of the (doubled) track moved per second; one full loop of the list takes ~25s.
const SPEED = 2;

/** Endless strip of the tech stack. Slows down on hover; static with reduced motion. */
export default function Marquee() {
  const reduceMotion = useReducedMotion();
  const offset = useMotionValue(0);
  const x = useTransform(offset, (v) => `${v}%`);
  const factor = useRef(1);
  const targetFactor = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;
    factor.current += (targetFactor.current - factor.current) * 0.06;
    let next = offset.get() - (SPEED * delta * factor.current) / 1000;
    if (next <= -50) next += 50;
    offset.set(next);
  });

  const list = (copy: number) => (
    <div className="flex shrink-0 items-center" aria-hidden={copy > 0 || undefined}>
      {items.map((item) => (
        <Fragment key={`${copy}-${item}`}>
          <span className="px-6 md:px-10 whitespace-nowrap">{item}</span>
          <span className="text-red-orange-500 text-3xl md:text-5xl">✦</span>
        </Fragment>
      ))}
    </div>
  );

  return (
    <div
      className="py-16 md:py-24 overflow-hidden border-y border-stone-400/60 dark:border-stone-700"
      onPointerEnter={() => (targetFactor.current = 0.25)}
      onPointerLeave={() => (targetFactor.current = 1)}
    >
      <p className="sr-only">Tech stack: {items.join(", ")}</p>
      <motion.div
        className="flex w-max text-5xl md:text-8xl tracking-[-0.03em] leading-none"
        style={{ x }}
        aria-hidden="true"
      >
        {list(0)}
        {list(1)}
      </motion.div>
    </div>
  );
}
