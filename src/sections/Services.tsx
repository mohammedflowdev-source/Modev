"use client"
import { FC, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { twMerge } from "tailwind-merge";
import SectionLabel from "@/components/SectionLabel";
import useTextRevealAnimation from "@/hooks/useTextRevealAnimation";

const services = [
  {
    title: "Business Websites",
    description: "Fast, modern sites that make your business look professional and bring in customers.",
    included: ["Responsive design", "SEO setup", "Contact forms", "Fast hosting"],
  },
  {
    title: "Online Stores",
    description: "E-commerce with products, cart, payments and an easy admin experience.",
    included: ["Product catalog", "Cart & checkout", "Payments", "Admin dashboard"],
  },
  {
    title: "Landing Pages",
    description: "Focused, high-converting pages for campaigns, launches and offers.",
    included: ["Conversion-focused layout", "Analytics", "Fast loading", "Clear call-to-action"],
  },
  {
    title: "Redesigns",
    description: "Turn an outdated website into a modern, fast and mobile-friendly experience.",
    included: ["Site audit", "Fresh design", "Speed boost", "Mobile-first rebuild"],
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.55;

const Services: FC = () => {
  const reduceMotion = useReducedMotion()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Staggered entrance (same rhythm as the FAQs): heading reveal, then each row's divider + content.
  const { scope: headingScope, entranceAnimation } = useTextRevealAnimation()
  const listRef = useRef<HTMLDivElement>(null)
  const inView = useInView(listRef, { once: true, margin: "0px 0px -15% 0px" })
  const showRows = inView || !!reduceMotion

  useEffect(() => {
    if (inView) entranceAnimation()
  }, [inView, entranceAnimation])

  const rowDelay = (index: number) => (reduceMotion ? 0 : 0.3 + index * 0.06)
  const cssMotion = "duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
  // Row text shifts inward on hover (transform only, so no layout shift).
  // Hover/open styles apply only on devices with real hover (no stuck fills on touch).
  // Open state uses group-data so it has the same specificity as group-hover (beats dark: colors).
  const shift = `transition-[transform,color] ${cssMotion} [@media(hover:hover)]:group-hover/service:translate-x-4 lg:[@media(hover:hover)]:group-hover/service:translate-x-8 [@media(hover:hover)]:group-data-[open=true]/service:translate-x-4 lg:[@media(hover:hover)]:group-data-[open=true]/service:translate-x-8`

  // Expand/collapse: same height + fade/rise as the FAQ answers.
  const panelVariants = {
    collapsed: { height: 0, transition: { duration: reduceMotion ? 0 : DURATION, ease: EASE } },
    open: { height: "auto", transition: { duration: reduceMotion ? 0 : DURATION, ease: EASE } },
  }
  const panelContentVariants = {
    collapsed: { opacity: 0, y: reduceMotion ? 0 : 8, transition: { duration: reduceMotion ? 0 : 0.2, ease: EASE } },
    open: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.1, ease: EASE } },
  }

  return <section className="section" id="services">
    <div className="container">
      <SectionLabel index="02" label="Services" />
      <h2 className="text-4xl md:text-7xl lg:text-8xl tracking-[-0.03em] leading-none" ref={headingScope}>What I can do for you</h2>
      <div className="mt-10 md:mt-16 lg:mt-20" ref={listRef}>
        {services.map(({ title, description, included }, index) => {
          const isOpen = index === openIndex
          const buttonId = `service-${index}`
          const panelId = `service-panel-${index}`
          return (
            <div key={title} data-open={isOpen} className={twMerge("relative isolate group/service transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none", openIndex !== null && !isOpen && "[@media(hover:none)]:opacity-50")}>
              {/* Touch devices: 2px orange line draws down the left edge while open (retracts on close) */}
              <div className="hidden [@media(hover:none)]:block absolute left-0 top-0 bottom-0 w-[2px] bg-red-orange-500 origin-top scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-data-[open=true]/service:scale-y-100" aria-hidden="true" />
              {/* Divider draws left → right on entrance; sits under the fill, exactly the row width */}
              <motion.div
                className="absolute top-0 inset-x-0 h-px -z-20 bg-stone-900/15 dark:bg-stone-100/15 origin-left"
                initial={{ scaleX: reduceMotion ? 1 : 0 }}
                animate={showRows ? { scaleX: 1 } : undefined}
                transition={{ duration: 0.8, delay: rowDelay(index), ease: EASE }}
              />
              {/* Dark fill wipes up from the bottom on hover and while open (stone-800 on the stone-950 dark page) */}
              <div className={twMerge("absolute bottom-0 inset-x-0 h-0 bg-stone-900 dark:bg-stone-800 -z-10 transition-[height]", cssMotion, "[@media(hover:hover)]:group-hover/service:h-full [@media(hover:hover)]:group-data-[open=true]/service:h-full")} aria-hidden="true" />
              <motion.div
                className="transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none [@media(hover:none)]:group-data-[open=true]/service:pl-4"
                initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 16 }}
                animate={showRows ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.6, delay: rowDelay(index) + (reduceMotion ? 0 : 0.1), ease: EASE }}
              >
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={isOpen ? panelId : undefined}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left py-8 md:py-10 lg:py-12 grid grid-cols-[auto_1fr_auto] md:grid-cols-12 gap-x-4 md:gap-x-8 items-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-orange-500"
                >
                  <span className={twMerge("text-sm md:text-base tracking-widest text-stone-500 dark:text-stone-400 md:col-span-1 tabular-nums mt-2 md:mt-3", shift, "[@media(hover:hover)]:group-hover/service:text-red-orange-500 [@media(hover:hover)]:group-data-[open=true]/service:text-red-orange-500")}>{String(index + 1).padStart(2, "0")}</span>
                  <h3 className={twMerge("text-3xl md:text-4xl lg:text-5xl tracking-[-0.02em] leading-[1.1] md:col-span-5", shift, "[@media(hover:hover)]:group-hover/service:text-stone-100 [@media(hover:hover)]:group-data-[open=true]/service:text-stone-100")}>{title}</h3>
                  {/* Orange ↗ arrow slides in from the right on hover; always shown on touch. Turns ↘ when open. */}
                  <span className={twMerge(
                    "row-start-1 col-start-3 md:col-start-12 md:col-span-1 justify-self-end mt-1 md:mt-2 size-6 text-red-orange-500 opacity-0 translate-x-4 transition-[opacity,transform]",
                    cssMotion,
                    "[@media(hover:hover)]:group-hover/service:opacity-100 [@media(hover:hover)]:group-hover/service:-translate-x-4 lg:[@media(hover:hover)]:group-hover/service:-translate-x-8 [@media(hover:hover)]:group-data-[open=true]/service:opacity-100 [@media(hover:hover)]:group-data-[open=true]/service:-translate-x-4 lg:[@media(hover:hover)]:group-data-[open=true]/service:-translate-x-8",
                    "[@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-x-0",
                  )} aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={twMerge("size-6 transition-transform", cssMotion, isOpen && "rotate-90")}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </span>
                  <p className={twMerge("col-start-2 col-span-2 md:col-start-auto md:col-span-5 mt-3 md:mt-0 text-base md:text-lg text-stone-600 dark:text-stone-400 max-w-[48ch]", shift, "[@media(hover:hover)]:group-hover/service:text-stone-300 [@media(hover:hover)]:group-data-[open=true]/service:text-stone-300")}>{description}</p>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="overflow-hidden"
                      variants={panelVariants}
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                    >
                      <motion.div variants={panelContentVariants} className="grid grid-cols-[auto_1fr] md:grid-cols-12 gap-x-4 md:gap-x-8 pb-8 md:pb-10 lg:pb-12">
                        {/* Invisible number keeps the pills aligned under the title on phones */}
                        <span className="invisible text-sm md:text-base tracking-widest tabular-nums md:col-span-1" aria-hidden="true">00</span>
                        <div className={twMerge("md:col-span-11", shift)}>
                          <p className={twMerge("text-xs md:text-sm uppercase tracking-widest text-stone-500 dark:text-stone-400 transition-colors", cssMotion, "[@media(hover:hover)]:group-hover/service:text-stone-400 [@media(hover:hover)]:group-data-[open=true]/service:text-stone-400")}>What&apos;s included</p>
                          <ul className="mt-4 flex flex-wrap gap-2">
                            {included.map((item) => (
                              <li key={item} className={twMerge("text-xs md:text-sm uppercase tracking-wider border border-stone-400 dark:border-stone-600 rounded-full px-3 py-1 transition-colors", cssMotion, "[@media(hover:hover)]:group-hover/service:border-stone-600 [@media(hover:hover)]:group-hover/service:text-stone-200 [@media(hover:hover)]:group-data-[open=true]/service:border-stone-600 [@media(hover:hover)]:group-data-[open=true]/service:text-stone-200")}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
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
          transition={{ duration: 0.8, delay: rowDelay(services.length), ease: EASE }}
        />
      </div>
    </div>
  </section>;
};

export default Services;
