"use client"
import { FC, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { twMerge } from "tailwind-merge";
import SectionLabel from "@/components/SectionLabel";
import AccordionRow, { AccordionEndDivider, ROW_HOVER_SHIFT, accordionMotion } from "@/components/AccordionRow";
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

const Services: FC = () => {
  const reduceMotion = !!useReducedMotion()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { panelVariants, contentVariants } = accordionMotion(reduceMotion)

  // Staggered entrance (same rhythm as the FAQs): heading reveal, then each row's divider + content.
  const { scope: headingScope, entranceAnimation } = useTextRevealAnimation()
  const listRef = useRef<HTMLDivElement>(null)
  const inView = useInView(listRef, { once: true, margin: "0px 0px -15% 0px" })
  const showRows = inView || reduceMotion

  useEffect(() => {
    if (inView) entranceAnimation()
  }, [inView, entranceAnimation])

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
            <AccordionRow key={title} isOpen={isOpen} anyOpen={openIndex !== null} index={index} show={showRows} reduceMotion={reduceMotion}>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={isOpen ? panelId : undefined}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full text-left py-8 md:py-10 lg:py-12 grid grid-cols-[auto_1fr_auto] md:grid-cols-12 gap-x-4 md:gap-x-8 items-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-orange-500"
              >
                <span className="text-sm md:text-base tracking-widest text-stone-500 dark:text-stone-400 md:col-span-1 tabular-nums mt-2 md:mt-3">{String(index + 1).padStart(2, "0")}</span>
                <h3 className={twMerge("text-3xl md:text-4xl lg:text-5xl tracking-[-0.02em] leading-[1.1] md:col-span-5", ROW_HOVER_SHIFT)}>{title}</h3>
                {/* ↗ arrow: neutral on desktop, orange on hover / while open (turns ↘). Always orange on touch. */}
                <span className="row-start-1 col-start-3 md:col-start-12 md:col-span-1 justify-self-end mt-1 md:mt-2 size-6 text-stone-400 dark:text-stone-500 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none [@media(hover:hover)]:group-hover/row:text-red-orange-500 group-data-[open=true]/row:text-red-orange-500 [@media(hover:none)]:text-red-orange-500" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={twMerge("size-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none", isOpen && "rotate-90")}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </span>
                <p className="col-start-2 col-span-2 md:col-start-auto md:col-span-5 mt-3 md:mt-0 text-base md:text-lg text-stone-600 dark:text-stone-400 max-w-[48ch]">{description}</p>
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
                    <motion.div variants={contentVariants} className="grid grid-cols-[auto_1fr] md:grid-cols-12 gap-x-4 md:gap-x-8 pb-8 md:pb-10 lg:pb-12">
                      {/* Invisible number keeps the pills aligned under the title on phones */}
                      <span className="invisible text-sm md:text-base tracking-widest tabular-nums md:col-span-1" aria-hidden="true">00</span>
                      <div className="md:col-span-11">
                        <p className="text-xs md:text-sm uppercase tracking-widest text-stone-500 dark:text-stone-400">What&apos;s included</p>
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {included.map((item) => (
                            <li key={item} className="text-xs md:text-sm uppercase tracking-wider border border-stone-400 dark:border-stone-600 rounded-full px-3 py-1">{item}</li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </AccordionRow>
          )
        })}
        <AccordionEndDivider count={services.length} show={showRows} reduceMotion={reduceMotion} />
      </div>
    </div>
  </section>;
};

export default Services;
