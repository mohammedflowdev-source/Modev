"use client"
import {
  FC, useEffect, useRef, useState
} from "react";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { twMerge } from "tailwind-merge";
import SectionLabel from "@/components/SectionLabel";
import AccordionRow, { AccordionEndDivider, ROW_HOVER_SHIFT, accordionMotion } from "@/components/AccordionRow";
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

const FAQs: FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const reduceMotion = !!useReducedMotion()
  const { panelVariants, contentVariants } = accordionMotion(reduceMotion)

  // Staggered entrance: heading reveal, then each row's divider + question.
  const { scope: headingScope, entranceAnimation } = useTextRevealAnimation()
  const listRef = useRef<HTMLDivElement>(null)
  const inView = useInView(listRef, { once: true, margin: "0px 0px -15% 0px" })
  const showRows = inView || reduceMotion

  useEffect(() => {
    if (inView) entranceAnimation()
  }, [inView, entranceAnimation])

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
            <AccordionRow
              key={question}
              isOpen={isOpen}
              anyOpen={selectedIndex !== null}
              index={faqIndex}
              show={showRows}
              reduceMotion={reduceMotion}
              className="py-6 md:py-8 lg:py-10"
              onClick={() => setSelectedIndex(isOpen ? null : faqIndex)}
            >
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={isOpen ? answerId : undefined}
                className="w-full text-left flex items-center justify-between gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-orange-500"
              >
                <span className={twMerge("text-2xl md:text-3xl lg:text-4xl lg:pr-8", ROW_HOVER_SHIFT)}>{question}</span>
                {/* Plus circle: icon + border turn orange on hover (desktop); orange fill with white × when open */}
                <span className={twMerge(
                  "inline-flex items-center justify-center size-11 border border-stone-400 dark:border-stone-600 rounded-full shrink-0 bg-stone-200 dark:bg-stone-800 transition-[transform,background-color,border-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  !isOpen && "[@media(hover:hover)]:group-hover/row:text-red-orange-500 [@media(hover:hover)]:group-hover/row:border-red-orange-500 dark:[@media(hover:hover)]:group-hover/row:border-red-orange-500",
                  isOpen && "rotate-45 bg-red-orange-500 dark:bg-red-orange-500 border-red-orange-500 dark:border-red-orange-500 text-white",
                )}>
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
                    className="overflow-hidden"
                    variants={panelVariants}
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                  >
                    <motion.p variants={contentVariants} className="text-base md:text-lg text-stone-600 dark:text-stone-400 max-w-[60ch] leading-relaxed pt-4 pb-2 md:pb-4">{answer}</motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </AccordionRow>
          )
        })}
        <AccordionEndDivider count={faqs.length} show={showRows} reduceMotion={reduceMotion} />
      </div>
    </div>
  </section>;
};

export default FAQs;
