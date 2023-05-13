import { Disclosure } from "@headlessui/react";
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
        <Disclosure.Button as={NavLink} href=".">
          Home
        </Disclosure.Button>
        <Disclosure.Button as={NavLink} href="accounts">
          Accounts
        </Disclosure.Button>
        <Disclosure.Button as={NavLink} href="asset-classes">
          Asset Classes
        </Disclosure.Button>
      </div>
      <div className="border-t border-slate-200 pb-3 pt-4">
        <div className="flex items-center px-4">
          <div className="flex-shrink-0">
            <Image
              className="rounded-full"
              src={user.pictureUrl}
              alt="Profile"
              width={40}
              height={40}
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
          <Disclosure.Button as={AnchorNavLink} href="/logout">
            Log Out
          </Disclosure.Button>
        </div>
      </div>
    </>
  );
}

function AnchorNavLink(props: NavLinkProps) {
  return <NavLink as="a" {...props} />;
}
