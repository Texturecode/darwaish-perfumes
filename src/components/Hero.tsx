"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Hero — the page's thesis. A still product shot anchors the frame; the
 * "smoke" is a slow, CSS-only ambient blur drifting behind the headline,
 * referencing incense rising rather than a generic gradient glow.
 */
const slides = [
    { src: "/hero.PNG", alt: "Hero Product 1" },
    { src: "/hero2.PNG", alt: "Hero Product 2" },
];

export default function Hero() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = window.setInterval(
            () => setActiveIndex((current) => (current + 1) % slides.length),
            6000
        );
        return () => window.clearInterval(timer);
    }, []);

    return (
        <section className="relative left-1/2 right-1/2 w-screen max-w-none h-70 md:h-[85vh] md:min-h-140 overflow-hidden bg-black -translate-x-1/2">
            <div
                aria-hidden
                className="absolute inset-0 animate-smoke-drift opacity-40"
                style={{
                    background:
                        "radial-gradient(ellipse 60% 50% at 30% 40%, rgba(184,146,60,0.25), transparent 60%), radial-gradient(ellipse 50% 60% at 75% 65%, rgba(92,26,26,0.3), transparent 65%)",
                }}
            />

            <div className="absolute inset-0 h-full w-full">
                {slides.map((slide, index) => (
                    <div
                        key={slide.src}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === activeIndex ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <Image
                            src={slide.src}
                            alt={slide.alt}
                            fill
                            sizes="100vw"
                            style={{ objectFit: "contain", objectPosition: "center" }}
                            priority={index === 0}
                        />
                    </div>
                ))}
            </div>

            <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        aria-label={`Show slide ${index + 1}`}
                        className={`h-2.5 w-8 rounded-full transition-all duration-300 ${
                            index === activeIndex
                                ? "bg-ivory/90"
                                : "bg-ivory/40 hover:bg-ivory/70"
                        }`}
                        onClick={() => setActiveIndex(index)}
                    />
                ))}
            </div>
        </section>
    );
}
