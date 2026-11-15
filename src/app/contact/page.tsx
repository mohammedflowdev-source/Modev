"use client";

import Button from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setErrorMessage("");

    startTransition(async () => {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || "Failed to send message.");
        }

        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } catch (err: unknown) {
        setStatus("error");
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred. Please try again."
        );
      }
    });
  };

  return (
    <div className="min-h-screen bg-stone-200 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col justify-between selection:bg-red-orange-500 selection:text-white transition-colors duration-500">
      {/* Top Header / Navigation */}
      <header className="fixed top-0 left-0 w-full backdrop-blur-md z-40">
        <div className="container !max-w-full">
          <div className="flex justify-between h-20 items-center">
            <Link href="/">
              <span className="text-xl font-bold uppercase tracking-wider">
                Mo&nbsp; Dev.
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/">
                <Button
                  variant="secondary"
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
                  Back to Home
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <div className="grid md:grid-cols-2 gap-10">
              {/* Name Field */}
              <div className="relative group border-b border-stone-400 dark:border-stone-700 border-dotted focus-within:border-red-orange-500 dark:focus-within:border-red-orange-500 transition-colors duration-300 pb-2">
                <label
                  htmlFor="name"
                  className="block text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold mb-2 group-focus-within:text-red-orange-500 transition-colors"
                >
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Alex Morgan"
                  className="w-full bg-transparent text-xl md:text-2xl font-light outline-none placeholder:text-stone-400 dark:placeholder:text-stone-600 text-stone-900 dark:text-stone-100"
                />
              </div>

              {/* Email Field */}
              <div className="relative group border-b border-stone-400 dark:border-stone-700 border-dotted focus-within:border-red-orange-500 dark:focus-within:border-red-orange-500 transition-colors duration-300 pb-2">
                <label
                  htmlFor="email"
                  className="block text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold mb-2 group-focus-within:text-red-orange-500 transition-colors"
                >
                  Your Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@example.com"
                  className="w-full bg-transparent text-xl md:text-2xl font-light outline-none placeholder:text-stone-400 dark:placeholder:text-stone-600 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            {/* Subject Field */}
            <div className="relative group border-b border-stone-400 dark:border-stone-700 border-dotted focus-within:border-red-orange-500 dark:focus-within:border-red-orange-500 transition-colors duration-300 pb-2">
              <label
                htmlFor="subject"
                className="block text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold mb-2 group-focus-within:text-red-orange-500 transition-colors"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="New project inquiry / Website redesign"
                className="w-full bg-transparent text-xl md:text-2xl font-light outline-none placeholder:text-stone-400 dark:placeholder:text-stone-600 text-stone-900 dark:text-stone-100"
              />
            </div>

            {/* Message Field */}
            <div className="relative group border-b border-stone-400 dark:border-stone-700 border-dotted focus-within:border-red-orange-500 dark:focus-within:border-red-orange-500 transition-colors duration-300 pb-2">
              <label
                htmlFor="message"
                className="block text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold mb-2 group-focus-within:text-red-orange-500 transition-colors"
              >
                Your Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me a bit about your project, goals, and timeline..."
                className="w-full bg-transparent text-xl md:text-2xl font-light outline-none placeholder:text-stone-400 dark:placeholder:text-stone-600 text-stone-900 dark:text-stone-100 resize-none"
              />
            </div>

            {/* Feedback & Submission */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4">
              <Button
                variant="primary"
                type="submit"
                disabled={isPending}
                className="disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px] justify-center"
                iconAfter={
                  isPending ? (
                    <span className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin inline-block"></span>
                  ) : (
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
                        d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                      />
                    </svg>
                  )
                }
              >
                {isPending ? "Sending..." : "Send Message"}
              </Button>

              <AnimatePresence mode="wait">
                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-green-700 bg-green-100/60 border border-green-300 px-4 py-2.5 rounded-xl text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Message sent successfully! I will reply shortly.</span>
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-red-700 bg-red-100/60 border border-red-300 px-4 py-2.5 rounded-xl text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
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

