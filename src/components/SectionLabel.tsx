import { twMerge } from "tailwind-merge";

/** Small editorial label shown above a section heading, e.g. "01 — Selected Works". */
export default function SectionLabel({ index, label, className }: { index: string; label: string; className?: string }) {
  return (
    <p className={twMerge("text-xs md:text-sm uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-6 md:mb-8", className)}>
      {index} &mdash; {label}
    </p>
  );
}
