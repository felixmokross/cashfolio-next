import type { DetailedHTMLProps, LabelHTMLAttributes } from "react";
import { cn } from "../classnames";

export const labelClassName = "block text-sm font-medium text-slate-700";

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label {...props} className={cn(labelClassName, className)}>
      {children}
    </label>
  );
}

type LabelProps = DetailedHTMLProps<
  LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>;
