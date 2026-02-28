import { cn } from "@/lib/utils";

interface MaterialIconProps {
  icon: string;
  className?: string;
  outlined?: boolean;
}

export function MaterialIcon({ icon, className, outlined = false }: MaterialIconProps) {
  return (
    <span className={cn(
      outlined ? "material-symbols-outlined" : "material-icons",
      className
    )}>
      {icon}
    </span>
  );
}
