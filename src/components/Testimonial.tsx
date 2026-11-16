import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { HTMLAttributes, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { usePresence, motion, useInView } from "motion/react";
import useTextRevealAnimation from "@/hooks/useTextRevealAnimation";

export default function Testimoial(props: {
    quote: string;
    name: string;
    role: string;
    company: string;
    imagePositionY: number;
    image: string | StaticImport;
    className?: string
} & HTMLAttributes<HTMLDivElement>) {
    const { quote, name, role, company, imagePositionY, image, className, ...rest } = props


    const { scope: quoteScope, entranceAnimation: quoteEntranceAnimation, exitAnimation: quoteExitAnimation } = useTextRevealAnimation()

    const { scope: citeScope, entranceAnimation: citeEnteranceAnimation, exitAnimation: citeExitAnimation } = useTextRevealAnimation()
    const [isPresent, safeToRemove] = usePresence()

    // Phones (no hover): the photo turns to color while it is in view.
    const photoRef = useRef<HTMLDivElement>(null)
    const photoInView = useInView(photoRef, { amount: 0.6 })

    //const [quoteScope, quoteAnimate] = useAnimate()
    //const [citeScope, citeAnimate] = useAnimate()

    useEffect(() => {
        if (isPresent) {
            quoteEntranceAnimation().then(() => {
                citeEnteranceAnimation();
            });
        } else {
            Promise.all([
                quoteExitAnimation(),
                citeExitAnimation()
            ]).then(() => {
                safeToRemove();
            })
        }
    }, [isPresent, quoteEntranceAnimation, citeEnteranceAnimation, quoteEntranceAnimation, quoteExitAnimation, safeToRemove])


    return <>
        <div className={twMerge("group/testimonial grid md:grid-cols-5 md:gap-8 lg:gap-16 md:items-center", className)} {...rest}>
            <div ref={photoRef} className="aspect-square md:aspect-[9/16] md:col-span-2 relative overflow-hidden rounded-2xl isolate">
                <motion.div
                    className="absolute h-full bg-stone-900"
                    initial={{
                        width: '100%'
                    }}
                    animate={{ width: 0 }}
                    exit={{ width: '100%' }}
                    transition={{ duration: 0.5 }}
                >

                </motion.div>
                <Image src={image} alt={name} className={twMerge("size-full object-cover grayscale transition-[filter] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none [@media(hover:hover)]:group-hover/testimonial:grayscale-0", photoInView && "[@media(hover:none)]:grayscale-0")} style={{
                    objectPosition: `50% ${imagePositionY * 100}%`
                }} />
            </div>
            <blockquote className="md:col-span-3">
                <div className="text-3xl md:text-5xl lg:text-6xl tracking-[-0.03em] mt-8 md:mt-0" ref={quoteScope}>
                    <span>&ldquo;</span>
                    {quote}
                    <span>&rdquo;</span>
                </div>
                <cite className="mt-4 md:mt-8 not-italic text-xl block md:text-lg lg:text-xl" ref={citeScope}>{`${name}, ${role} at ${company}`}</cite>
            </blockquote>
        </div>
    </>
}