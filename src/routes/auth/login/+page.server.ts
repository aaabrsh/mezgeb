import { Routes } from "@/data/routes.js";
import { loginSchema, type LoginFormData } from "@/schemas/login.schema";
import prisma from "@/server/prisma.js";
import { createSession } from "@/server/session.server.js";
import type { ActionValidationFailure } from "@/types/action-result.type";
import { schemaValidationError } from "@/utils/error-responses.util";
import {
  badRequestError,
  serverError,
  skipRedirectAndHttpErrors,
} from "@/utils/error-responses.util";
import { redirect, type Actions } from "@sveltejs/kit";
import bcrypt from "bcrypt";

export const actions: Actions = {
  default: async ({
    request,
    cookies,
  }): Promise<ActionValidationFailure<keyof LoginFormData>> => {
    try {
      const data = await request.formData();
      const formData = Object.fromEntries(data);

      const parsed = loginSchema.safeParse(formData);

      if (!parsed.success) {
        return schemaValidationError<LoginFormData>(parsed.error);
      }

      const { email, password } = parsed.data;

      // get user by email
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return badRequestError({ message: "Invalid credentials" });
      }

      // verify password
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return badRequestError({ message: "Invalid credentials" });
      }

      // create user session and set cookie
      await createSession(user.id, cookies);

      throw redirect(302, Routes.home);
    } catch (error) {
      // let SvelteKit handle redirects & HTTP errors
      skipRedirectAndHttpErrors(error);

      console.log("Login error: ", error);
      return serverError();
    }
  },
};
