import { requireUserId } from "@/auth.server";
import { Button } from "@/components/button";
import { getAssetClasses } from "@/models/asset-classes.server";
import { getTitle } from "@/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: getTitle("Asset Classes") };

export default async function AssetClassListPage() {
  const userId = await requireUserId();
  const assetClasses = await getAssetClasses(userId);
  return (
    <div className="h-screen bg-slate-50">
      <h2 className="mt-4 text-center text-lg font-medium text-slate-700">
        Asset Classes
      </h2>

      <Button as={Link} href="/asset-classes/new">
        New Asset Class
      </Button>

      <ul className="mt-4 space-y-4">
        {assetClasses.map((a) => (
          <li key={a.id}>
            <Link href={`./asset-classes/${a.id}`}>{a.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
