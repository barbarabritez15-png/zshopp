import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: number;
  showNumber?: boolean;
  count?: number;
  className?: string;
}

export function StarRating({
  rating,
  size = 16,
  showNumber = false,
  count,
  className,
}: StarRatingProps) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  const width = size * 5 + 4; // 5 stars + small gap tolerance

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div
        className="relative inline-flex shrink-0"
        style={{ width, height: size }}
        aria-label={`${rating.toFixed(1)} out of 5 stars`}
      >
        <div className="flex gap-[1px] text-slate-200">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={size} fill="currentColor" strokeWidth={0} />
          ))}
        </div>
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${pct}%` }}
        >
          <div className="flex gap-[1px] text-amber-400" style={{ width }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={size} fill="currentColor" strokeWidth={0} />
            ))}
          </div>
        </div>
      </div>
      {showNumber && (
        <span className="text-sm text-muted-foreground">
          {rating.toFixed(1)}
          {count != null && (
            <span className="text-muted-foreground/70">
              {" "}
              ({count.toLocaleString()})
            </span>
          )}
        </span>
      )}
    </div>
  );
}
