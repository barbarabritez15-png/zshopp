"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src?: string;
  alt: string;
  name?: string;
  className?: string;
  imgClassName?: string;
}

/** Product image with a graceful gradient + initial fallback (for while
 *  images are still generating or if generation fails). */
export function ProductImage({
  src,
  alt,
  name,
  className,
  imgClassName,
}: ProductImageProps) {
  const [errored, setErrored] = useState(false);
  const initial = (name?.trim()?.charAt(0) || "?").toUpperCase();

  if (!src || errored) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100",
          className
        )}
        aria-label={alt}
      >
        <span className="select-none text-4xl font-black text-amber-600/70">
          {initial}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden bg-white", className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setErrored(true)}
        className={cn("h-full w-full object-contain", imgClassName)}
      />
    </div>
  );
}
