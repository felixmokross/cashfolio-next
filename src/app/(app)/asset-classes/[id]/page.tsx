import { requireUserId } from "@/auth.server";
import { Button } from "@/components/button";
import { Input } from "@/components/forms/input";
import {
  assetClassExists,
  getAssetClass,
  updateAssetClass,
} from "@/models/asset-classes.server";
import { redirect } from "next/navigation";
import invariant from "tiny-invariant";

export default async function EditAssetClassPage({
  params,
}: {
  params: { id: string };
}) {
  const userId = await requireUserId();

  const assetClass = await getAssetClass(params.id, userId);
  if (!assetClass) throw new Response("Not found", { status: 404 });

  return (
    <form action={submit}>
      <input type="hidden" name="id" value={assetClass.id} />
      <Input name="name" label="Name" defaultValue={assetClass.name} />
      <Button type="submit">Update</Button>
    </form>
  );
}

async function submit(formData: FormData) {
  "use server";
  const userId = await requireUserId();
  const id = formData.get("id");
  let name = formData.get("name");

  invariant(typeof id === "string", "id must be a string!");

  if (!(await assetClassExists(id, userId))) {
    throw new Response("Not found", { status: 404 });
  }

  invariant(typeof name === "string", "name must be a string!");

  name = name.trim();

  await updateAssetClass(id, userId, { name });

  redirect("/asset-classes");
}
