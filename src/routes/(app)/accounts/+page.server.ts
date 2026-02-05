import { Routes } from "@/data/routes.js";
import {
  accountSchema,
  type AccountFormData,
} from "@/schemas/account.schema.js";
import {
  deleteAccount,
  formatAccounts,
  updateAccount,
} from "@/server/account.server.js";
import { getAccountById } from "@/server/account.server.js";
import {
  createAccount,
  getAccountByName,
  getAccountsForUser,
} from "@/server/account.server.js";
import { getCurrenciesForUser } from "@/server/currency.server.js";
import type {
  CreateAccountActionFail,
  CreateAccountActionSuccess,
  DeleteAccountActionFail,
  DeleteAccountActionSuccess,
  UpdateAccountActionFail,
  UpdateAccountActionSuccess,
} from "@/types/account.type.js";
import {
  notFoundError,
  schemaValidationError,
} from "@/utils/error-responses.util.js";
import {
  badRequestError,
  serverError,
  skipRedirectAndHttpErrors,
} from "@/utils/error-responses.util.js";
import { redirect, type Actions } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  const accounts = await getAccountsForUser(locals.user?.id || "");
  const currencies = await getCurrenciesForUser(locals.user?.id || "", true);

  return {
    accounts: formatAccounts(accounts),
    currencies,
  };
};

export const actions: Actions = {
  create: async ({
    request,
    locals,
  }): Promise<CreateAccountActionSuccess | CreateAccountActionFail> => {
    try {
      const data = await request.formData();
      const formData = Object.fromEntries(data);
      const parsed = accountSchema.safeParse(formData);
      const user = locals.user;

      if (!user) {
        return redirect(302, Routes.login);
      }

      if (!parsed.success) {
        return schemaValidationError<AccountFormData>(
          parsed.error,
          "Invalid account data provided",
        );
      }

      const account = parsed.data;

      // check for duplicate account for the same user
      const existing = await getAccountByName(account.name, user.id);
      if (existing) {
        return badRequestError({
          message: `Account with the name ${account.name} already exists`,
        });
      }

      // create account
      const newAccount = await createAccount(account, user.id);
      return {
        message: "New account created.",
        success: true,
        data: { account: newAccount },
      };
    } catch (error) {
      skipRedirectAndHttpErrors(error);
      console.log("account creation error: ", error);
      return serverError();
    }
  },

  update: async ({
    request,
    locals,
  }): Promise<UpdateAccountActionSuccess | UpdateAccountActionFail> => {
    try {
      const data = await request.formData();
      const formData = Object.fromEntries(data);
      const accountId = formData.id as string;
      const parsed = accountSchema.safeParse(formData);
      const user = locals.user;

      if (!user) {
        return redirect(302, Routes.login);
      }

      if (!parsed.success) {
        return schemaValidationError<AccountFormData>(
          parsed.error,
          "Invalid account data provided",
        );
      }

      const account = parsed.data;

      // check if the account exists
      const existing = await getAccountById(accountId, user.id);
      if (!existing) {
        return notFoundError({ message: `Account not found` });
      } else {
        // check if account with same name exists for user
        const existing = await getAccountByName(account.name, user.id);
        if (existing && existing.id !== accountId) {
          return badRequestError({
            message: `Account with the name ${account.name} already exists`,
          });
        }
      }

      // update account
      const updatedAccount = await updateAccount(accountId, account, user.id);

      return {
        message: "Your changes have been saved successfully.",
        success: true,
        data: { account: updatedAccount },
      };
    } catch (error) {
      skipRedirectAndHttpErrors(error);
      console.log("Account updation error: ", error);
      return serverError();
    }
  },

  delete: async ({
    request,
    locals,
  }): Promise<DeleteAccountActionSuccess | DeleteAccountActionFail> => {
    try {
      const data = await request.formData();
      const formData = Object.fromEntries(data);
      const accountId = formData.id as string;
      const user = locals.user;

      if (!user) return redirect(302, Routes.login);

      await deleteAccount(accountId, user.id);
      return {
        message: "The account has been delete successfully",
        success: true,
      };
    } catch (error) {
      skipRedirectAndHttpErrors(error);
      console.log("Account deletion error: ", error);
      return serverError();
    }
  },
};
