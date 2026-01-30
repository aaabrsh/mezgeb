import type { AccountFormData } from "@/schemas/account.schema";
import type {
  ActionFailureSimple,
  ActionSuccess,
  ActionValidationFailure,
} from "@/types/action-result.type";
import type { Account, Currency } from "@prisma-generated/client";

export type CreateAccountActionSuccess = ActionSuccess<{ account: Account }>;

export type CreateAccountActionFail = ActionValidationFailure<
  keyof AccountFormData
>;

export type UpdateAccountActionSuccess = ActionSuccess<{ account: Account }>;

export type UpdateAccountActionFail = ActionValidationFailure<
  keyof AccountFormData
>;

export type DeleteAccountActionSuccess = ActionSuccess;

export type DeleteAccountActionFail = ActionFailureSimple;

export type AccountWithCurrency = Account & {
  balance: number;
  currency: Currency;
};
