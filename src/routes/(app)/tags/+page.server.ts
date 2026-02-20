import { Routes } from "@/data/routes.js";
import { tagSchema, type TagFormData } from "@/schemas/tag.schema.js";
import {
  createTag,
  deleteTag,
  getTagsForUser,
  getTagById,
  getTagByName,
  updateTag,
} from "@/server/tag.server";
import type {
  CreateTagActionFail,
  CreateTagActionSuccess,
  DeleteTagActionFail,
  DeleteTagActionSuccess,
  UpdateTagActionFail,
  UpdateTagActionSuccess,
} from "@/types/tag.type.js";
import { schemaValidationError } from "@/utils/error-responses.util.js";
import {
  badRequestError,
  notFoundError,
  serverError,
  skipRedirectAndHttpErrors,
} from "@/utils/error-responses.util.js";
import { redirect, type Actions } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  const tags = await getTagsForUser(locals.user?.id || "");
  return { tags };
};

export const actions: Actions = {
  create: async ({
    request,
    locals,
  }): Promise<CreateTagActionSuccess | CreateTagActionFail> => {
    try {
      const data = await request.formData();
      const formData = Object.fromEntries(data);
      const parsed = tagSchema.safeParse(formData);
      const user = locals.user;

      if (!user) {
        return redirect(302, Routes.login);
      }

      if (!parsed.success) {
        return schemaValidationError<TagFormData>(
          parsed.error,
          "Invalid tag provided",
        );
      }

      const tag = parsed.data;

      // check duplicate
      const existing = await getTagByName(tag.name, user.id);
      if (existing) {
        return badRequestError({
          message: `Tag with the name ${tag.name} already exists`,
        });
      }

      // create new tag
      const newTag = await createTag(tag, user.id);
      return {
        message: "New tag created",
        success: true,
        data: { tag: newTag },
      };
    } catch (error) {
      skipRedirectAndHttpErrors(error);
      console.log("tag creation error: ", error);
      return serverError();
    }
  },

  update: async ({
    request,
    locals,
  }): Promise<UpdateTagActionSuccess | UpdateTagActionFail> => {
    try {
      const data = await request.formData();
      const formData = Object.fromEntries(data);
      const tagId = formData.id as string;
      const parsed = tagSchema.safeParse(formData);
      const user = locals.user;

      if (!user) {
        return redirect(302, Routes.login);
      }

      if (!parsed.success) {
        return schemaValidationError<TagFormData>(
          parsed.error,
          "Invalid tag provided",
        );
      }

      const tag = parsed.data;

      // check duplicate
      const existing = await getTagById(tagId, user.id);
      if (!existing) {
        return notFoundError({ message: "Tag not found" });
      } else {
        const existing = await getTagByName(tag.name, user.id);
        if (existing && existing.id !== tagId) {
          return badRequestError({
            message: `Tag with the name '${tag.name}' already exists`,
          });
        }
      }

      // update tag
      const updatedTag = await updateTag(tagId, tag, user.id);
      return {
        message: "Your changes have been saved successfully.",
        success: true,
        data: { tag: updatedTag },
      };
    } catch (error) {
      skipRedirectAndHttpErrors(error);
      console.log("tag updation error: ", error);
      return serverError();
    }
  },

  delete: async ({
    request,
    locals,
  }): Promise<DeleteTagActionSuccess | DeleteTagActionFail> => {
    try {
      const data = await request.formData();
      const formData = Object.fromEntries(data);
      const tagId = formData.id as string;
      const user = locals.user;

      if (!user) {
        return redirect(302, Routes.login);
      }

      await deleteTag(tagId, user.id);
      return {
        message: "The tag has been removed from your list.",
        success: true,
      };
    } catch (error) {
      skipRedirectAndHttpErrors(error);
      console.log("tag deletion error: ", error);
      return serverError();
    }
  },
};
