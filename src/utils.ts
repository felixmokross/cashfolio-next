import type { ComponentPropsWithoutRef, ElementType } from "react";
import invariant from "tiny-invariant";

const localeDisplayNames = new Intl.DisplayNames("en", {
  type: "language",
  languageDisplay: "standard",
});

export function getDisplayNameOfLocale(locale: string) {
  return localeDisplayNames.of(locale);
}

export function getNumberFormatSymbols(locale: string) {
  const numberFormat = new Intl.NumberFormat(locale);

  const thousandSeparator = numberFormat
    .formatToParts(10_000)
    .find((x) => x.type === "group")?.value;
  const decimalSeparator = numberFormat
    .formatToParts(1.1)
    .find((x) => x.type === "decimal")?.value;

  invariant(
    decimalSeparator,
    `decimalSeparator not found for locale ${locale}`
  );

  return { thousandSeparator, decimalSeparator };
}

export type PolymorphicComponentProps<T extends ElementType> = {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

export function getTitle(pageTitle: string) {
  return `${pageTitle} · Cashfolio`;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  invariant(process.env.BASE_URL, "BASE_URL must be set");

  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith(`${process.env.BASE_URL}/`)) {
    return defaultRedirect;
  }

  return to;
}
