import { requireUserId } from "@/auth.server";
import { AccountFormFields } from "@/components/accounts";
import { Button } from "@/components/button";
import {
  getAccount,
  getAccountValues,
  updateAccount,
  validateAccountValues,
} from "@/models/accounts.server";
import { getAssetClasses } from "@/models/asset-classes.server";
import { SerializeFrom } from "@/serialize";
import { hasErrors } from "@/utils.server";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Account } from "@prisma/client";
import { redirect } from "next/navigation";
import invariant from "tiny-invariant";

export default async function EditAccountPage({
  params,
}: {
  params: { slug: string };
}) {
  const userId = await requireUserId();
  const account = await getAccount(params.slug, userId);
  if (!account) throw new Response(null, { status: 404 });

  const loaderData = {
    assetClasses: (await getAssetClasses(userId)).map((assetClass) => ({
      ...assetClass,
      createdAt: assetClass.createdAt.toISOString(),
      updatedAt: assetClass.updatedAt.toISOString(),
    })),
    account: {
      ...account,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
      openingDate: account.openingDate?.toISOString(),
      closingDate: account.closingDate?.toISOString(),
      balanceAtStart: account.balanceAtStart?.toString(),
    } as SerializeFrom<Account>,
  };

  return (
    <div className="flex justify-center">
      <form action={submit} className="flex max-w-lg flex-col gap-8 p-4">
        <div className="col-span-6 flex flex-col items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <PencilIcon className="h-6 w-6 text-amber-600" />
          </span>
          <h2 className="text-lg font-medium text-slate-800">Edit Account</h2>
        </div>

        <AccountFormFields
          disabled={false}
          data={loaderData}
          // values={actionData?.values}
          // errors={actionData?.errors}
        />

        <div className="flex justify-end">
          <Button type="submit" variant="primary">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}

async function submit(formData: FormData) {
  "use server";
  const accountId = formData.get("accountId");
  invariant(typeof accountId === "string", "accountId must be a string!");

  const userId = await requireUserId();
  const values = await getAccountValues(formData);
  const errors = await validateAccountValues(userId, undefined, values);

  if (hasErrors(errors)) throw new Error("Invalid form data!");

  await updateAccount(accountId, userId, values);

  redirect("/accounts");
}
