import type { CategoryFormData } from "@/schemas/category.schema";
import type {
  ActionFailureSimple,
  ActionSuccess,
  ActionValidationFailure,
} from "@/types/action-result.type";
import type { Category } from "@prisma-generated/client";

export type CreateCategoryActionSuccess = ActionSuccess<{ category: Category }>;

export type CreateCategoryActionFail = ActionValidationFailure<
  keyof CategoryFormData
>;

export type UpdateCategoryActionSuccess = ActionSuccess<{ category: Category }>;

export type UpdateCategoryActionFail = ActionValidationFailure<
  keyof CategoryFormData
>;

export type DeleteCategoryActionSuccess = ActionSuccess;

export type DeleteCategoryActionFail = ActionFailureSimple;
