import { useId, useState } from "react";
import { RadioGroup as HeadlessRadioGroup } from "@headlessui/react";
import { labelClassName } from "./label";
import { ErrorMessage } from "./error-message";
import { cn } from "../classnames";

export function RadioGroup<TValue extends string | undefined>({
  groupClassName,
  label,
  name,
  error,
  onChange,
  defaultValue,
  options,
  disabled = false,
}: RadioGroupProps<TValue>) {
  const [value, setValue] = useState(defaultValue);
  const errorId = `radio-group-error-${useId()}`;
  return (
    <HeadlessRadioGroup
      value={value}
      onChange={(value) => {
        setValue(value);
        onChange && onChange(value as TValue);
      }}
      className={groupClassName}
      name={name}
      aria-invalid={error ? "true" : undefined}
      aria-describedby={error ? errorId : undefined}
      disabled={disabled}
    >
      <HeadlessRadioGroup.Label className={labelClassName}>
        {label}
      </HeadlessRadioGroup.Label>
      <div className="mt-1 grid grid-cols-2 gap-x-3">
        {options.map((option) => (
          <HeadlessRadioGroup.Option
            key={option.value}
            value={option.value}
            className={({ active, checked }) =>
              cn(
                "focus:outline-none",
                active ? "ring-2 ring-sky-500 ring-offset-2" : "",
                checked
                  ? "border-transparent bg-sky-600 text-white"
                  : "border-slate-200 bg-white text-slate-900",
                "flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium sm:flex-1",
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                !disabled && checked && "hover:bg-sky-700",
                !disabled && !checked && "hover:bg-slate-50"
              )
            }
          >
            <HeadlessRadioGroup.Label as="span">
              {option.label}
            </HeadlessRadioGroup.Label>
          </HeadlessRadioGroup.Option>
        ))}
      </div>
      <ErrorMessage error={error} errorId={errorId} />
    </HeadlessRadioGroup>
  );
}

export type RadioGroupProps<TValue extends string | undefined> = {
  groupClassName?: string;
  label: string;
  name: string;
  error?: string;
  defaultValue?: string;
  onChange?: (value: TValue) => void;
  options: { label: string; value: TValue }[];
  disabled?: boolean;
};
