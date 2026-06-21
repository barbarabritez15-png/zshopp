import { useMoney } from "@/lib/i18n/use-money";
import { cn } from "@/lib/utils";

interface PriceTagProps {
  price: number;
  compareAtPrice?: number | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
  xl: "text-3xl",
};

export function PriceTag({
  price,
  compareAtPrice,
  size = "md",
  className,
}: PriceTagProps) {
  const { format } = useMoney();
  const hasDeal = compareAtPrice != null && compareAtPrice > price;
  const off = hasDeal
    ? Math.round((1 - price / (compareAtPrice as number)) * 100)
    : 0;

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span className={cn("font-bold tracking-tight", sizeMap[size])}>
        {format(price)}
      </span>
      {hasDeal && (
        <>
          <span className="text-sm text-muted-foreground line-through">
            {format(compareAtPrice as number)}
          </span>
          <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-bold text-red-700">
            -{off}%
          </span>
        </>
      )}
    </div>
  );
}
