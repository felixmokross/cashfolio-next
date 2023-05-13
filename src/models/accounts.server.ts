import type { Account } from "@prisma/client";
import { AccountType, AccountUnit } from "@prisma/client";
import slugify from "slugify";
import invariant from "tiny-invariant";
import type { FormErrors } from "@/components/forms/types";
import { prisma } from "@/prisma.server";
import {
  isValidDate,
  isValidDecimal,
  parseDate,
  parseDecimal,
} from "@/utils.server";

export async function getAccounts(userId: Account["userId"]) {
  return await prisma.account.findMany({ where: { userId } });
}

export async function getAccountId(
  slug: Account["slug"],
  userId: Account["userId"]
) {
  return (
    await prisma.account.findUnique({
      where: { slug_userId: { slug, userId } },
      select: { id: true },
    })
  )?.id;
}

export async function getAccount(
  slug: Account["slug"],
  userId: Account["userId"]
) {
  return await prisma.account.findUnique({
    where: { slug_userId: { slug, userId } },
  });
}

export async function createAccount(
  userId: Account["userId"],
  values: AccountValues
) {
  const trimmedName = values.name.trim();
  return await prisma.account.create({
    data: {
      name: trimmedName,
      type: values.type,
      assetClassId: values.assetClassId,
      unit: values.unit,
      currency: values.currency,
      preExisting: values.preExisting === "on",
      balanceAtStart: values.balanceAtStart
        ? parseDecimal(values.balanceAtStart)
        : null,
      openingDate: values.openingDate ? parseDate(values.openingDate) : null,
      slug: getAccountSlug(trimmedName),
      userId,
    },
  });
}

export async function updateAccount(
  id: Account["id"],
  userId: Account["userId"],
  values: AccountValues
) {
  const trimmedName = values.name.trim();
  return await prisma.account.update({
    where: { id_userId: { id, userId } },
    data: {
      name: trimmedName,
      type: values.type,
      assetClassId: values.assetClassId,
      unit: values.unit,
      currency: values.currency,
      preExisting: values.preExisting === "on",
      balanceAtStart: values.balanceAtStart
        ? parseDecimal(values.balanceAtStart)
        : null,
      openingDate: values.openingDate ? parseDate(values.openingDate) : null,
      slug: getAccountSlug(trimmedName),
    },
  });
}

function getAccountSlug(name: Account["name"]) {
  return slugify(name, { lower: true });
}

export type AccountValues = {
  name: string;
  type: AccountType;
  assetClassId: string | null;
  unit: AccountUnit;
  currency: string | null;
  preExisting: "on" | "off";
  balanceAtStart: string | null;
  openingDate: string | null;
};

export async function getAccountValues(
  formData: FormData
): Promise<AccountValues> {
  const name = formData.get("name");
  const type = formData.get("type");
  const assetClassId = formData.get("assetClassId");
  const unit = formData.get("unit");
  const currency = formData.get("currency");
  const preExisting = formData.get("preExisting");
  const balanceAtStart = formData.get("balanceAtStart");
  const openingDate = formData.get("openingDate");

  invariant(typeof name === "string", "name not found");
  invariant(typeof type === "string", "type not found");
  invariant(
    !assetClassId || typeof assetClassId === "string",
    "assetClassId not found"
  );
  invariant(typeof unit === "string", "unit not found");
  invariant(!currency || typeof currency === "string", "currency not found");
  invariant(
    preExisting === "off" || preExisting === "on",
    "preExisting not found"
  );
  invariant(
    !balanceAtStart || typeof balanceAtStart === "string",
    "balanceAtStart not found"
  );
  invariant(
    !openingDate || typeof openingDate === "string",
    "openingDate not found"
  );

  return {
    name,
    type: type as AccountType,
    assetClassId,
    unit: unit as AccountUnit,
    currency,
    preExisting,
    balanceAtStart,
    openingDate,
  };
}

export async function validateAccountValues(
  userId: Account["userId"],
  accountId: Account["id"] | undefined,
  {
    name,
    type,
    assetClassId,
    unit,
    currency,
    preExisting,
    balanceAtStart,
    openingDate,
  }: AccountValues
) {
  const errors: FormErrors<AccountValues> = {};

  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    errors.name = "Name is required";
  }

  const slug = getAccountSlug(trimmedName);
  const existingAccount = await prisma.account.findUnique({
    where: { slug_userId: { slug, userId } },
    select: { id: true },
  });

  if (existingAccount && (!accountId || accountId !== existingAccount.id)) {
    errors.name = "There is already an account with this name";
  }

  if (type.length === 0) {
    errors.type = "Type is required";
  }

  if (type === AccountType.ASSET && !assetClassId) {
    errors.assetClassId = "Asset class is required";
  }

  if (unit.length === 0) {
    errors.type = "Unit is required";
  }

  if (unit === AccountUnit.CURRENCY && !currency) {
    errors.currency = "Currency is required";
  }

  if (preExisting === "on") {
    if (!balanceAtStart) {
      errors.balanceAtStart = "Balance at start is required";
    } else if (!isValidDecimal(balanceAtStart)) {
      errors.balanceAtStart = "Balance at start must be a number";
    }
  } else {
    if (!openingDate) {
      errors.openingDate = "Opening date is required";
    } else if (!isValidDate(openingDate)) {
      errors.openingDate = "Opening date must be a date";
    }
  }

  return errors;
}
