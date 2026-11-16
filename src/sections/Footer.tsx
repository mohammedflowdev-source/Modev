"use client"
import Button from "@/components/Button";
import ArrowUpRightIcon from "@/components/ArrowUpRightIcon";
import useTextRevealAnimation from "@/hooks/useTextRevealAnimation";
import { useInView } from "motion/react";
import { FC, useEffect, useRef, useState, MouseEvent } from "react";
import { useSmoothScroll } from "@/components/SmoothScroll";
import SectionLabel from "@/components/SectionLabel";
import { socialLinks } from "@/data/socials";
import LocalTime from "@/components/LocalTime";
import WhatsAppIcon, { whatsappHref } from "@/components/WhatsAppIcon";


const navItems = [
  {
    href: `#`,
    label: `Home`,
  },
  {
    href: `#services`,
    label: `Services`,
  },
  {
    href: `#projects`,
    label: `Projects`,
  },
  {
    href: `#process`,
    label: `Process`,
  },
  {
    href: `#testimonials`,
    label: `Testimonials`,
  },
  {
    href: `#faqs`,
    label: `FAQs`,
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

  // Curtain reveal (footer pinned under the page) only when the whole footer fits in the window;
  // on phones and short screens it is taller than the viewport, so it stays a normal footer.
  const footerRef = useRef<HTMLElement>(null)
  const [fitsViewport, setFitsViewport] = useState(false)
  useEffect(() => {
    const check = () => {
      const footer = footerRef.current
      if (footer) setFitsViewport(footer.offsetHeight <= window.innerHeight)
    }
    check()
    const observer = new ResizeObserver(check)
    if (footerRef.current) observer.observe(footerRef.current)
    window.addEventListener("resize", check)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", check)
    }
  }, [])
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
  return <footer ref={footerRef} className={`bg-stone-900 text-white ${fitsViewport ? "sticky bottom-0 z-0" : "relative"}`} id="contact">
    <div className="container">
      <div className="py-24 md:py-28 lg:py-24">
        <SectionLabel index="07" label="Contact" className="text-white/60 dark:text-white/60" />
        <div className="flex items-center gap-3">
          <div className="size-3 rounded-full bg-green-400 animate-pulse"></div>
          <span className="uppercase">One spot available for next month</span></div>
        <div className="grid md:grid-cols-3 md:items-center">
          <div className="md:col-span-2">
            <h2 className="text-4xl md:text-7xl lg:text-8xl tracking-[-0.03em] leading-none mt-8 font-extralight" ref={scope}>Enough talk. Let&apos;s make something great together.</h2>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
              <a href="/contact">
                <Button
                  as="span"
                  className="text-sm px-4 md:text-base md:px-6"
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
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp (opens in a new tab)">
                <Button as="span" variant="text" className="text-sm md:text-base gap-0">
                  <span className="inline-flex items-center gap-2"><WhatsAppIcon className="size-5" />Chat on WhatsApp</span>
                </Button>
              </a>
            </div>
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
      <div className="py-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 text-sm text-white/60">
        <div className="flex flex-col gap-1 md:flex-row md:gap-4">
          <p>Copyright &copy; Mo Dev &bull; All rights reserved</p>
          <p><LocalTime /> &middot; Working with clients worldwide</p>
        </div>
        <a href="#" className="shrink-0 hover:text-white transition-colors duration-300">Back to top &uarr;</a>
      </div>
    </div>
  </footer>;
};

export default Footer;
