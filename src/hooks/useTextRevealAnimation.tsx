import { stagger } from "motion";
import { useAnimate } from "motion/react";
import { useEffect, useRef } from "react";
import SplitType from "split-type";

const useTextRevealAnimation = () => {
    const [scope, animate] = useAnimate()
    // Whether the words should currently be visible (set as soon as a reveal starts).
    const revealedRef = useRef(false)

    useEffect(() => {
        const split = new SplitType(scope.current, {
            types: "lines,words",
            tagName: "span"
        })

        // Re-split lines when the width changes (resize / phone rotation) so lines don't break.
        let lastWidth = window.innerWidth
        let timeout: ReturnType<typeof setTimeout> | undefined
        const handleResize = () => {
            if (window.innerWidth === lastWidth) return; // ignore iOS toolbar height changes
            lastWidth = window.innerWidth
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                split.split({})
                if (revealedRef.current) {
                    scope.current.querySelectorAll('.word').forEach((word: HTMLElement) => {
                        word.style.transform = 'translateY(0)'
                    })
                }
            }, 150)
        }

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
            clearTimeout(timeout)
        }
    }, [scope])

    const entranceAnimation = () => {
        revealedRef.current = true
        return animate(scope.current.querySelectorAll('.word'), {
            transform: 'translateY(0)'
        }, {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            delay: stagger(.04)
        })
    }

    const exitAnimation = () => {
        revealedRef.current = false
        return animate(scope.current.querySelectorAll('.word'), {
            transform: 'translateY(100%)'
        }, {
            duration: .3,
            delay: stagger(-.025, {
                startDelay: scope.current.querySelectorAll('.word').length * .025
            })
        })
    }

    return {
        scope,
        entranceAnimation,
        exitAnimation
    }
}

export default useTextRevealAnimation;
