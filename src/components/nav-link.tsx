"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ElementType, Ref, forwardRef } from "react";
import { cn } from "./classnames";
import { PolymorphicComponentProps } from "@/utils";

export type NavLinkProps<T extends ElementType = typeof Link> =
  PolymorphicComponentProps<T>;

export const NavLink = forwardRef(function NavLink<
  T extends ElementType = typeof Link
>({ as, href, ...props }: NavLinkProps<T>, ref: Ref<HTMLAnchorElement>) {
  const Component = as || Link;
  const isActive = usePathname().startsWith(
    typeof href === "string" ? href : href.pathname || "/"
  );
  return (
    <Component
      href={href}
      {...props}
      className={cn(
        isActive
          ? "border-sky-500 bg-sky-50 text-sky-700"
          : "border-transparent text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800",
        "block border-l-4 py-2 pl-3 pr-4 text-base font-medium"
      )}
      ref={ref}
    />
  );
});
