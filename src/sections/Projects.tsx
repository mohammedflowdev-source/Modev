"use client";
import { createRef, FC, useMemo } from "react";
import StackCard, { useStackCards } from "@/components/StackCard";
import Image from "next/image";
import SectionLabel from "@/components/SectionLabel";
import freshcartDesktop from "@/assets/images/projects/freshcart-desktop.jpg";
import freshcartMobile from "@/assets/images/projects/freshcart-mobile.jpg";
import adasaDesktop from "@/assets/images/projects/adasa-desktop.jpg";
import adasaMobile from "@/assets/images/projects/adasa-mobile.jpg";

const projects = [
  {
    name: "FreshCart E-Commerce",
    description: "A full grocery store with product search, categories, brands, daily deals, wishlist, cart and Google/Facebook sign-in.",
    note: "Demo login: demo@freshcart.com / demo@123",
    year: "2026",
    tags: ["Next.js", "React", "Tailwind CSS"],
    desktopImage: freshcartDesktop,
    mobileImage: freshcartMobile,
    href: "https://e-commerce-pi-orpin-48.vercel.app/",
  },
  {
    name: "Adasa Photography Blog",
    description: "An Arabic-first photography blog with articles, categories and an English/Arabic switch.",
    note: undefined,
    year: "2026",
    tags: ["React", "Vite", "Tailwind CSS"],
    desktopImage: adasaDesktop,
    mobileImage: adasaMobile,
    href: "https://adasa-delta-rosy.vercel.app",
  },
];

const Projects: FC = () => {
  const stackCards = useStackCards()
  const cardRefs = useMemo(() => projects.map(() => createRef<HTMLDivElement>()), [])
  return <section className="section" id="projects">
    <div className="container">
      <SectionLabel index="03" label="Selected Works" />
      <h2 className="text-4xl md:text-7xl lg:text-8xl tracking-[-0.03em] leading-none">Selected works</h2>
      <div className="mt-10 md:mt-16 lg:mt-20 grid md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-16 md:gap-y-20">
        {projects.map(({ name, description, note, year, tags, desktopImage, mobileImage, href }, index) => (
          <StackCard key={name} cardRef={cardRefs[index]} nextRef={cardRefs[index + 1]} enabled={stackCards}>
          <a
            href={href}
            key={name}
            data-cursor="View"
            target="_blank"
            rel="noopener noreferrer"
            className="group/project block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-red-orange-500"
          >
            {/* Screenshots: desktop view with a phone view tucked into the corner */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-stone-300 dark:bg-stone-800 isolate">
              <Image
                src={desktopImage}
                alt={`${name} — desktop screenshot`}
                className="size-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/project:scale-105"
                sizes="(min-width: 768px) 50vw, 100vw"
                placeholder="blur"
              />
              <div className="absolute right-[6%] top-[38%] w-[22%] aspect-[390/844] overflow-hidden rounded-[0.9rem] md:rounded-[1.1rem] border-[3px] md:border-4 border-stone-900 shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/project:-translate-y-[4%]">
                <Image
                  src={mobileImage}
                  alt={`${name} — phone screenshot`}
                  className="size-full object-cover object-top"
                  sizes="(min-width: 768px) 12vw, 22vw"
                  placeholder="blur"
                />
              </div>
            </div>

            {/* Details */}
            <div className="mt-6 md:mt-8">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-2xl md:text-3xl lg:text-4xl tracking-[-0.02em]">{name}</h3>
                <div className="size-6 mt-1 md:mt-2 shrink-0 overflow-hidden">
                  <div className="h-6 w-12 flex group-hover/project:-translate-x-1/2 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-lg text-stone-600 dark:text-stone-400 max-w-xl">{description}</p>
              {note && <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">{note}</p>}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-xs md:text-sm uppercase tracking-widest text-stone-500 dark:text-stone-400 mr-2">{year}</span>
                {tags.map((tag) => (
                  <span key={tag} className="text-xs md:text-sm uppercase tracking-wider border border-stone-400 dark:border-stone-600 rounded-full px-3 py-1">{tag}</span>
                ))}
              </div>
            </div>
          </a>
          </StackCard>
        ))}
      </div>
    </div>
  </section>;
};

export default Projects;
