import { requireUserId } from "@/auth.server";
import { getAccounts } from "@/models/accounts.server";
import { AccountListPage } from "./account-list-page";
import { Metadata } from "next";
import { getTitle } from "@/utils";

export const metadata: Metadata = { title: getTitle("Accounts") };

export default async function Route() {
  const userId = await requireUserId();
  const accounts = await getAccounts(userId);
  return <AccountListPage accounts={accounts} />;
}
