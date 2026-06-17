"use client";

type QuantityStepperProps = {
  quantity: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
};

export default function QuantityStepper({
  quantity,
  onChange,
  min = 1,
  max = 10,
}: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center border border-brass/30">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className="w-10 h-11 flex items-center justify-center text-ivory hover:text-brass disabled:text-smoke disabled:cursor-not-allowed transition-colors"
      >
        −
      </button>
      <span className="w-10 h-11 flex items-center justify-center font-mono text-sm text-ivory border-x border-brass/30">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className="w-10 h-11 flex items-center justify-center text-ivory hover:text-brass disabled:text-smoke disabled:cursor-not-allowed transition-colors"
      >
        +
      </button>
    </div>
  );
}