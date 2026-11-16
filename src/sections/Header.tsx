"use client"
import Button from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";
import { useSmoothScroll } from "@/components/SmoothScroll";
import { FC, MouseEvent, useEffect, useState } from "react";
import { motion, useAnimate } from "motion/react"

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const navItems = [
  {
    label: "About",
    href: "#intro",
  },
  {
    label: "Selected Works",
    href: "#projects",
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
          <a href={href} key={label} className="text-stone-200 border-t last:border-b border-stone-800 py-8 group/nav-item relative isolate" onClick={handleClickMobileNavItem}>
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
    </div>
    <div className="fixed top-0 left-0 w-full backdrop-blur-md z-10 pointer-events-none" data-navbar style={{ height: "calc(5rem + env(safe-area-inset-top))", maskImage: "linear-gradient(to bottom, #000 60%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, #000 60%, transparent)" }} aria-hidden="true" />
    <div className="fixed top-0 left-0 w-full mix-blend-difference z-10" style={{ paddingTop: "env(safe-area-inset-top)" }}>
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
            <ThemeToggle />
            <div className="size-11 border border-stone-400 dark:border-stone-600 bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors" onClick={() => setIsOpen(!isOpen)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.rect x="3" y="7" width="18" height="2" fill="currentColor" ref={topLineScope} style={{
                  transformOrigin: `12px 8px`,
                }} />
                <motion.rect x="3" y="15" width="18" height="2" fill="currentColor" ref={bottomLineScope} style={{
                  transformOrigin: `12px 16px`,
                }} />
              </svg>
            </div>
            <a href="/contact">
            <Button variant="primary" className="hidden md:inline-flex">Contact me</Button>
          </a>
          </div>
        </div>
      </div>
    </div>
  </header>;
};

export default Header;
