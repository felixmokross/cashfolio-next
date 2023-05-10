"use client";

import { useMemo, useState } from "react";
import type { ComboboxProps } from "./combobox";
import { Combobox } from "./combobox";

export type LocaleComboboxProps = Omit<
  ComboboxProps,
  "options" | "onChange"
> & {
  defaultValue?: string;
  locales: [string, string][];
};

export function LocaleCombobox({
  locales,
  defaultValue,
  groupClassName,
  ...props
}: LocaleComboboxProps) {
  const [locale, setLocale] = useState(defaultValue);
  const formattingSamples = useMemo(
    () => [
      new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
        new Date()
      ),
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
      }).format(45_678.9),
    ],
    [locale]
  );

  return (
    <div className={groupClassName}>
      <Combobox
        {...props}
        defaultValue={defaultValue}
        options={locales.map(([locale, displayName]) => ({
          value: locale,
          primaryText: displayName,
          secondaryText: locale,
        }))}
        onChange={(value) => setLocale(value as string)}
      />
      <div className="mt-4 flex justify-center gap-3 text-xs text-slate-500">
        <div>{formattingSamples[0]}</div>
        <div>$ {formattingSamples[1]}</div>
      </div>
    </div>
  );
}
