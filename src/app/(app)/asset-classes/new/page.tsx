import { requireUserId } from "@/auth.server";
import { Button } from "@/components/button";
import { Input } from "@/components/forms/input";
import { createAssetClass } from "@/models/asset-classes.server";
import { getTitle } from "@/utils";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import invariant from "tiny-invariant";

export const metadata: Metadata = { title: getTitle("New Asset Class") };

export default function NewAssetClassPage() {
  return (
    <form action={submit}>
      <Input name="name" label="Name" />
      <Button type="submit">Create</Button>
    </form>
  );
}

async function submit(formData: FormData) {
  "use server";
  const userId = await requireUserId();
  let name = formData.get("name");

  invariant(typeof name === "string", "name must be a string!");

  name = name.trim();

  await createAssetClass(userId, { name });

  redirect("/asset-classes");
}
