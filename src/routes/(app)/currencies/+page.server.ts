import { Routes } from "@/data/routes";
import {
  currencySchema,
  type CurrencyFormData,
} from "@/schemas/currency.schema";
import {
  createCurrency,
  deleteCurrency,
  getCurrenciesForUser,
  getCurrencyByCode,
  getCurrencyById,
  getGlobalCurrencies,
  updateCurrency,
} from "@/server/currency.server";
import type {
  CreateCurrencyActionFail,
  CreateCurrencyActionSuccess,
  DeleteCurrencyActionFail,
  DeleteCurrencyActionSuccess,
  UpdateCurrencyActionFail,
  UpdateCurrencyActionSuccess,
} from "@/types/currency.type.js";
import { schemaValidationError } from "@/utils/error-responses.util.js";
import {
  badRequestError,
  notFoundError,
  serverError,
  skipRedirectAndHttpErrors,
} from "@/utils/error-responses.util.js";
import { redirect, type Actions } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  const global_currencies = await getGlobalCurrencies();
  // since we have auth guard in layout, we can assume user is present
  const user_currencies = await getCurrenciesForUser(
    locals.user?.id || "",
    false,
  );
  return { global_currencies, user_currencies };
};

export const actions: Actions = {
  create: async ({
    request,
    locals,
  }): Promise<CreateCurrencyActionFail | CreateCurrencyActionSuccess> => {
    try {
      const data = await request.formData();
      const formData = Object.fromEntries(data);
      const parsed = currencySchema.safeParse(formData);
      const user = locals.user;

      if (!user) {
        return redirect(302, Routes.login);
      }

      if (!parsed.success) {
        return schemaValidationError<CurrencyFormData>(
          parsed.error,
          "Invalid currency data provided",
        );
      }

      const currency = parsed.data;

      // check if currency with same code exists for user
      const existing = await getCurrencyByCode(currency.code, user.id);
      if (existing) {
        return badRequestError({
          message: `Currency with code ${currency.code} already exists`,
        });
      }

      // create currency
      const newCurrency = await createCurrency(currency, user.id);
      return {
        message: "New currency added to your list.",
        success: true,
        data: { currency: newCurrency },
      };
    } catch (error) {
      skipRedirectAndHttpErrors(error);
      console.log("currency creation error: ", error);
      return serverError();
    }
  },

  update: async ({
    request,
    locals,
  }): Promise<UpdateCurrencyActionFail | UpdateCurrencyActionSuccess> => {
    try {
      const data = await request.formData();
      const formData = Object.fromEntries(data);
      const currencyId = formData.id as string;
      const parsed = currencySchema.safeParse(formData);
      const user = locals.user;

      if (!user) {
        return redirect(302, Routes.login);
      }

      if (!parsed.success) {
        return schemaValidationError<CurrencyFormData>(
          parsed.error,
          "Invalid currency data provided",
        );
      }

      const currency = parsed.data;

      // check if the currency exists
      const existing = await getCurrencyById(currencyId, user.id);
      if (!existing) {
        return notFoundError({ message: `Currency not found` });
      } else {
        // check if currency with same code exists for user
        const existing = await getCurrencyByCode(currency.code, user.id);
        if (existing && existing.id !== currencyId) {
          return badRequestError({
            message: `Currency with code '${currency.code}' already exists`,
          });
        }
      }

      // update currency
      const updatedCurrency = await updateCurrency(
        currencyId,
        currency,
        user.id,
      );

      return {
        message: "Your changes have been saved successfully.",
        success: true,
        data: { currency: updatedCurrency },
      };
    } catch (error) {
      skipRedirectAndHttpErrors(error);
      console.log("currency updation error: ", error);
      return serverError();
    }
  },

  delete: async ({
    request,
    locals,
  }): Promise<DeleteCurrencyActionSuccess | DeleteCurrencyActionFail> => {
    try {
      const data = await request.formData();
      const formData = Object.fromEntries(data);
      const currencyId = formData.id as string;
      const user = locals.user;

      if (!user) {
        return redirect(302, Routes.login);
      }

      await deleteCurrency(currencyId, user.id);
      return {
        message: "The currency has been removed from your list.",
        success: true,
      };
    } catch (error) {
      skipRedirectAndHttpErrors(error);
      console.log("currency deletion error: ", error);
      return serverError();
    }
  },
};
