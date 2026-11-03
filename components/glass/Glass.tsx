import { cn } from "@/lib/utils";

export type GlassVariant = "default" | "text" | "on-light" | "molten";

type Props = React.HTMLAttributes<HTMLElement> & {
  variant?: GlassVariant;
  as?: "div" | "section" | "article" | "aside" | "nav" | "form" | "li";
  /** Desktop-Chromium refraction. Never on panels with body text. */
  refract?: boolean;
};

/**
 * Liquid Glass panel (docs/03-design-system.md). Server component —
 * the pointer-follow highlight is driven by <GlassPointer /> mounted once in the layout.
 * Glass must always sit on something with colour (render, light field), never on a flat colour.
 */
export function Glass({ variant = "default", as: Tag = "div", refract, className, children, ...rest }: Props) {
  return (
    <Tag
      className={cn(
        "glass",
        variant === "text" && "glass--text",
        variant === "on-light" && "glass--on-light",
        variant === "molten" && "glass--molten",
        refract && variant !== "text" && "glass--refract",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
