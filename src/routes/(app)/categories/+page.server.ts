import { Routes } from "@/data/routes.js";
import { categorySchema } from "@/schemas/category.schema.js";
import {
  createCategory,
  deleteCategory,
  getCategoriesForUser,
  getCategoryById,
  getCategoryByName,
  updateCategory,
} from "@/server/category.server";
import type {
  CreateCategoryActionFail,
  CreateCategoryActionSuccess,
  DeleteCategoryActionFail,
  DeleteCategoryActionSuccess,
  UpdateCategoryActionFail,
  UpdateCategoryActionSuccess,
} from "@/types/category.type.js";
import {
  badRequestError,
  notFoundError,
  serverError,
  skipRedirectAndHttpErrors,
} from "@/utils/error-responses.js";
import { redirect, type Actions } from "@sveltejs/kit";
import z from "zod";

export const load = async ({ locals }) => {
  const categories = await getCategoriesForUser(locals.user?.id || "");
  return { categories };
};

export const actions: Actions = {
  create: async ({
    request,
    locals,
  }): Promise<CreateCategoryActionSuccess | CreateCategoryActionFail> => {
    try {
      const data = await request.formData();
      const formData = Object.fromEntries(data);
      const parsed = categorySchema.safeParse(formData);
      const user = locals.user;

      if (!user) {
        return redirect(302, Routes.login);
      }

      if (!parsed.success) {
        const errors = z.flattenError(parsed.error);
        return badRequestError({
          message: "Invalid category data provided",
          errors: errors.fieldErrors,
        });
      }

      const category = parsed.data;

      // check duplicate
      const existing = await getCategoryByName(category.name, user.id);
      if (existing) {
        return badRequestError({
          message: `Category with the name ${category.name} already exists`,
        });
      }

      // create new category
      const newCategory = await createCategory(category, user.id);
      return {
        message: "New activity category created",
        success: true,
        data: { category: newCategory },
      };
    } catch (error) {
      skipRedirectAndHttpErrors(error);
      console.log("category creation error: ", error);
      return serverError();
    }
  },

  update: async ({
    request,
    locals,
  }): Promise<UpdateCategoryActionSuccess | UpdateCategoryActionFail> => {
    try {
      const data = await request.formData();
      const formData = Object.fromEntries(data);
      const categoryId = formData.id as string;
      const parsed = categorySchema.safeParse(formData);
      const user = locals.user;

      if (!user) {
        return redirect(302, Routes.login);
      }

      if (!parsed.success) {
        const errors = z.flattenError(parsed.error);
        return badRequestError({
          message: "Invalid category data provided",
          errors: errors.fieldErrors,
        });
      }

      const category = parsed.data;

      // check duplicate
      const existing = await getCategoryById(categoryId);
      if (!existing) {
        return notFoundError({ message: "Category not found" });
      } else {
        const existing = await getCategoryByName(category.name, user.id);
        if (existing && existing.id !== categoryId) {
          return badRequestError({
            message: `Category with the name '${category.name}' already exists`,
          });
        }
      }

      // update category
      const updatedCategory = await updateCategory(
        categoryId,
        category,
        user.id
      );
      return {
        message: "Your changes have been saved successfully.",
        success: true,
        data: { category: updatedCategory },
      };
    } catch (error) {
      skipRedirectAndHttpErrors(error);
      console.log("category updation error: ", error);
      return serverError();
    }
  },

  delete: async ({
    request,
    locals,
  }): Promise<DeleteCategoryActionSuccess | DeleteCategoryActionFail> => {
    try {
      const data = await request.formData();
      const formData = Object.fromEntries(data);
      const categoryId = formData.id as string;
      const user = locals.user;

      if (!user) {
        return redirect(302, Routes.login);
      }

      await deleteCategory(categoryId, user.id);
      return {
        message: "The category has been removed from your list.",
        success: true,
      };
    } catch (error) {
      skipRedirectAndHttpErrors(error);
      console.log("category deletion error: ", error);
      return serverError();
    }
  },
};
