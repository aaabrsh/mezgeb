import type { CurrencyFormData } from "@/schemas/currency.schema";
import type { Currency } from "@prisma/client";
import type { ActionFailure } from "@sveltejs/kit";

export interface CreateCurrencyActionSuccess {
  message: string;
  currency: Currency;
}

export type CreateCurrencyActionFail = ActionFailure<{
  message: string;
  errors?: Partial<Record<keyof CurrencyFormData, string[]>>;
}>;

export interface UpdateCurrencyActionSuccess
  extends CreateCurrencyActionSuccess {}

export interface UpdateCurrencyActionFail extends CreateCurrencyActionFail {}
