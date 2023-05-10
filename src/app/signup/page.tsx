import { Button } from "@/components/button";
import { CurrencyCombobox } from "@/components/forms/currency-combobox";
import { LocaleCombobox } from "@/components/forms/locale-combobox";
import { LogoSmall } from "@/components/icons/logo-small";
import {
  getLocales,
  getLocalesWithDisplayName,
  getSuggestedCurrencyForLocale,
} from "@/locales.server";
import Link from "next/link";
import { pick } from "accept-language-parser";
import { headers } from "next/headers";

export default function Signup() {
  // const actionData = useActionData<typeof action>();
  const suggestedLocale = getSuggestedLocale();
  const suggestedCurrency =
    (suggestedLocale && getSuggestedCurrencyForLocale(suggestedLocale)) ||
    "USD";

  return (
    <div className=" w-full px-4 py-10">
      <form method="post" noValidate className="mx-auto flex max-w-sm flex-col">
        <Link href="/" aria-label="Home">
          <LogoSmall className="h-10 w-auto" />
        </Link>
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">
          Complete Signup
        </h2>
        <div className="mt-10 flex flex-col gap-4">
          <LocaleCombobox
            label="Currency and Date Format"
            name="preferredLocale"
            defaultValue={suggestedLocale}
            autoFocus={true}
            // error={actionData?.errors?.preferredLocale}
            locales={getLocalesWithDisplayName()}
          />

          <CurrencyCombobox
            label="Main Currency"
            name="refCurrency"
            defaultValue={suggestedCurrency}
            // error={actionData?.errors?.refCurrency}
          />
        </div>
        <Button type="submit" variant="primary" className="mt-10">
          Start Using Cashfolio
        </Button>
      </form>
    </div>
  );
}

function getSuggestedLocale() {
  const acceptLanguageHeader = headers().get("accept-language");
  if (!acceptLanguageHeader) return undefined;

  // TODO there seems to be an issue here: for a request with en-US in the accepted languages, en-Dsrt-US is picked, although en-US is also supported
  return pick(getLocales(), acceptLanguageHeader) || undefined;
}
