"use client"
import {
  FC, useEffect, useRef, useState
} from "react";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { twMerge } from "tailwind-merge";
import SectionLabel from "@/components/SectionLabel";
import useTextRevealAnimation from "@/hooks/useTextRevealAnimation";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const faqs = [
  {
    question: "How long does it take to build a website?",
    answer:
      "Most landing pages and portfolios take 1–2 weeks, and larger sites or web apps 3–6 weeks. After a quick call about your goals, I'll send a clear timeline with milestones so you always know what's next.",
  },
  {
    question: "What is your development process like?",
    answer:
      "I follow a hands-on approach starting with project planning, building out the core features, and regular check-ins to make sure everything matches your needs.",
  },
  {
    question: "Do you work with international clients?",
    answer:
      "Yes, I work with clients globally and can accommodate different time zones for meetings and communication.",
  },
  {
    question: "What industries do you specialize in?",
    answer:
      "I have experience across various industries including technology, retail, hospitality, and professional services, bringing fresh perspectives to each project.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.55;

const FAQs: FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const reduceMotion = useReducedMotion()

  // Staggered entrance: heading reveal, then each row's divider + question.
  const { scope: headingScope, entranceAnimation } = useTextRevealAnimation()
  const listRef = useRef<HTMLDivElement>(null)
  const inView = useInView(listRef, { once: true, margin: "0px 0px -15% 0px" })
  const showRows = inView || !!reduceMotion

  useEffect(() => {
    if (inView) entranceAnimation()
  }, [inView, entranceAnimation])

  const rowDelay = (index: number) => (reduceMotion ? 0 : 0.3 + index * 0.06)
  const answerVariants = {
    collapsed: { height: 0, transition: { duration: reduceMotion ? 0 : DURATION, ease: EASE } },
    open: { height: "auto", transition: { duration: reduceMotion ? 0 : DURATION, ease: EASE } },
  }
  const answerTextVariants = {
    collapsed: { opacity: 0, y: reduceMotion ? 0 : 8, transition: { duration: reduceMotion ? 0 : 0.2, ease: EASE } },
    open: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.1, ease: EASE } },
  }
  // Shared timing for the CSS transitions so icon, fill and shift move with the height.
  const cssMotion = "duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"

  return <section className="section" id="faqs">
    <div className="container">
      <SectionLabel index="06" label="FAQs" />
      <h2 className="text-4xl md:text-7xl lg:text-8xl tracking-[-0.03em] leading-none" ref={headingScope}>FAQs</h2>
      <div className="mt-10 md:mt-16 lg:mt-20" ref={listRef}>
        {faqs.map(({ question, answer }, faqIndex) => {
          const isOpen = faqIndex === selectedIndex
          const buttonId = `faq-question-${faqIndex}`
          const answerId = `faq-answer-${faqIndex}`
          return (
            <div key={question} data-open={isOpen} className={twMerge("py-6 md:py-8 lg:py-10 relative isolate group/faq transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none", selectedIndex !== null && !isOpen && "[@media(hover:none)]:opacity-50")} onClick={() => {
              setSelectedIndex(isOpen ? null : faqIndex)
            }}>
              {/* Touch devices: 2px orange line draws down the left edge while open (retracts on close) */}
              <div className="hidden [@media(hover:none)]:block absolute left-0 top-0 bottom-0 w-[2px] bg-red-orange-500 origin-top scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-data-[open=true]/faq:scale-y-100" aria-hidden="true" />
              {/* Divider draws left → right on entrance; sits under the fill, exactly the row width */}
              <motion.div
                className="absolute top-0 inset-x-0 h-px -z-20 bg-stone-900/15 dark:bg-stone-100/15 origin-left"
                initial={{ scaleX: reduceMotion ? 1 : 0 }}
                animate={showRows ? { scaleX: 1 } : undefined}
                transition={{ duration: 0.8, delay: rowDelay(faqIndex), ease: EASE }}
              />
              {/* Hover / open fill (same as Services) — only on devices with real hover (no stuck fill on touch) */}
              <div className={twMerge("absolute h-0 inset-x-0 bottom-0 bg-stone-900 dark:bg-stone-800 -z-10 transition-[height]", cssMotion, "[@media(hover:hover)]:group-hover/faq:h-full [@media(hover:hover)]:group-data-[open=true]/faq:h-full")} aria-hidden="true"></div>
              <motion.div
                className="transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none [@media(hover:none)]:group-data-[open=true]/faq:pl-4"
                initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 16 }}
                animate={showRows ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.6, delay: rowDelay(faqIndex) + (reduceMotion ? 0 : 0.1), ease: EASE }}
              >
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={isOpen ? answerId : undefined}
                  className="w-full text-left flex items-center justify-between gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-orange-500"
                >
                  <span className={twMerge("text-2xl md:text-3xl lg:text-4xl lg:pr-8 transition-[transform,color]", cssMotion, "lg:[@media(hover:hover)]:group-hover/faq:translate-x-8 [@media(hover:hover)]:group-hover/faq:text-stone-100 [@media(hover:hover)]:group-data-[open=true]/faq:text-stone-100", isOpen && "lg:translate-x-8")}>{question}</span>
                  <span className={twMerge("inline-flex items-center justify-center size-11 border border-stone-400 dark:border-stone-600 rounded-full shrink-0 bg-stone-200 dark:bg-stone-800 transition-[transform,background-color,border-color,color]", cssMotion, "lg:[@media(hover:hover)]:group-hover/faq:-translate-x-8", !isOpen && "[@media(hover:hover)]:group-hover/faq:border-stone-300 [@media(hover:hover)]:group-hover/faq:bg-transparent [@media(hover:hover)]:group-hover/faq:text-stone-100", isOpen && "rotate-45 lg:-translate-x-8 bg-red-orange-500 dark:bg-red-orange-500 border-red-orange-500 dark:border-red-orange-500 text-white")}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={answerId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="overflow-hidden lg:px-8"
                      variants={answerVariants}
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                    >
                      <motion.p variants={answerTextVariants} className="text-base md:text-lg text-stone-600 dark:text-stone-400 [@media(hover:hover)]:group-data-[open=true]/faq:text-stone-300 max-w-[60ch] leading-relaxed pt-4 pb-2 md:pb-4">{answer}</motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )
        })}
        {/* Closing divider under the last row */}
        <motion.div
          className="relative -z-20 h-px w-full bg-stone-900/15 dark:bg-stone-100/15 origin-left"
          initial={{ scaleX: reduceMotion ? 1 : 0 }}
          animate={showRows ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.8, delay: rowDelay(faqs.length), ease: EASE }}
        />
      </div>
    </div>
  </section>;
};

export default FAQs;
