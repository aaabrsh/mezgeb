import z from "zod";

export const currencySchema = z.object({
  abbrev: z
    .string()
    .min(1, "Abbreviation is required")
    .max(5, "Please enter no more than 5 characters"),
  symbol: z
    .string()
    .max(3, "Please enter no more than 3 characters")
    .optional(),
  name: z.string().optional(),
});

export type CurrencyFormData = z.infer<typeof currencySchema>;
