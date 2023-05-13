import type { DetailedHTMLProps } from "react";
import { useId } from "react";
import { Label } from "./label";
import { ErrorMessage } from "./error-message";

export function Select({
  name,
  label,
  error,
  groupClassName,
  defaultValue,
  disabled,
  children,
}: SelectProps) {
  const id = `select-${useId()}`;
  const errorId = `select-error-${useId()}`;
  return (
    <div className={groupClassName}>
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={name}
        className="mt-1 block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-sky-500 focus:outline-none focus:ring-sky-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50 sm:text-sm"
        defaultValue={defaultValue}
        disabled={disabled}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
      >
        {children}
      </select>
      <ErrorMessage error={error} errorId={errorId} />
    </div>
  );
}

export type SelectProps = {
  name: string;
  label: string;
  error?: string;
  groupClassName?: string;
} & Pick<
  DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >,
  "defaultValue" | "disabled" | "children" | "ref"
>;
