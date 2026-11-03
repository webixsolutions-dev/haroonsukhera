import Link from "next/link";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "glass" | "text" | "outline-light";

type Common = { variant?: ButtonVariant; className?: string; children: React.ReactNode };
type AsLink = Common & { href: string; external?: boolean } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | "className" | "children"
  >;
type AsButton = Common & { href?: undefined } & Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children"
  >;

/** Pill button. Labels say exactly what happens ("Send a message", "WhatsApp me"). */
export function Button(props: AsLink | AsButton) {
  const { variant = "primary", className, children } = props;
  const cls = cn("btn", `btn--${variant}`, className);

  if (props.href !== undefined) {
    const { href, external, variant: _v, className: _c, children: _ch, ...rest } = props as AsLink;
    void _v;
    void _c;
    void _ch;
    const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href);
    if (isExternal) {
      const newTab = /^https?:/.test(href);
      return (
        <a
          href={href}
          className={cls}
          {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  const { variant: _v, className: _c, children: _ch, type = "button", ...rest } = props as AsButton;
  void _v;
  void _c;
  void _ch;
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}
