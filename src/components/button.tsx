import type { ElementType, PropsWithChildren } from "react";
import type { PolymorphicComponentProps } from "@/utils";
import { cn } from "./classnames";
import type { IconComponentType } from "./icons/types";

function buttonClassName(variant: ButtonVariant = "secondary") {
  return {
    button: cn(
      "inline-flex items-center gap-1.5 justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto",
      {
        "border-transparent bg-sky-600 text-white hover:bg-sky-700 disabled:bg-sky-600":
          variant === "primary",
        "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:bg-white":
          variant === "secondary",
      }
    ),
    icon: cn("-ml-1.5 h-4 w-4", {
      "text-white": variant === "primary",
      "text-slate-600": variant === "secondary",
    }),
  };
}

export function Button<T extends ElementType>({
  as,
  variant = "secondary",
  children,
  className,
  icon,
  ...props
}: ButtonProps<T>) {
  const Component = as || "button";
  const Icon = icon;

  const classNames = buttonClassName(variant);
  return (
    <Component
      className={cn(classNames.button, className)}
      {...(Component === "button" ? { type: "button" } : {})}
      {...props}
    >
      {Icon && <Icon className={classNames.icon} />}
      {children}
    </Component>
  );
}

export type ButtonProps<T extends ElementType> = PropsWithChildren<
  PolymorphicComponentProps<T> & {
    variant?: ButtonVariant;
    icon?: IconComponentType;
  }
>;

type ButtonVariant = "primary" | "secondary";
