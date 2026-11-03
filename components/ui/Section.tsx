import { cn } from "@/lib/utils";

export type Surface = "obsidian" | "graphite" | "bone" | "molten";

const surfaceClass: Record<Surface, string> = {
  obsidian: "surface-dark bg-obsidian text-white",
  graphite: "surface-dark bg-graphite text-white",
  bone: "surface-bone bg-bone text-ink",
  molten: "surface-dark bg-obsidian text-white",
};

type Props = React.HTMLAttributes<HTMLElement> & {
  surface: Surface;
  as?: "section" | "div" | "footer" | "header";
  /** Skip the default vertical padding. */
  flush?: boolean;
};

/** A full-width band with one of the four surfaces. Neighbouring sections must differ. */
export function Section({ surface, as: Tag = "section", flush, className, children, ...rest }: Props) {
  return (
    <Tag
      data-surface={surface}
      className={cn("relative", surfaceClass[surface], !flush && "section-pad", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
