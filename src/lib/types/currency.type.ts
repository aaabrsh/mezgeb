import type { CurrencyFormData } from "@/schemas/currency.schema";
import type { Currency } from "@prisma-generated/client";
import type {
  ActionFailureSimple,
  ActionSuccess,
  ActionValidationFailure,
} from "@/types/action-result.type";

export type CreateCurrencyActionSuccess = ActionSuccess<{ currency: Currency }>;

export type CreateCurrencyActionFail = ActionValidationFailure<
  keyof CurrencyFormData
>;

export type UpdateCurrencyActionSuccess = ActionSuccess<{ currency: Currency }>;

export type UpdateCurrencyActionFail = ActionValidationFailure<
  keyof CurrencyFormData
>;

export type DeleteCurrencyActionSuccess = ActionSuccess;

export type DeleteCurrencyActionFail = ActionFailureSimple;
