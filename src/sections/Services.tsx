"use client"
import { FC, useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import SectionLabel from "@/components/SectionLabel";
import useTextRevealAnimation from "@/hooks/useTextRevealAnimation";

const services = [
  {
    title: "Business Websites",
    description: "Fast, modern sites that make your business look professional and bring in customers.",
  },
  {
    title: "Online Stores",
    description: "E-commerce with products, cart, payments and an easy admin experience.",
  },
  {
    title: "Landing Pages",
    description: "Focused, high-converting pages for campaigns, launches and offers.",
  },
  {
    title: "Redesigns",
    description: "Turn an outdated website into a modern, fast and mobile-friendly experience.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const Services: FC = () => {
  const reduceMotion = useReducedMotion()

  // Staggered entrance (same rhythm as the FAQs): heading reveal, then each row's divider + content.
  const { scope: headingScope, entranceAnimation } = useTextRevealAnimation()
  const listRef = useRef<HTMLDivElement>(null)
  const inView = useInView(listRef, { once: true, margin: "0px 0px -15% 0px" })
  const showRows = inView || !!reduceMotion

  useEffect(() => {
    if (inView) entranceAnimation()
  }, [inView, entranceAnimation])

  const rowDelay = (index: number) => (reduceMotion ? 0 : 0.3 + index * 0.06)
  const cssMotion = "duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
  // Row text shifts right on hover (devices with real hover only); the arrow stays inside the row.
  const shift = `transition-transform ${cssMotion} [@media(hover:hover)]:group-hover/service:translate-x-4 lg:[@media(hover:hover)]:group-hover/service:translate-x-8`

  return <section className="section" id="services">
    <div className="container">
      <SectionLabel index="02" label="Services" />
      <h2 className="text-4xl md:text-7xl lg:text-8xl tracking-[-0.03em] leading-none" ref={headingScope}>What I can do for you</h2>
      <div className="mt-10 md:mt-16 lg:mt-20" ref={listRef}>
        {services.map(({ title, description }, index) => (
          <a
            href="/contact"
            key={title}
            className="block relative group/service focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-orange-500"
          >
            {/* Divider draws left → right on entrance */}
            <motion.div
              className="absolute top-0 left-0 h-px w-full bg-stone-900/15 dark:bg-stone-100/15 origin-left"
              initial={{ scaleX: reduceMotion ? 1 : 0 }}
              animate={showRows ? { scaleX: 1 } : undefined}
              transition={{ duration: 0.8, delay: rowDelay(index), ease: EASE }}
            />
            <motion.div
              className="py-8 md:py-10 lg:py-12"
              initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 16 }}
              animate={showRows ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: rowDelay(index) + (reduceMotion ? 0 : 0.1), ease: EASE }}
            >
              <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-12 gap-x-4 md:gap-x-8 items-baseline">
                <span className={`text-sm md:text-base tracking-widest text-stone-500 dark:text-stone-400 md:col-span-1 tabular-nums ${shift}`}>{String(index + 1).padStart(2, "0")}</span>
                <h3 className={`text-3xl md:text-4xl lg:text-5xl tracking-[-0.02em] md:col-span-5 ${shift}`}>{title}</h3>
                {/* Arrow fades/slides in on hover (devices with real hover only) */}
                <span className={`row-start-1 col-start-3 md:col-start-12 md:col-span-1 justify-self-end self-center size-6 text-red-orange-500 opacity-0 -translate-x-3 transition-[opacity,transform] ${cssMotion} [@media(hover:hover)]:group-hover/service:opacity-100 [@media(hover:hover)]:group-hover/service:translate-x-0 [@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-x-0`} aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </span>
                <p className={`col-start-2 col-span-2 md:col-start-auto md:col-span-5 mt-3 md:mt-0 text-base md:text-lg text-stone-600 dark:text-stone-400 max-w-[48ch] ${shift}`}>{description}</p>
              </div>
            </motion.div>
          </a>
        ))}
        {/* Closing divider under the last row */}
        <motion.div
          className="h-px w-full bg-stone-900/15 dark:bg-stone-100/15 origin-left"
          initial={{ scaleX: reduceMotion ? 1 : 0 }}
          animate={showRows ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.8, delay: rowDelay(services.length), ease: EASE }}
        />
      </div>
    </div>
  </section>;
};

export default Services;
