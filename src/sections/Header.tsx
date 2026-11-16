"use client"
import Button from "@/components/Button";
import ArrowUpRightIcon from "@/components/ArrowUpRightIcon";
import ThemeToggle from "@/components/ThemeToggle";
import { useSmoothScroll } from "@/components/SmoothScroll";
import Magnetic from "@/components/Magnetic";
import { socialLinks } from "@/data/socials";
import { FC, MouseEvent, useEffect, useState } from "react";
import { motion, useAnimate } from "motion/react"

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const navItems = [
  {
    label: "About",
    href: "#intro",
  },
  {
    label: "Services",
    href: "#services",
  },
  {
    label: "Selected Works",
    href: "#projects",
  },
  {
    label: "Process",
    href: "#process",
  },
  {
    label: "Testimonials",
    href: "#testimonials",
  },
  {
    label: "FAQs",
    href: "#faqs",
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

const Header: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [topLineScope, topLineAnimate] = useAnimate()
  const [bottomLineScope, bottomLineAnimate] = useAnimate()

  const [navScope, navAnimate] = useAnimate()
  const { lenis, scrollToHash } = useSmoothScroll()

  // Pause smooth scrolling while the full-screen menu is open.
  useEffect(() => {
    if (!lenis) return;
    if (isOpen) lenis.stop();
    else lenis.start();
  }, [isOpen, lenis])

  useEffect(() => {
    if (isOpen) {
      topLineAnimate([
        [
          topLineScope.current,
          {
            translateY: 4
          }
        ],
        [
          topLineScope.current,
          {
            rotate: 45
          }
        ]
      ]);
      bottomLineAnimate([
        [
          bottomLineScope.current,
          {
            translateY: -4
          }
        ],
        [
          bottomLineScope.current,
          {
            rotate: -45
          }
        ]
      ]);
      navAnimate(
        navScope.current,
        {
          height: "100%"
        },
        {
          duration: 0.7
        }
      );
    } else {
      topLineAnimate([
        [
          topLineScope.current,
          {
            rotate: 0
          }
        ],
        [
          topLineScope.current,
          {
            translateY: 0
          }
        ]
      ]);
      bottomLineAnimate([
        [
          bottomLineScope.current,
          {
            rotate: 0
          }
        ],
        [
          bottomLineScope.current,
          {
            translateY: 0
          }
        ]
      ]);
      navAnimate(navScope.current, { height: 0 })
    }
  }, [isOpen, topLineAnimate, topLineScope, bottomLineAnimate, bottomLineScope, navScope, navAnimate])

  const handleClickMobileNavItem = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsOpen(false)
    const url = new URL(e.currentTarget.href);
    scrollToHash(url.hash)



  }
  return <header>
    <div className="fixed top-0 left-0 w-full h-0 overflow-hidden bg-stone-900 z-10 " ref={navScope}>
      <nav className="mt-20 flex flex-col">
        {navItems.map(({ label, href }) => (
          <a href={href} key={label} className="text-stone-200 border-t last:border-b border-stone-800 py-8 [@media(max-height:900px)]:py-6 group/nav-item relative isolate" onClick={handleClickMobileNavItem}>
            <div className="container !max-w-full flex items-center justify-between">
              <span className="text-3xl group-hover/nav-item:pl-4 transition-all duration-500">{label}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
            <div className="absolute w-full h-0 bg-stone-800 group-hover/nav-item:h-full transition-all duration-500 bottom-0 -z-10"></div>
          </a>
        ))}
      </nav>
      <div className="container !max-w-full flex gap-8 py-8">
        {socialLinks.map(({ label, href }) => (
          <a href={href} key={label} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`}>
            <Button as="span" variant="text" className="text-sm tracking-widest text-stone-400 hover:text-stone-100 gap-1" iconAfter={<ArrowUpRightIcon />}>{label}</Button>
          </a>
        ))}
      </div>
    </div>
    {/* Blur strip: 1rem taller than the navbar so the fade (set from the bottom, not in %) ends before the
        strip's edge — keeps the logo row fully blurred under the iPhone status bar and hides WebKit's edge streaks. */}
    <div className="fixed top-0 left-0 w-full backdrop-blur-md z-10 pointer-events-none" style={{ height: "calc(6rem + env(safe-area-inset-top))", maskImage: "linear-gradient(to bottom, #000 calc(100% - 2.5rem), transparent calc(100% - 1rem))", WebkitMaskImage: "linear-gradient(to bottom, #000 calc(100% - 2.5rem), transparent calc(100% - 1rem))" }} aria-hidden="true" />
    <div className="fixed top-0 left-0 w-full mix-blend-difference z-10" data-navbar style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="container !max-w-full">
        <div className="flex justify-between h-20 items-center">
          <div>
            <a href="/">
              <span className="text-xl font-bold uppercase text-white">Mo Dev.</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div className="fixed top-0 left-0 w-full z-10" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="container !max-w-full">
        <div className="flex justify-end h-20 items-center">
          <div className="flex items-center gap-4">
            <Magnetic>
              <ThemeToggle />
            </Magnetic>
            <Magnetic>
            <button type="button" aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen} className="size-11 border border-stone-400 dark:border-stone-600 bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors" onClick={() => setIsOpen(!isOpen)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.rect x="3" y="7" width="18" height="2" fill="currentColor" ref={topLineScope} style={{
                  transformOrigin: `12px 8px`,
                }} />
                <motion.rect x="3" y="15" width="18" height="2" fill="currentColor" ref={bottomLineScope} style={{
                  transformOrigin: `12px 16px`,
                }} />
              </svg>
            </button>
            </Magnetic>
            <Magnetic>
              {/* Hide the whole link on phones (not just its text) so there's no empty, unnamed link */}
              <a href="/contact" className="hidden md:block">
                <Button as="span" variant="primary">Contact me</Button>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </div>
  </header>;
};

export default Header;
