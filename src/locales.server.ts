import { availableLocales } from "cldr-core/availableLocales.json";
import { defaultContent } from "cldr-core/defaultContent.json";
import { supplemental } from "cldr-core/supplemental/currencyData.json";
import { getDisplayNameOfLocale } from "./utils";

export function getLocales() {
  // Note that some locales might not be supported in the browser
  // In case that the user chooses such a locale, there might be differences in rendering between server and client
  // Consider to improve the user experience
  return Intl.NumberFormat.supportedLocalesOf(
    availableLocales.modern.concat(defaultContent)
  );
}

export function getLocalesWithDisplayName() {
  return getLocales()
    .map(
      (locale) => [locale, getDisplayNameOfLocale(locale)] as [string, string]
    )
    .sort((a, b) => a[1].localeCompare(b[1]));
}

export function getSuggestedCurrencyForLocale(locale: string) {
  const region = new Intl.Locale(locale).maximize().region;

  if (!region) return undefined;

  return supplemental.currencyData.region[
    region as keyof typeof supplemental.currencyData.region
  ]
    ?.flatMap((o) => Object.entries(o))
    .filter(([_, v]) => !v._to && v._tender !== "false")
    .map(([c]) => c)[0];
}
