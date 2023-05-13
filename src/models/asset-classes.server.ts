import type { AssetClass } from "@prisma/client";
import { prisma } from "@/prisma.server";

export async function getAssetClasses(userId: AssetClass["userId"]) {
  return await prisma.assetClass.findMany({
    where: { userId },
  });
}

export async function assetClassExists(
  id: AssetClass["id"],
  userId: AssetClass["userId"]
) {
  return !!(await prisma.assetClass.findUnique({
    where: { id_userId: { id, userId } },
    select: { _count: true },
  }));
}

export async function getAssetClass(
  id: AssetClass["id"],
  userId: AssetClass["userId"]
) {
  return await prisma.assetClass.findUnique({
    where: { id_userId: { id, userId } },
  });
}

export async function createAssetClass(
  userId: AssetClass["userId"],
  { name }: Pick<AssetClass, "name">
) {
  name = name.trim();

  return await prisma.assetClass.create({
    data: {
      name,
      userId,
    },
  });
}

export async function updateAssetClass(
  id: AssetClass["id"],
  userId: AssetClass["userId"],
  { name }: Pick<AssetClass, "name">
) {
  name = name.trim();

  return await prisma.assetClass.update({
    where: { id_userId: { userId, id } },
    data: {
      name,
    },
  });
}
