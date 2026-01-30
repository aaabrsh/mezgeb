import { amountToCents } from "@/utils/money.util";
import { AccountType } from "@prisma-generated/enums";
import z from "zod";

export const accountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  type: z.enum(
    [...Object.values(AccountType)],
    "Invalid account type provided",
  ),
  balance: z.coerce
    .number()
    .nonnegative("Account balance can't be negative")
    .max(
      100000000000, // 100,000,000,000
      "Account balance is too large. max limit is 100,000,000,000",
    )
    .transform((v) => amountToCents(v)),
  currencyId: z.cuid("invalid currency provided"),
  description: z.string().optional(),
});

export type AccountFormData = z.infer<typeof accountSchema>;
