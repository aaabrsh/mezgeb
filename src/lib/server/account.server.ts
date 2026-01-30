import type { AccountFormData } from "@/schemas/account.schema";
import prisma from "@/server/prisma";
import { amountToDecimalUnit } from "@/utils/money.util";
import type { Account, Currency } from "@prisma-generated/client";

export const getAccountsForUser = async (
  userId: string,
): Promise<(Account & { currency: Currency })[]> => {
  return prisma.account.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { currency: true },
  });
};

export const getAccountByName = async (
  name: string,
  userId: string,
): Promise<Account | null> => {
  const res = await prisma.account.findUnique({
    where: { userId_name: { name, userId } },
  });
  return res ? formatAccount(res) : res;
};

export const getAccountById = async (
  id: string,
  userId: string,
): Promise<Account | null> => {
  return prisma.account.findUnique({ where: { id, userId } });
};

export const createAccount = async (
  data: AccountFormData,
  userId: string,
): Promise<Account> => {
  return prisma.account.create({ data: { ...data, userId } });
};

export const updateAccount = async (
  accountId: string,
  data: AccountFormData,
  userId: string,
): Promise<Account> => {
  return prisma.account.update({
    where: { id: accountId, userId },
    data,
  });
};

export const deleteAccount = async (
  id: string,
  userId: string,
): Promise<Account> => {
  return prisma.account.delete({ where: { id, userId } });
};

/**
 * format the balances of accounts into decimal
 */
export const formatAccounts = <T extends Account>(
  accounts: T[],
): (T & { balance: number })[] => accounts.map((acc) => formatAccount(acc));

/**
 * formats the balance of the account into decimal amount
 */
export const formatAccount = <T extends Account>(
  account: T,
): T & { balance: number } => {
  return {
    ...account,
    balance: amountToDecimalUnit(Number(account.balance || 0)),
  };
};
