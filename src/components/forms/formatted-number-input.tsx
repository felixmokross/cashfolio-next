"use client";

import type { NumericFormatProps } from "react-number-format";
import { NumericFormat } from "react-number-format";
import type { InputProps } from "./input";
import { Input } from "./input";
import { useMemo, useState } from "react";
import { useUser } from "../user-context";
import { getNumberFormatSymbols } from "../../utils";

export type FormattedNumberInputProps = NumericFormatProps<InputProps>;

export function FormattedNumberInput({
  name,
  defaultValue,
  ...props
}: FormattedNumberInputProps) {
  const [value, setValue] = useState<number | undefined>(
    defaultValue != null ? Number(defaultValue) : undefined
  );

  const { preferredLocale } = useUser();
  const { thousandSeparator, decimalSeparator } = useMemo(
    () => getNumberFormatSymbols(preferredLocale),
    [preferredLocale]
  );

  return (
    <>
      <NumericFormat
        {...props}
        valueIsNumericString={true}
        defaultValue={defaultValue}
        onValueChange={({ floatValue }) => setValue(floatValue)}
        thousandSeparator={thousandSeparator}
        decimalSeparator={decimalSeparator}
        customInput={Input}
      />
      <input name={name} value={value} type="hidden" />
    </>
  );
}
