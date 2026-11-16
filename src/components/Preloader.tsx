"use client";

import { useCallback, useEffect, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { signatureFont } from "@/fonts";
import { useSmoothScroll } from "@/components/SmoothScroll";
import { SIGNATURE_ORANGE } from "@/components/SignatureLogo";
import { isPreloaderShowing, markPreloaderDone, PRELOADER_INIT_SCRIPT, PRELOADER_SEEN_KEY } from "@/lib/preloader";

const EASE = [0.22, 1, 0.36, 1] as const;
const WRITE_EASE = [0.45, 0, 0.2, 1] as const;
const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;
const EASE_OUT_CUBIC = [0.33, 1, 0.68, 1] as const;
// Timeline starts once the signature font is ready (~0.2s after the overlay first paints).
// Curtain at 2.65s + 1.1s → everything is done ~4s after first paint.
const CURTAIN_AT = 2.65;
const CURTAIN_DURATION = 1.1;
const FONT_WAIT_MAX = 700; // ms; never hang on a slow font
// Longer than any glyph outline at this size, so each letter is "written" from nothing.
const DASH = 1800;

// Signature artwork (SVG user units). The flourish sweeps under the name and ends at the dot.
const VIEW = { w: 1000, h: 420 };
const TEXT = { x: 500, y: 255, size: 220 };
// One sweep from under the "M" that rises to the right; the dot sits just past its end, along the same direction.
const FLOURISH = "M232 318 C 420 352, 640 340, 832 266";
const DOT = { cx: 845, cy: 261, r: 8 };

type Phase = "pending" | "loading" | "running" | "leaving" | "off";

/**
 * Signature preloader — home page, first visit per session; skipped with reduced motion.
 * "Mo Dev" is written live in the signature font, a flourish sweeps under it ending in an orange dot,
 * while a counter runs to 100; then the overlay lifts like a curtain and the hero reveal plays.
 * The overlay is in the server HTML and only shown when the inline script set <html data-preloader="show">.
 */
export default function Preloader() {
  const [phase, setPhase] = useState<Phase>("pending");
  const { lenis } = useSmoothScroll();
  const visible = phase === "loading" || phase === "running" || phase === "leaving";
  const play = phase === "running" || phase === "leaving";

  const count = useMotionValue(0);
  const countText = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));
  const progress = useTransform(count, (v) => v / 100);

  // Decide on mount, then wait for the signature font so the writing never shows a fallback font.
  useEffect(() => {
    if (!isPreloaderShowing()) {
      setPhase("off");
      return;
    }
    try { sessionStorage.setItem(PRELOADER_SEEN_KEY, "1"); } catch {}
    setPhase("loading");
    let cancelled = false;
    const fontReady = document.fonts
      ? document.fonts.load(`${TEXT.size}px ${signatureFont.style.fontFamily}`).then(() => document.fonts.ready)
      : Promise.resolve();
    const timeout = new Promise((r) => setTimeout(r, FONT_WAIT_MAX));
    Promise.race([fontReady, timeout]).finally(() => { if (!cancelled) setPhase((p) => (p === "loading" ? "running" : p)); });
    return () => { cancelled = true; };
  }, []);

  const leave = useCallback(() => setPhase((p) => (p === "running" || p === "loading" ? "leaving" : p)), []);

  // Counter 000 → 100 (2.4s, ease-out cubic) and the curtain timer.
  useEffect(() => {
    if (phase !== "running") return;
    const counter = animate(count, 100, { duration: 2.4, delay: 0.1, ease: EASE_OUT_CUBIC });
    const timer = window.setTimeout(leave, CURTAIN_AT * 1000);
    return () => { counter.stop(); window.clearTimeout(timer); };
  }, [phase, count, leave]);

  // Click or any key skips straight to the curtain.
  useEffect(() => {
    if (phase !== "loading" && phase !== "running") return;
    window.addEventListener("pointerdown", leave);
    window.addEventListener("keydown", leave);
    return () => {
      window.removeEventListener("pointerdown", leave);
      window.removeEventListener("keydown", leave);
    };
  }, [phase, leave]);

  // Lock scrolling while visible: stop Lenis, hide overflow, swallow wheel/touch before Lenis sees them.
  useEffect(() => {
    if (!visible) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const block = (e: Event) => { e.preventDefault(); e.stopPropagation(); };
    window.addEventListener("wheel", block, { capture: true, passive: false });
    window.addEventListener("touchmove", block, { capture: true, passive: false });
    lenis?.stop();
    // Other components may start Lenis in the same commit (e.g. the header menu); stop it again after them.
    const raf = requestAnimationFrame(() => lenis?.stop());
    return () => {
      cancelAnimationFrame(raf);
      root.style.overflow = prevOverflow;
      window.removeEventListener("wheel", block, { capture: true });
      window.removeEventListener("touchmove", block, { capture: true });
      lenis?.start();
    };
  }, [visible, lenis]);

  const onCurtainDone = () => {
    if (phase !== "leaving") return;
    setPhase("off");
    markPreloaderDone(); // hero headline reveal starts now
  };

  if (phase === "off") return null;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: PRELOADER_INIT_SCRIPT }} />
      <motion.div
        className="site-preloader fixed inset-0 z-[100] overflow-hidden bg-[#0C0A09] text-stone-100 select-none"
        aria-hidden="true"
        initial={{ y: 0 }}
        animate={phase === "leaving" ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: CURTAIN_DURATION, ease: CURTAIN_EASE }}
        onAnimationComplete={onCurtainDone}
      >
        {/* Centre: soft aura + the written signature */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="absolute w-[380px] h-[260px] md:w-[760px] md:h-[440px] rounded-full"
            style={{ background: "radial-gradient(closest-side, rgba(229,104,63,0.3), rgba(229,104,63,0))", filter: "blur(28px)" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={play ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 1.2, ease: EASE }}
          />
          <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="relative w-[min(92vw,420px)] md:w-[min(80vw,1000px)] h-auto overflow-visible">
            <motion.text
              x={TEXT.x}
              y={TEXT.y}
              textAnchor="middle"
              fontSize={TEXT.size}
              style={{ fontFamily: signatureFont.style.fontFamily }}
              fill="#F5F5F4"
              stroke="#F5F5F4"
              strokeWidth={1.3}
              strokeDasharray={DASH}
              initial={{ strokeDashoffset: DASH, fillOpacity: 0 }}
              animate={play ? { strokeDashoffset: 0, fillOpacity: 1 } : undefined}
              transition={{
                strokeDashoffset: { duration: 1.7, delay: 0.15, ease: WRITE_EASE },
                fillOpacity: { duration: 0.6, delay: 1.75, ease: EASE },
              }}
            >
              Mo Dev
            </motion.text>
            {/* Flourish sweeps left → right under the name */}
            <motion.path
              d={FLOURISH}
              fill="none"
              stroke="#F5F5F4"
              strokeWidth={2}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={play ? { pathLength: 1, opacity: 1 } : undefined}
              transition={{ pathLength: { duration: 0.8, delay: 1.7, ease: EASE }, opacity: { duration: 0.01, delay: 1.7 } }}
            />
            {/* Orange dot pops in at the end of the flourish, with a slight overshoot */}
            <motion.circle
              cx={DOT.cx}
              cy={DOT.cy}
              fill={SIGNATURE_ORANGE}
              // Animate the radius (not a scale transform) so the dot can't drift off the flourish's end.
              initial={{ r: 0 }}
              animate={play ? { r: [0, DOT.r * 1.35, DOT.r] } : undefined}
              transition={{ duration: 0.45, delay: 2.4, times: [0, 0.6, 1], ease: EASE }}
            />
          </svg>
        </div>

        {/* Top labels */}
        <motion.div
          className="absolute inset-x-0 top-0 flex justify-between px-4 md:px-8 lg:px-16 text-[10px] md:text-xs uppercase tracking-[0.16em] text-stone-400"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 24px)" }}
          initial={{ opacity: 0, y: -8 }}
          animate={play ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
        >
          <span>Portfolio &mdash; 2026</span>
          <span>Web developer</span>
        </motion.div>

        {/* Bottom: counter + tagline */}
        <motion.div
          className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-4 md:px-8 lg:px-16"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 28px)" }}
          initial={{ opacity: 0 }}
          animate={play ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
        >
          <motion.span className="text-[72px] md:text-[120px] leading-[0.8] font-extralight tabular-nums tracking-[-0.04em]">{countText}</motion.span>
          <span className="text-[10px] md:text-xs uppercase tracking-[0.16em] text-stone-400 text-right pb-1 md:pb-2">Crafting digital experiences</span>
        </motion.div>

        {/* Progress line: 1px track, 2px glowing orange bar */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-[#292524]" />
        <motion.div
          className="absolute left-0 right-0 bottom-0 h-[2px] origin-left"
          style={{ scaleX: progress, background: SIGNATURE_ORANGE, boxShadow: "0 0 12px rgba(229,104,63,0.8)" }}
        />
      </motion.div>
    </>
  );
}
