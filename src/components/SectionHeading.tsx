import BurnDivider from "./BurnDivider";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
  light?: boolean; // true when section sits on an ivory background
};

export default function SectionHeading({
  eyebrow,
  title,
  align = "left",
  light = false,
}: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-4 ${alignment}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2
        className={`font-display text-3xl sm:text-4xl md:text-5xl ${
          light ? "text-ink" : "text-ivory"
        }`}
      >
        {title}
      </h2>
      <BurnDivider className={align === "center" ? "w-32" : "w-24"} />
    </div>
  );
}
