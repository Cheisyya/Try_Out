import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "gold";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-60 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-navy-900 text-white shadow-[0_8px_20px_rgba(15,28,57,0.18)] hover:bg-navy-800 active:translate-y-px",
  secondary:
    "bg-navy-50 text-navy-800 hover:bg-navy-100 border border-navy-100",
  outline:
    "border border-navy-200 bg-white text-navy-800 hover:border-navy-300 hover:bg-navy-50",
  ghost: "text-navy-700 hover:bg-navy-50",
  gold: "bg-gold-400 text-navy-950 shadow-[0_8px_20px_rgba(200,149,58,0.28)] hover:bg-gold-300 active:translate-y-px",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return (
    <button className={buttonStyles({ variant, size, className })} {...props} />
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return (
    <Link className={buttonStyles({ variant, size, className })} {...props} />
  );
}
