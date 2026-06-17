import Image from "next/image";
import Link from "next/link";
import SectionHeading from "./SectionHeading";

type BrandStoryProps = {
  imageSrc: string;
  imageAlt?: string;
  reverse?: boolean;
};

export default function BrandStory({
  imageSrc,
  imageAlt = "Darwaish Perfumes",
  reverse = false,
}: BrandStoryProps) {
  return (
    <section className="py-20 px-6 lg:px-10 max-w-7xl mx-auto">
      <div
        className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
          reverse ? "lg:[direction:rtl]" : ""
        }`}
      >
        <div className="relative aspect-[4/5] w-full bg-ink-soft [direction:ltr]">
          <Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
        </div>

        <div className="flex flex-col gap-6 [direction:ltr]">
          <SectionHeading eyebrow="The House" title="Carried, not worn" />
          <p className="text-smoke-light font-body text-base leading-relaxed max-w-md">
            Darwaish takes its name from the wandering mystics who carried
            nothing but presence. Our fragrances follow the same idea: no
            shortcuts, no synthetic excess — just oud, attar, and ethically
            sourced ingredients blended at a concentration high enough to
            last from morning prayer to evening tea.
          </p>
          <Link
            href="/about"
            className="text-sm uppercase tracking-wide text-brass hover:text-brass-light transition-colors font-body w-fit border-b border-brass/40 pb-1"
          >
            Read our story
          </Link>
        </div>
      </div>
    </section>
  );
}
