import type { CurrencyFormData } from "@/schemas/currency.schema";
import prisma from "@/server/prisma";
import type { Currency } from "@prisma/client";

export const getGlobalCurrencies = async (): Promise<Currency[]> => {
  return prisma.currency.findMany({
    where: { userId: null },
    orderBy: { abbrev: "asc" },
  });
};

export const getCurrenciesForUser = async (
  userId: string,
  include_global = true
): Promise<Currency[]> => {
  return prisma.currency.findMany({
    where: include_global ? { OR: [{ userId }, { userId: null }] } : { userId },
    orderBy: { updatedAt: "desc" },
  });
};

export const getCurrencyByAbbrev = async (
  abbrev: string,
  userId: string | null = null
): Promise<Currency | null> => {
  if (!userId)
    return prisma.currency.findFirst({
      where: { abbrev, userId: null },
    });
  else
    return prisma.currency.findUnique({
      where: { userId_abbrev: { abbrev, userId } },
    });
};

export const getCurrencyById = async (id: string): Promise<Currency | null> => {
  return prisma.currency.findUnique({
    where: { id },
  });
};

export const createCurrency = async (
  data: CurrencyFormData,
  userId: string
): Promise<Currency> => {
  return prisma.currency.create({
    data: { ...data, userId },
  });
};

export const updateCurrency = async (
  currencyId: string,
  data: CurrencyFormData,
  userId: string
): Promise<Currency> => {
  return prisma.currency.update({
    where: { id: currencyId, userId },
    data: { ...data },
  });
};

export const deleteCurrency = (
  id: string,
  userId: string
): Promise<Currency> => {
  return prisma.currency.delete({ where: { id, userId } });
};
