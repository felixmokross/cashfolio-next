import { cn } from "@/components/classnames";
import type { AccountCardProps } from "./account-card";
import { AccountCard } from "./account-card";

export type AccountListProps = {
  className?: string;
  accounts: Omit<AccountCardProps, "refCurrency">[];
};

export function AccountList({ className, accounts }: AccountListProps) {
  return (
    <ul className={cn("flex flex-col gap-4 sm:grid sm:grid-cols-2", className)}>
      {accounts.map((a) => (
        <li key={a.account.slug}>
          <AccountCard
            account={a.account}
            balance={a.balance}
            balanceInRefCurrency={a.balanceInRefCurrency}
          />
        </li>
      ))}
    </ul>
  );
}
