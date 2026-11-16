"use client";

import Button from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import SignatureLogo from "@/components/SignatureLogo";
import { motion } from "motion/react";
import WhatsAppIcon, { whatsappHref } from "@/components/WhatsAppIcon";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-stone-200 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col justify-between selection:bg-red-orange-500 selection:text-white transition-colors duration-500">
      {/* Top Header / Navigation */}
      <header className="fixed top-0 left-0 w-full backdrop-blur-md z-40">
        <div className="container !max-w-full">
          <div className="flex justify-between h-20 items-center">
            <Link href="/" aria-label="Mo Dev — home">
              <SignatureLogo />
            </Link>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/" aria-label="Back to home">
                <Button
                  as="span"
                  variant="secondary"
                  className="max-md:size-11 max-md:px-0 max-md:gap-0 max-md:rounded-full max-md:justify-center"
                  iconAfter={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                      />
                    </svg>
                  }
                >
                  <span className="hidden md:inline">Back to Home</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container pt-36 pb-20 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Status availability badge */}
          <div className="flex items-center gap-3 mb-6">
            <div className="size-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="uppercase text-sm tracking-widest font-medium text-stone-600 dark:text-stone-400">
              One spot available for next month
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-tight">
            Let&apos;s make something <br className="hidden sm:inline" />
            <span className="text-red-orange-500 font-normal">great together.</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl font-light leading-relaxed">
            Have a project in mind, want to discuss a collaboration, or just want to say hi? Drop me a message below and I&apos;ll get back to you shortly.
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="mt-14"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <ContactForm />
        </motion.div>

        {/* WhatsApp alternative */}
        <motion.div
          className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-base md:text-lg text-stone-600 dark:text-stone-400"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <span>Prefer to chat?</span>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp (opens in a new tab)" className="text-stone-900 dark:text-stone-100">
            <Button as="span" variant="text" className="gap-0">
              <span className="inline-flex items-center gap-2"><WhatsAppIcon className="size-5" />Chat on WhatsApp</span>
            </Button>
          </a>
        </motion.div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-stone-300 dark:border-stone-800 py-8">
        <div className="container !max-w-full flex flex-col sm:flex-row justify-between items-center text-sm text-stone-500 dark:text-stone-400 gap-4">
          <p>Copyright &copy; Mo Dev &bull; All rights reserved</p>
          <a
            href="mailto:mohammedflow.dev@gmail.com"
            className="hover:text-red-orange-500 transition-colors"
          >
            mohammedflow.dev@gmail.com
          </a>
        </div>
      </footer>
    </div>
  );
}

