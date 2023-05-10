"use client";

import type { DetailedHTMLProps } from "react";
import { useId, useState } from "react";
import { Combobox as HeadlessCombobox } from "@headlessui/react";
import { labelClassName } from "./label";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { cn } from "../classnames";
import { ErrorMessage } from "./error-message";

export function Combobox({
  groupClassName,
  label,
  name,
  error,
  defaultValue,
  options,
  autoFocus,
  onChange,
  disabled,
}: ComboboxProps) {
  const [value, setValue] = useState(defaultValue || "");
  const [query, setQuery] = useState("");
  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) => {
          const queryTokens = query
            .split(/[^a-zA-Z0-9]/)
            .map((t) => t.toLowerCase().trim());

          const normalizedTexts = [option.primaryText, option.secondaryText]
            .flatMap((t) =>
              t?.split(/[^a-zA-Z0-9]/).map((tk) => tk.toLowerCase().trim())
            )
            .filter((t) => !!t) as string[];

          return queryTokens.every((token) =>
            normalizedTexts.some((text) => text.startsWith(token))
          );
        });

  const errorId = `combobox-error-${useId()}`;
  return (
    <HeadlessCombobox
      as="div"
      value={value}
      onChange={(v) => {
        setValue(v);
        onChange && onChange(v);
      }}
      name={name}
      className={groupClassName}
      disabled={disabled}
    >
      <HeadlessCombobox.Label className={labelClassName}>
        {label}
      </HeadlessCombobox.Label>
      <div className="relative mt-1">
        <HeadlessCombobox.Input
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50 sm:text-sm"
          displayValue={getDisplayName}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          autoFocus={autoFocus}
        />
        <HeadlessCombobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50">
          <ChevronUpDownIcon
            className="h-5 w-5 text-slate-400"
            aria-hidden="true"
          />
        </HeadlessCombobox.Button>
        {filteredOptions.length > 0 && (
          <HeadlessCombobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.map((option) => (
              <HeadlessCombobox.Option
                key={option.value}
                value={option.value}
                className={({ active }) =>
                  cn(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-sky-600 text-white" : "text-slate-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex">
                      <span
                        className={cn("truncate", selected && "font-semibold")}
                      >
                        {option.primaryText}
                      </span>
                      {option.secondaryText && (
                        <span
                          className={cn(
                            "ml-2 truncate",
                            active ? "text-sky-100" : "text-slate-500"
                          )}
                        >
                          {option.secondaryText}
                        </span>
                      )}
                    </div>

                    {selected && (
                      <span
                        className={cn(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-sky-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </HeadlessCombobox.Option>
            ))}
          </HeadlessCombobox.Options>
        )}
      </div>
      <ErrorMessage error={error} errorId={errorId} />
    </HeadlessCombobox>
  );

  function getDisplayName(v: string) {
    if (!v) return "";

    const option = options.find((o) => o.value === v);

    if (!option) return v;
    if (!option.secondaryText) return option.primaryText;

    return `${option.primaryText} (${option.secondaryText})`;
  }
}

export type ComboboxProps = {
  groupClassName?: string;
  label: string;
  name: string;
  error?: string;
  options: ComboboxOption[];
  onChange?: (value: string | number | readonly string[]) => void;
} & Pick<
  DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  "defaultValue" | "autoFocus" | "disabled"
>;

export type ComboboxOption = {
  primaryText: string;
  secondaryText?: string;
  value: string;
};
