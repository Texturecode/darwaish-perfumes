type Stat = {
  value: string;
  label: string;
};

const STATS: Stat[] = [
  { value: "20%+", label: "Oil concentration — extrait de parfum strength" },
  { value: "15-Day", label: "Returns and exchange window" },
  { value: "4.9 / 5", label: "Average rating across 1,200+ reviews" },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-brass/15 bg-ink-soft">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-2 text-center sm:text-left">
            <span className="font-display text-3xl text-brass">{stat.value}</span>
            <span className="text-xs text-smoke-light font-body leading-snug">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
