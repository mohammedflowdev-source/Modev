"use client"
import Button from "@/components/Button";
import ArrowUpRightIcon from "@/components/ArrowUpRightIcon";
import useTextRevealAnimation from "@/hooks/useTextRevealAnimation";
import { useInView } from "motion/react";
import { FC, useEffect, MouseEvent } from "react";
import { useSmoothScroll } from "@/components/SmoothScroll";
import SectionLabel from "@/components/SectionLabel";
import { socialLinks } from "@/data/socials";


const navItems = [
  {
    href: `#`,
    label: `Home`,
  },
  {
    href: `#projects`,
    label: `Projects`,
  },
  {
    href: `#testimonials`,
    label: `Testimonials`,
  },
  {
    href: `#faqs`,
    label: `Faqs`,
  },
  {
    href: `#contact`,
    label: `Contact`,
  },
]

const Footer: FC = () => {
  const { scope, entranceAnimation } = useTextRevealAnimation()
  const inView = useInView(scope);
  const { scrollToHash } = useSmoothScroll()
  const handleClickNavItem = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const url = new URL(e.currentTarget.href);
    scrollToHash(url.hash)



  }

  useEffect(() => {
    if (inView) {
      entranceAnimation();
    }
  }, [inView, entranceAnimation])
  return <footer className="bg-stone-900 text-white" id="contact">
    <div className="container">
      <div className="section">
        <SectionLabel index="05" label="Contact" className="text-white/60 dark:text-white/60" />
        <div className="flex items-center gap-3">
          <div className="size-3 rounded-full bg-green-400 animate-pulse"></div>
          <span className="uppercase">One spot available for next month</span></div>
        <div className="grid md:grid-cols-3 md:items-center">
          <div className="md:col-span-2">
            <h2 className="text-4xl md:text-7xl lg:text-8xl tracking-[-0.03em] leading-none mt-8 font-extralight" ref={scope}>Enough talk. Let&apos;s make something great together.</h2>
            <a href="/contact">
              <Button
                as="span"
                className="mt-8 text-sm px-4 md:text-base md:px-6"
                variant="secondary"
                iconAfter={
                  <div className="size-6 overflow-hidden">
                    <div className="w-12 h-6 flex transition-transform duration-300 group-hover/button:-translate-x-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </div>
                  </div>
                }
              >
                mohammedflow.dev@gmail.com
              </Button>
            </a>
            <div className="flex flex-wrap gap-8 mt-8">
              {socialLinks.map(({ label, href }) => (
                <a href={href} key={label} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`}>
                  <Button as="span" variant="text" className="text-sm md:text-base gap-1" iconAfter={<ArrowUpRightIcon />}>{label}</Button>
                </a>
              ))}
            </div>
          </div>
          <div className="md:col-span-1">
            <nav className="flex flex-col md:items-end gap-8 mt-16 md:mt-0">
              {navItems.map(({ href, label }) => (
                <a href={href} key={label} onClick={handleClickNavItem}>
                  <Button as="span" variant="text" className="text-lg">{label}</Button>
                </a>
              ))}
            </nav>
          </div>

        </div>

      </div>
      <div className="py-8 border-t border-white/10 flex items-center justify-between gap-4 text-sm text-white/60">
        <p>Copyright &copy; Mo Dev &bull; All rights reserved</p>
        <a href="#" className="shrink-0 hover:text-white transition-colors duration-300">Back to top &uarr;</a>
      </div>
    </div>
  </footer>;
};

export default Footer;
