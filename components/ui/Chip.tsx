import { cn } from "@/lib/utils";

export function Chip({
  className,
  light,
  children,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement> & { light?: boolean }) {
  return (
    <span className={cn("chip", light && "chip--light", className)} {...rest}>
      {children}
    </span>
  );
}
