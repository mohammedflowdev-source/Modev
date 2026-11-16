"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { usePageReady } from "@/lib/preloader";
import Button from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";
import SignatureLogo from "@/components/SignatureLogo";

const EASE = [0.22, 1, 0.36, 1] as const;

const arrowLeft = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

/** 404 page: same navbar as the other inner page (/contact), big "404" and a way back home. */
export default function NotFound() {
  // Entrance animations wait for the page-transition curtain (if any) to start lifting.
  const ready = usePageReady();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 w-full backdrop-blur-md z-40" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="container !max-w-full">
          <div className="flex justify-between h-20 items-center">
            <Link href="/" aria-label="Mo Dev — home">
              <SignatureLogo />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container flex-1 flex flex-col justify-center pt-32 pb-20">
        <p className="text-xs md:text-sm uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-6 md:mb-8">Error &mdash; Page not found</p>
        <motion.h1
          className="text-[9rem] md:text-[14rem] lg:text-[18rem] leading-[0.85] tracking-[-0.06em] text-red-orange-500"
          initial={{ opacity: 0, y: 40 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, ease: EASE }}
        >
          404
        </motion.h1>
        <motion.p
          className="mt-8 md:mt-10 text-2xl md:text-4xl tracking-[-0.02em] max-w-[24ch]"
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
        >
          This page wandered off. Let&apos;s get you back on track.
        </motion.p>
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
        >
          <Link href="/">
            <Button as="span" variant="primary" iconAfter={arrowLeft}>Back to home</Button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
