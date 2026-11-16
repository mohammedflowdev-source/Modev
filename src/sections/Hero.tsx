"use client";
import { FC, useEffect, useRef } from "react";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import heroImage from "@/assets/images/hero-portrait.jpg";
import Image from "next/image";
import Button from "@/components/Button"


import { motion, useScroll, useTransform } from "motion/react";

import useTextRevealAnimation from "@/hooks/useTextRevealAnimation";
import { usePageReady } from "@/lib/preloader";


const Hero: FC = () => {
  //const [titleScope, titleAnimate] = useAnimate()
  const scrollingDiv = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: scrollingDiv,
    offset: ['start end', 'end end']
  })

  const portraitWidth = useTransform(scrollYProgress, [0, 1], ['100%', '240%'])
  const { scope, entranceAnimation } = useTextRevealAnimation()
  // Wait for the preloader or page-transition curtain (if any) before the headline's line reveal and the buttons.
  const ready = usePageReady()

  useEffect(() => {
    if (ready) entranceAnimation()
  }, [ready, entranceAnimation])

  return <section>
    <div className="grid md:grid-cols-12 md:h-screen items-stretch sticky top-0">
      <div className="md:col-span-7 flex flex-col justify-center">
        <div className="container !max-w-full">
          {/* md+: max-width in em (8.49em longest line < 9.2em < 10.26em next break) keeps exactly 4 lines:
              "Crafting digital / experiences through / code and creative / design" at every width */}
          <motion.h1 initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : undefined} ref={scope} className="text-[3.0625rem] md:text-6xl lg:text-[length:clamp(3rem,calc(5.3vw-12px),7rem)] tracking-[-0.03em] leading-none max-w-[18.3ch] md:max-w-[9.2em] mt-40 md:mt-0">Crafting digital experiences through code and creative design</motion.h1>
          <div className="flex flex-row items-center mt-10 gap-6">
            <motion.div initial={{ opacity: 0, y: `100%` }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{
              duration: 0.6,
              delay: 0.8,
              ease: [0.22, 1, 0.36, 1]
            }}>
              <a href="#projects">
                <Button as="span" variant="secondary" iconAfter={<div className="overflow-hidden size-5">
                  <div className="h-5 w-10 flex group-hover/button:-translate-x-1/2 transition-transform duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                    </svg>
                  </div>
                </div>}>
                  <span>View My Work</span>
                </Button>
              </a>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: `100%` }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{
              duration: 0.6,
              delay: 0.95,
              ease: [0.22, 1, 0.36, 1]
            }}>
              <a href="/contact">
                <Button as="span" variant="text">Let&apos;s Talk</Button>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="md:col-span-5 relative">
        <motion.div className="mt-12 md:mt-0 md:size-full md:absolute md:right-0 max-md:!w-full" style={{
          width: portraitWidth
        }}>
          <Image src={heroImage} alt="my portrait" className="size-full object-cover" priority sizes="100vw" placeholder="blur" />
        </motion.div>
      </div>
    </div>
    <div className="md:h-[120vh]" ref={scrollingDiv}>

    </div>


  </section>;
};

export default Hero;
