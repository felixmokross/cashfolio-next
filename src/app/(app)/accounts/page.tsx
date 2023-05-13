import { requireUserId } from "@/auth.server";
import { getAccounts } from "@/models/accounts.server";
import { AccountListPage } from "./account-list-page";

export default async function Route() {
  const userId = await requireUserId();
  const accounts = await getAccounts(userId);
  return <AccountListPage accounts={accounts} />;
}
