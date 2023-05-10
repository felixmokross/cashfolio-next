"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { Ref, forwardRef } from "react";
import { cn } from "./classnames";

export type NavLinkProps = Omit<LinkProps, "className">;

export const NavLink = forwardRef(function NavLink(
  { href, ...props }: NavLinkProps,
  ref: Ref<HTMLAnchorElement>
) {
  const isActive = usePathname().startsWith(
    typeof href === "string" ? href : href.pathname || "/"
  );
  return (
    <Link
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
