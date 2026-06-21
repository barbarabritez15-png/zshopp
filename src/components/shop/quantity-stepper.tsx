"use client";

import { Minus, Plus } from "lucide-react";
import { useT } from "@/lib/i18n/use-t";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantityStepperProps) {
  const { t } = useT();
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-slate-300 bg-white",
        className
      )}
    >
      <button
        type="button"
        aria-label={t("header.decreaseQty")}
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        className="grid h-9 w-9 place-items-center rounded-l-lg text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus size={15} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
          onChange(Number.isFinite(n) ? clamp(n) : min);
        }}
        className="h-9 w-10 border-x border-slate-200 bg-transparent text-center text-sm font-semibold outline-none focus:bg-slate-50"
        aria-label={t("header.quantity")}
      />
      <button
        type="button"
        aria-label={t("header.increaseQty")}
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        className="grid h-9 w-9 place-items-center rounded-r-lg text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
