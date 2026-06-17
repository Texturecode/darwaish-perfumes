import Link from "next/link";

/**
 * Hero — the page's thesis. A still product shot anchors the frame; the
 * "smoke" is a slow, CSS-only ambient blur drifting behind the headline,
 * referencing incense rising rather than a generic gradient glow.
 * Replace the placeholder div with your hero photography (next/image).
 */
export default function Hero() {
    return (
        <section className="relative h-70 md:h-[85vh] md:min-h-140 w-full overflow-hidden bg-black">
            {/* Ambient smoke layers — desaturated brass/oxblood, not bright */}
            <div
                    aria-hidden
                    className="absolute inset-0 animate-smoke-drift opacity-40"
                    style={{
                        background:
                            "radial-gradient(ellipse 60% 50% at 30% 40%, rgba(184,146,60,0.25), transparent 60%), radial-gradient(ellipse 50% 60% at 75% 65%, rgba(92,26,26,0.3), transparent 65%)",
                    }}
                />

            {/* Replace this with your actual hero product photography */}
            {/* <div className="" /> */}
            <div className="absolute inset-0 h-full w-full">
                <img
                    src="/hero.PNG"
                    alt="Hero Product"
                    className="absolute inset-0 w-full h-full object-contain"
                />
            </div>
            <div className=" z-10 h-full max-w-7xl mx-auto px-6 lg:px-10 flex flex-col justify-center">
                {/* <span className="eyebrow mb-6">Est. in Pakistan — Oud &amp; Attar Tradition</span>
                <h1 className="font-display italic text-5xl sm:text-6xl lg:text-7xl text-ivory max-w-2xl leading-[1.1]">
                    A scent is a wandering thing.
                </h1>
                <p className="mt-6 max-w-md text-smoke-light text-base sm:text-lg font-body">
                    Darwaish carries fragrance the way smoke carries a prayer — slowly,
                    honestly, until it lingers longer than the room remembers it.
                </p> */}
                <div className="hidden md:absolute right-60 bottom-30 md:flex gap-5">
                    <Link
                        href="/shop"
                        className="px-8 py-3 bg-brass text-ink font-body text-sm uppercase tracking-wide hover:bg-brass-light transition-colors duration-300"
                    >
                        Shop the Collection
                    </Link>
                    <Link
                        href="/about"
                        className="px-8 py-3 border border-brass/40 text-ivory font-body text-sm uppercase tracking-wide hover:border-brass hover:text-brass transition-colors duration-300"
                    >
                        Our Story
                    </Link>
                </div>
            </div>
        </section>
    );
}
