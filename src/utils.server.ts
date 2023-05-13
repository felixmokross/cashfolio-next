import { Decimal } from "@prisma/client/runtime/library";

export function difference<T>(arrayA: T[], arrayB: T[]): T[] {
  const setB = new Set(arrayB);
  return arrayA.filter((x) => !setB.has(x));
}

export function parseDecimal(value: string) {
  return new Decimal(value);
}

export function isValidDecimal(value: string) {
  try {
    parseDecimal(value);
    return true;
  } catch {
    return false;
  }
}

export function parseDate(date: string) {
  return new Date(date);
}

export function isValidDate(date: string) {
  return !isNaN(parseDate(date).valueOf());
}

export function hasErrors(errors: object) {
  return Object.values(errors).length > 0;
}
