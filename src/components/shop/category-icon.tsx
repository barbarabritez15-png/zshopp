import {
  Smartphone,
  Laptop,
  Home,
  Headphones,
  Watch,
  Gamepad2,
  Tag,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Smartphone,
  Laptop,
  Home,
  Headphones,
  Watch,
  Gamepad2,
};

export function CategoryIcon({
  name,
  className,
  size = 18,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Icon = MAP[name] ?? Tag;
  return <Icon size={size} className={className} />;
}
