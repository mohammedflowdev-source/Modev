import { twMerge } from "tailwind-merge";

export const SIGNATURE_ORANGE = "#E5683F";

/**
 * "Mo Dev" handwritten signature followed by a small orange dot.
 * `textClassName` / `dotClassName` let the navbar render two aligned copies: the text inside the
 * mix-blend-difference layer and the dot in a normal layer, so the dot stays orange everywhere.
 */
export default function SignatureLogo({ className, textClassName, dotClassName }: { className?: string; textClassName?: string; dotClassName?: string }) {
  return (
    // Nudged down a little: script capitals sit high, so this centres it optically in the bar
    <span className={twMerge("inline-flex items-baseline translate-y-[5px]", className)}>
      <span className={twMerge("font-signature text-[40px] md:text-[44px] leading-none antialiased", textClassName)}>Mo Dev</span>
      <span className={twMerge("ml-1 inline-block size-1.5 rounded-full", dotClassName)} style={{ backgroundColor: SIGNATURE_ORANGE }} />
    </span>
  );
}
