import { Disclosure } from "@headlessui/react";
import type { PropsWithChildren } from "react";
import { currenciesByCode } from "@/currencies";
import { getDisplayNameOfLocale } from "@/utils";
import { useUser } from "../user-context";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { NavLink, NavLinkProps } from "./nav-link";

export function MainMenu() {
  const user = useUser();
  return (
    <>
      <div className="space-y-1 pb-3 pt-2">
        <MainMenuLink href=".">Home</MainMenuLink>
        <MainMenuLink href="accounts">Accounts</MainMenuLink>
        <MainMenuLink href="asset-classes">Asset Classes</MainMenuLink>
      </div>
      <div className="border-t border-slate-200 pb-3 pt-4">
        <div className="flex items-center px-4">
          <div className="flex-shrink-0">
            <Image
              className="h-10 w-10 rounded-full"
              src={user.pictureUrl}
              alt="Profile"
            />
          </div>
          <div className="ml-3 flex-grow">
            <div className="text-base font-medium text-gray-800">
              {user.email}
            </div>
            <div className="text-sm font-medium text-gray-500">
              {getDisplayNameOfLocale(user.preferredLocale)} &middot;{" "}
              {currenciesByCode[user.refCurrency]}
            </div>
          </div>
          <div className="flex-shrink-0">
            <Disclosure.Button
              as={Link}
              className="text-slate-400 hover:text-slate-500"
              href="settings"
            >
              <span className="sr-only">Settings</span>
              <Cog6ToothIcon className="h-6 w-6" />
            </Disclosure.Button>
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <MainMenuLink href="logout">Log Out</MainMenuLink>
        </div>
      </div>
    </>
  );
}

type MainMenuLinkProps = PropsWithChildren<{ href: NavLinkProps["href"] }>;

function MainMenuLink({ href, children }: MainMenuLinkProps) {
  return (
    <Disclosure.Button as={NavLink} href={href}>
      {children}
    </Disclosure.Button>
  );
}
