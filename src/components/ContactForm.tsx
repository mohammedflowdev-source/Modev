"use client";

import Button from "@/components/Button";
import useTextRevealAnimation from "@/hooks/useTextRevealAnimation";
import { AnimatePresence, motion, useAnimate, useReducedMotion } from "motion/react";
import { FormEvent, ChangeEvent, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const EASE = [0.22, 1, 0.36, 1] as const;
const MIN_SENDING_MS = 700; // keep the loading ring visible long enough to read as a state
const SUCCESS_HOLD_MS = 1150; // ring completes → fill → check draws, then the form exits

type Phase = "idle" | "sending" | "success" | "done" | "error";

const emptyForm = { name: "", email: "", subject: "", message: "" };

const fieldClass = "relative group border-b border-stone-900/15 dark:border-stone-100/15 focus-within:border-red-orange-500 dark:focus-within:border-red-orange-500 transition-colors duration-300 pb-2";
const labelClass = "block text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold mb-2 group-focus-within:text-red-orange-500 transition-colors";
const inputClass = "w-full bg-transparent text-xl md:text-2xl font-light outline-none placeholder:text-stone-400 dark:placeholder:text-stone-600 text-stone-900 dark:text-stone-100";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ContactForm() {
  const [formData, setFormData] = useState(emptyForm);
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [sentName, setSentName] = useState("");
  const reduceMotion = !!useReducedMotion();
  const [buttonScope, animateButton] = useAnimate<HTMLButtonElement>();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (phase === "sending" || phase === "success") return;
    setErrorMessage("");
    setPhase("sending");
    const startedAt = Date.now();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to send message.");

      setSentName(formData.name.trim().split(/\s+/)[0] ?? "");
      if (reduceMotion) {
        setFormData(emptyForm);
        setPhase("done");
        return;
      }
      await wait(Math.max(0, MIN_SENDING_MS - (Date.now() - startedAt)));
      setPhase("success");
      await wait(SUCCESS_HOLD_MS);
      setFormData(emptyForm);
      setPhase("done");
    } catch (err: unknown) {
      if (!reduceMotion) await wait(Math.max(0, MIN_SENDING_MS - (Date.now() - startedAt)));
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
      setPhase("error");
    }
  };

  // Error: once the circle has morphed back into the button, give it a small horizontal shake.
  useEffect(() => {
    if (phase !== "error" || reduceMotion || !buttonScope.current) return;
    animateButton(buttonScope.current, { x: [0, -8, 8, -6, 6, -3, 0] }, { duration: 0.45, delay: 0.35, ease: "easeInOut" });
  }, [phase, reduceMotion, animateButton, buttonScope]);

  const statusText =
    phase === "sending" ? "Sending your message…" :
    phase === "success" || phase === "done" ? "Message sent. Thank you!" :
    phase === "error" ? `Message not sent. ${errorMessage}` : "";

  const itemVariants = reduceMotion
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0 } }, exit: { opacity: 0, transition: { duration: 0 } } }
    : {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
        exit: { opacity: 0, y: -16, transition: { duration: 0.35, ease: EASE } },
      };
  const formVariants = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.05 } },
    exit: { transition: { staggerChildren: reduceMotion ? 0 : 0.05 } },
  };

  const isCircle = !reduceMotion && (phase === "sending" || phase === "success");
  const busy = phase === "sending" || phase === "success";

  return (
    <>
      {/* Status for screen readers (always present so changes are announced) */}
      <p aria-live="polite" className="sr-only">{statusText}</p>

      <AnimatePresence mode="wait" initial={false}>
        {phase === "done" ? (
          <ThankYou
            key="thanks"
            name={sentName}
            reduceMotion={reduceMotion}
            onReset={() => setPhase("idle")}
          />
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-10"
            variants={formVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <div className="grid md:grid-cols-2 gap-10">
              {/* Name Field */}
              <motion.div variants={itemVariants} className={fieldClass}>
                <label htmlFor="name" className={labelClass}>Your Name *</label>
                <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="Alex Morgan" className={inputClass} />
              </motion.div>

              {/* Email Field */}
              <motion.div variants={itemVariants} className={fieldClass}>
                <label htmlFor="email" className={labelClass}>Your Email *</label>
                <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} placeholder="alex@example.com" className={inputClass} />
              </motion.div>
            </div>

            {/* Subject Field */}
            <motion.div variants={itemVariants} className={fieldClass}>
              <label htmlFor="subject" className={labelClass}>Subject</label>
              <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="New project inquiry / Website redesign" className={inputClass} />
            </motion.div>

            {/* Message Field */}
            <motion.div variants={itemVariants} className={fieldClass}>
              <label htmlFor="message" className={labelClass}>Your Message *</label>
              <textarea id="message" name="message" required rows={4} value={formData.message} onChange={handleChange} placeholder="Tell me a bit about your project, goals, and timeline..." className={twMerge(inputClass, "resize-none")} />
            </motion.div>

            {/* Submit + error */}
            <motion.div variants={itemVariants} className="flex flex-col items-start gap-6 pt-4">
              <motion.button
                ref={buttonScope}
                type="submit"
                disabled={busy}
                aria-label={busy ? "Sending message" : undefined}
                layout={!reduceMotion}
                transition={{ layout: { duration: 0.5, ease: EASE } }}
                style={{ borderRadius: isCircle ? 22 : 12 }}
                className={twMerge(
                  "relative h-11 inline-flex items-center justify-center overflow-hidden border uppercase text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-orange-500",
                  isCircle ? "w-11 px-0 max-md:self-center" : "min-w-[180px] px-6 whitespace-nowrap max-md:w-full",
                  isCircle && phase === "sending" ? "bg-transparent border-stone-900/15 dark:border-stone-100/15" : "bg-red-orange-500 border-red-orange-500",
                  "transition-[background-color,border-color] duration-200",
                  phase === "success" && "delay-300",
                  reduceMotion && phase === "sending" && "opacity-70 cursor-wait"
                )}
              >
                {/* Label: slides up and out when sending, back in afterwards */}
                <AnimatePresence initial={false}>
                  {!isCircle && (
                    <motion.span
                      key="label"
                      className="inline-flex items-center gap-2"
                      initial={reduceMotion ? false : { y: "120%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: "-120%", opacity: 0, transition: { duration: 0.25, ease: EASE } }}
                      transition={{ duration: 0.4, ease: EASE, delay: 0.15 }}
                    >
                      <span>{reduceMotion && phase === "sending" ? "Sending..." : "Send Message"}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Loading ring → completes on success; then the check draws */}
                {isCircle && (
                  <motion.svg
                    layout
                    viewBox="0 0 44 44"
                    className="absolute inset-0 size-full pointer-events-none"
                    aria-hidden="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                  >
                    <motion.g
                      style={{ transformOrigin: "22px 22px" }}
                      animate={phase === "sending" ? { rotate: 360 } : { rotate: 0 }}
                      transition={phase === "sending" ? { duration: 0.9, ease: "linear", repeat: Infinity } : { duration: 0.3, ease: EASE }}
                    >
                      <motion.circle
                        cx="22"
                        cy="22"
                        r="21"
                        fill="none"
                        className="stroke-red-orange-500"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0.25 }}
                        animate={{ pathLength: phase === "success" ? 1 : 0.25 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      />
                    </motion.g>
                    {phase === "success" && (
                      <motion.path
                        d="M15 22.5l4.5 4.5L29 17.5"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, delay: 0.5, ease: EASE }}
                      />
                    )}
                  </motion.svg>
                )}
              </motion.button>

              <AnimatePresence>
                {phase === "error" && (
                  <motion.p
                    key="error"
                    className="text-sm text-red-orange-500"
                    initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.2 } }}
                    transition={{ duration: 0.4, delay: 0.35, ease: EASE }}
                  >
                    {errorMessage || "Something went wrong. Please try again."}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </>
  );
}

function ThankYou({ name, reduceMotion, onReset }: { name: string; reduceMotion: boolean; onReset: () => void }) {
  const { scope, entranceAnimation } = useTextRevealAnimation();

  // Runs on mount (twice in React dev Strict Mode — the text is re-split in between, so it must
  // animate the fresh words each time). The panel only mounts once per send.
  useEffect(() => {
    if (!scope.current) return;
    const heading = scope.current as HTMLElement;
    // Move focus to the headline once it is in the DOM (deferred a frame so it sticks).
    requestAnimationFrame(() => heading.focus({ preventScroll: true }));
    if (reduceMotion) {
      heading.querySelectorAll<HTMLElement>(".word").forEach((word) => { word.style.transform = "translateY(0)"; });
    } else {
      entranceAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- entranceAnimation is recreated every render; run on mount only
  }, []);

  const fade = (delay: number) => reduceMotion
    ? { initial: false as const, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay, ease: EASE } };

  return (
    <motion.div
      exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -16, transition: { duration: 0.3, ease: EASE } }}
      className="py-6 md:py-10"
    >
      <h2
        ref={scope}
        tabIndex={-1}
        className="text-4xl md:text-6xl lg:text-7xl tracking-[-0.03em] leading-none outline-none"
      >
        {name ? `Thank you, ${name}.` : "Thank you."}
      </h2>
      <motion.p {...fade(0.6)} className="mt-6 text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-xl leading-relaxed">
        Message received. Great projects start with a conversation, and ours just did.
      </motion.p>
      <motion.div {...fade(0.9)} className="mt-10">
        <Button type="button" variant="text" onClick={onReset} className="text-sm md:text-base">
          Send another message &#8634;
        </Button>
      </motion.div>
    </motion.div>
  );
}
