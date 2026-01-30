/**
 * Convert a decimal number (like 19.99) to integer cents
 * @param balance number with up to 2 decimals
 * @returns integer cents
 */
export const amountToCents = (balance: number) => Math.round(balance * 100);

/**
 * Convert integer cents to a decimal number (like 1999 -> 19.99)
 * @param balance integer
 * @returns decimal number
 */
export const amountToDecimalUnit = (balance: number): number => {
  return balance / 100;
};

/**
 * Format decimal balance into string
 * @param balance balance in decimals. example 19.99
 * @param currency currency abbreviation being used. example USD
 * @returns string with symbol + balance. example USD 19.99
 */
export const formatAmountToString = (
  balance: number,
  currency: string,
): string => {
  return `${currency} ${Intl.NumberFormat("en-US").format(balance)}`;
};
