import { CurrencyType } from "@prisma-generated/enums";
import z from "zod";

export const currencySchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .max(5, "Please enter no more than 5 characters"),
  symbol: z
    .string()
    .max(3, "Please enter no more than 3 characters")
    .optional(),
  name: z.string().optional(),
  type: z.enum(
    [...Object.values(CurrencyType)],
    "Invalid currency type provided",
  ),
  precision: z.coerce
    .number()
    .nonnegative("Currency precision level can't be negative"),
});

export type CurrencyFormData = z.infer<typeof currencySchema>;
