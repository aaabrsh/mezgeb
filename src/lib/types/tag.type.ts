import type { TagFormData } from "@/schemas/tag.schema";
import type {
  ActionFailureSimple,
  ActionSuccess,
  ActionValidationFailure,
} from "@/types/action-result.type";
import type { Tag } from "@prisma-generated/client";

export type CreateTagActionSuccess = ActionSuccess<{ tag: Tag }>;

export type CreateTagActionFail = ActionValidationFailure<
  keyof TagFormData
>;

export type UpdateTagActionSuccess = ActionSuccess<{ tag: Tag }>;

export type UpdateTagActionFail = ActionValidationFailure<
  keyof TagFormData
>;

export type DeleteTagActionSuccess = ActionSuccess;

export type DeleteTagActionFail = ActionFailureSimple;
