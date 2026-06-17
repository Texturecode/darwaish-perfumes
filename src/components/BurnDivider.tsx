"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A thin gold rule that tapers to nothing at both ends (like a wisp of
 * smoke) and "burns in" — draws itself left to right — the first time it
 * scrolls into view. This is the page's one recurring signature motion;
 * everything else on the page stays still.
 */
export default function BurnDivider({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div
        className={`hairline-burn ${visible ? "animate-burn-in" : "w-0 opacity-0"}`}
      />
    </div>
  );
}
