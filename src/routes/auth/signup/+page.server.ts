import { Routes } from "@/data/routes.js";
import { signupSchema, type SignupFormData } from "@/schemas/signup.schema";
import prisma from "@/server/prisma";
import { createSession } from "@/server/session.server.js";
import type { ActionValidationFailure } from "@/types/action-result.type.js";
import {
  badRequestError,
  serverError,
  skipRedirectAndHttpErrors,
} from "@/utils/error-responses.js";
import { redirect } from "@sveltejs/kit";
import bcrypt from "bcrypt";
import z from "zod";

export const actions = {
  default: async ({
    request,
    cookies,
  }): Promise<ActionValidationFailure<keyof SignupFormData> | void> => {
    try {
      const data = await request.formData();
      const formData = Object.fromEntries(data);
      const parsed = signupSchema.safeParse(formData);

      if (!parsed.success) {
        const errors = z.flattenError(parsed.error);
        return badRequestError({
          message: "Invalid data provided",
          errors: errors.fieldErrors,
        });
      }

      const { full_name, email, password } = parsed.data;

      // check duplicate user
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return badRequestError({ message: "User already exists" });
      }

      // create user
      const hashed = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { full_name, email, password: hashed },
      });

      // create user session and set cookie
      await createSession(user.id, cookies);

      // redirect to home page after successful signup
      throw redirect(302, Routes.home);
    } catch (error) {
      // let SvelteKit handle redirects & HTTP errors
      skipRedirectAndHttpErrors(error);

      console.log("Signup error: ", error);
      return serverError();
    }
  },
};
