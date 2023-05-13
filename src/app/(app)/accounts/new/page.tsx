import { requireUserId } from "@/auth.server";
import { AccountFormFields } from "@/components/accounts";
import { Button } from "@/components/button";
import {
  createAccount,
  getAccountValues,
  validateAccountValues,
} from "@/models/accounts.server";
import { getAssetClasses } from "@/models/asset-classes.server";
import { getTitle } from "@/utils";
import { hasErrors } from "@/utils.server";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: getTitle("New Account") };

export default async function NewAccountPage() {
  const userId = await requireUserId();

  const loaderData = {
    assetClasses: (await getAssetClasses(userId)).map((assetClass) => ({
      ...assetClass,
      createdAt: assetClass.createdAt.toISOString(),
      updatedAt: assetClass.updatedAt.toISOString(),
    })),
  };

  return (
    <div className="flex justify-center">
      <form action={submit} className="flex max-w-lg flex-col gap-8 p-4">
        <div className="col-span-6 flex flex-col items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <PlusIcon className="h-6 w-6 text-emerald-600" />
          </span>
          <h2 className="text-lg font-medium text-slate-800">New Account</h2>
        </div>

        <AccountFormFields
          data={loaderData}
          // errors={actionData?.errors}
          // values={actionData?.values}
          disabled={false}
        />

        <div className="flex justify-end">
          <Button type="submit" variant="primary">
            Create
          </Button>
        </div>
      </form>
    </div>
  );
}

async function submit(formData: FormData) {
  "use server";
  const userId = await requireUserId();
  const values = await getAccountValues(formData);
  const errors = await validateAccountValues(userId, undefined, values);

  if (hasErrors(errors)) throw new Error("Invalid values");

  await createAccount(userId, values);

  redirect("/accounts");
}
