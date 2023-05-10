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
import { safeRedirect } from "@/utils";
import { getSession } from "@/session.server";
import { createUser } from "@/models/users.server";
import { redirect } from "next/navigation";

export default function Signup({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const suggestedLocale = getSuggestedLocale();
  const suggestedCurrency =
    (suggestedLocale && getSuggestedCurrencyForLocale(suggestedLocale)) ||
    "USD";
  const redirectTo = searchParams["redirectTo"];

  return (
    <div className=" w-full px-4 py-10">
      <form
        action={submit}
        noValidate
        className="mx-auto flex max-w-sm flex-col"
      >
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
          <input type="hidden" value={redirectTo} />
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

async function submit(formData: FormData) {
  "use server";

  const preferredLocale = formData.get("preferredLocale");
  const refCurrency = formData.get("refCurrency");
  const redirectTo = safeRedirect(formData.get("redirectTo"));

  if (typeof preferredLocale !== "string" || preferredLocale.length === 0) {
    // TODO how can we return an error to the client?
    throw new Error("Preferred locale is required");
  }

  if (typeof refCurrency !== "string" || refCurrency.length === 0) {
    return new Error("Reference currency is required");
  }

  const session = await getSession();
  const userId = session.get("userId");

  await createUser({
    auth0UserId: userId,
    refCurrency,
    preferredLocale,
  });

  redirect(redirectTo);
}
