import { Routes } from "@/data/routes";
import { currencySchema } from "@/schemas/currency.schema";
import {
  createCurrency,
  deleteCurrency,
  getCurrenciesForUser,
  getCurrencyByAbbrev,
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
import {
  badRequestError,
  notFoundError,
  serverError,
  skipRedirectAndHttpErrors,
} from "@/utils/error-responses.js";
import { redirect, type Actions } from "@sveltejs/kit";
import z from "zod";

export const load = async ({ locals }) => {
  const global_currencies = await getGlobalCurrencies();
  // since we have auth guard in layout, we can assume user is present
  const user_currencies = await getCurrenciesForUser(
    locals.user?.id || "",
    false
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
        const errors = z.flattenError(parsed.error);
        return badRequestError({
          message: "Invalid currency data provided",
          errors: errors.fieldErrors,
        });
      }

      const currency = parsed.data;

      // check if currency with same abbrev exists for user
      const existing = await getCurrencyByAbbrev(currency.abbrev, user.id);
      if (existing) {
        return badRequestError({
          message: `Currency with abbreviation ${currency.abbrev} already exists`,
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
        const errors = z.flattenError(parsed.error);
        return badRequestError({
          message: "Invalid currency data provided",
          errors: errors.fieldErrors,
        });
      }

      const currency = parsed.data;

      // check if the currency exists
      const existing = await getCurrencyById(currencyId);
      if (!existing) {
        return notFoundError({ message: `Currency not found` });
      } else {
        // check if currency with same abbrev exists for user
        const existing = await getCurrencyByAbbrev(currency.abbrev, user.id);
        if (existing && existing.id !== currencyId) {
          return badRequestError({
            message: `Currency with abbreviation '${currency.abbrev}' already exists`,
          });
        }
      }

      // update currency
      const updatedCurrency = await updateCurrency(
        currencyId,
        currency,
        user.id
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
