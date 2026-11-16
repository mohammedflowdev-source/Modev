"use client"
import { FC, RefObject, useEffect, useRef, useState } from "react";
import { motion, MotionValue, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { twMerge } from "tailwind-merge";
import SectionLabel from "@/components/SectionLabel";
import useTextRevealAnimation from "@/hooks/useTextRevealAnimation";

const steps = [
  { title: "Discover", description: "A quick call to understand your goals, audience and timeline." },
  { title: "Design", description: "A clear visual direction and layout before any code is written." },
  { title: "Build", description: "Clean, fast code with regular previews so you see progress." },
  { title: "Launch", description: "Testing, going live, and support after launch." },
];

const EASE = [0.22, 1, 0.36, 1] as const;
// The orange line glides after the scroll position instead of jumping with it.
const LINE_SPRING = { stiffness: 60, damping: 20 };
// Animatable equivalents of the site colors (red-orange-500 = 50/50 mix of red-500 and orange-500; stone-400).
const ORANGE = "#f45c2d";
const GRAY = "#a8a29e";
const number = (index: number) => String(index + 1).padStart(2, "0");

/**
 * Index of the last step whose dot the (sprung) line has reached. `thresholds` are each dot's
 * position along the line as a 0–1 fraction. Reveals are time-based animations triggered by this,
 * not mapped directly to scroll, so they always play smoothly.
 */
const useReachedStep = (line: MotionValue<number>, thresholds: RefObject<number[]>) => {
  const [reached, setReached] = useState(-1);
  useMotionValueEvent(line, "change", (value) => {
    const list = thresholds.current ?? [];
    let next = -1;
    list.forEach((t, i) => { if (value > t + 0.002) next = i; });
    setReached(next);
  });
  return reached;
};

/** Dot on the timeline: gray until reached, then fills orange and scales up over ~0.5s. */
// Positioning (incl. centering translate) lives on the wrapper, since motion's scale overrides the inner transform.
const Dot = ({ active, className }: { active: boolean; className?: string }) => (
  <span className={twMerge("block size-3", className)}>
    <motion.span
      className="block size-full rounded-full"
      initial={false}
      animate={{ scale: active ? 1.5 : 1, backgroundColor: active ? ORANGE : GRAY }}
      transition={{ duration: 0.5, ease: EASE }}
    />
  </span>
);

/** Number, title and description: dimmed until reached, then fade + rise (~0.7s), title slightly before the text. */
const StepText = ({ index, active, className }: { index: number; active: boolean; className?: string }) => {
  const part = (delay: number) => ({
    initial: false as const,
    animate: { opacity: active ? 1 : 0.5, y: active ? 0 : 16 },
    transition: { duration: 0.7, ease: EASE, delay: active ? delay : 0 },
  });
  return (
    <div className={className}>
      <motion.span {...part(0)} className="block text-5xl md:text-6xl tracking-[-0.03em] text-red-orange-500 tabular-nums">{number(index)}</motion.span>
      <motion.h3 {...part(0.06)} className="mt-6 md:mt-10 text-3xl md:text-4xl tracking-[-0.02em]">{steps[index].title}</motion.h3>
      <motion.p {...part(0.16)} className="mt-3 md:mt-4 text-base md:text-lg text-stone-600 dark:text-stone-400 max-w-[36ch]">{steps[index].description}</motion.p>
    </div>
  );
};

/** Desktop: full-width horizontal line; dots sit at the start of each of the 4 step columns. */
const DesktopTimeline = ({ progress, reduceMotion }: { progress: MotionValue<number>; reduceMotion: boolean }) => {
  const line = useSpring(useTransform(progress, [0.04, 0.92], [0, 1], { clamp: true }), LINE_SPRING);
  const gridRef = useRef<HTMLDivElement>(null);
  const thresholds = useRef<number[]>([]);

  // Dot i sits at the left edge of column i: its threshold is that edge as a fraction of the full line width.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const measure = () => {
      thresholds.current = Array.from(grid.children).map((col) => (col as HTMLElement).offsetLeft / grid.offsetWidth);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  const reached = useReachedStep(line, thresholds);
  const active = (index: number) => reduceMotion || index <= reached;

  return (
    <div className="relative mt-16 lg:mt-20">
      <div className="absolute top-0 inset-x-0 -translate-y-1/2">
        <div className="h-px w-full bg-stone-900/15 dark:bg-stone-100/15" />
        <motion.div className="absolute inset-0 h-px bg-red-orange-500 origin-left" style={{ scaleX: reduceMotion ? 1 : line }} />
      </div>
      <div ref={gridRef} className="grid grid-cols-4 gap-x-8">
        {steps.map(({ title }, index) => (
          <div key={title} className="relative">
            <Dot active={active(index)} className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
            <StepText index={index} active={active(index)} className="pt-10 lg:pt-12 pr-4" />
          </div>
        ))}
      </div>
    </div>
  );
};

/** Phones: vertical line on the left that fills downward (same spring + reveal timing), no pinning. */
const MobileTimeline = ({ reduceMotion }: { reduceMotion: boolean }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const thresholds = useRef<number[]>([]);
  // The line fills as the list passes 70% of the viewport height.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 70%"] });
  const line = useSpring(scrollYProgress, LINE_SPRING);

  // Dot i's threshold is its centre's position along the line.
  useEffect(() => {
    const list = listRef.current;
    const track = lineRef.current;
    if (!list || !track) return;
    const measure = () => {
      const top = track.getBoundingClientRect().top;
      const height = track.offsetHeight || 1;
      thresholds.current = Array.from(list.querySelectorAll("[data-dot]")).map((dot) => {
        const r = dot.getBoundingClientRect();
        return (r.top + r.height / 2 - top) / height;
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  const reached = useReachedStep(line, thresholds);
  const active = (index: number) => reduceMotion || index <= reached;

  return (
    <div ref={listRef} className="relative mt-10 pl-10">
      <div ref={lineRef} className="absolute left-0 top-2 bottom-0 w-px bg-stone-900/15 dark:bg-stone-100/15" />
      <motion.div className="absolute left-0 top-2 bottom-0 w-px bg-red-orange-500 origin-top" style={{ scaleY: reduceMotion ? 1 : line }} />
      {steps.map(({ title }, index) => (
        <div key={title} className="relative pb-14 last:pb-0">
          <span data-dot className="absolute top-2 -left-10 -translate-x-1/2 ml-[0.5px] size-3">
            <Dot active={active(index)} />
          </span>
          <StepText index={index} active={active(index)} />
        </div>
      ))}
    </div>
  );
};

const Process: FC = () => {
  const reduceMotion = !!useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const spacerRef = useRef<HTMLDivElement>(null)

  const { scope: headingScope, entranceAnimation } = useTextRevealAnimation()
  const headingInView = useInView(headingScope, { once: true })
  useEffect(() => {
    if (headingInView) entranceAnimation()
  }, [headingInView, entranceAnimation])

  // Desktop pin (decided after mount: the server can't know the motion preference, and React keeps
  // server classes on hydration). The panel is sticky while a 250vh spacer below it scrolls past.
  const [pinned, setPinned] = useState(false)
  useEffect(() => setPinned(!reduceMotion), [reduceMotion])

  // Pin progress: 0 when the panel sticks (section top at viewport top), 1 when it releases.
  const progress = useMotionValue(0)
  const { scrollY } = useScroll()
  useEffect(() => {
    const update = () => {
      const section = sectionRef.current
      const spacer = spacerRef.current
      if (!section || !spacer || !spacer.offsetHeight) return
      const top = section.getBoundingClientRect().top
      progress.set(Math.min(1, Math.max(0, -top / spacer.offsetHeight)))
    }
    update()
    const unsubscribe = scrollY.on("change", update)
    window.addEventListener("resize", update)
    return () => {
      unsubscribe()
      window.removeEventListener("resize", update)
    }
  }, [scrollY, progress, pinned])

  return <section
    ref={sectionRef}
    id="process"
    className={twMerge("relative section", pinned && "md:py-0")}
  >
    {/* Pinned panel carries the section's usual top/bottom padding, so spacing matches other sections. */}
    <div className={twMerge(pinned && "md:sticky md:top-0 md:pt-32 lg:pt-40 md:pb-32 lg:pb-40")}>
      <div className="container">
        <SectionLabel index="04" label="Process" />
        <h2 className="text-4xl md:text-7xl lg:text-8xl tracking-[-0.03em] leading-none" ref={headingScope}>How I work</h2>
        <div className="hidden md:block">
          <DesktopTimeline progress={progress} reduceMotion={reduceMotion} />
        </div>
        <div className="md:hidden">
          <MobileTimeline reduceMotion={reduceMotion} />
        </div>
      </div>
    </div>
    {pinned && <div ref={spacerRef} className="hidden md:block h-[250vh]" aria-hidden="true" />}
  </section>;
};

export default Process;
