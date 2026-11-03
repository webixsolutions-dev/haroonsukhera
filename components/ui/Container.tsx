import { cn } from "@/lib/utils";

export function Container({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("container-site", className)} {...rest}>
      {children}
    </div>
  );
}
