import { Routes } from "@/data/routes.js";
import prisma from "@/server/prisma.js";
import { createSession } from "@/server/session.js";
import {
  fail,
  isHttpError,
  isRedirect,
  redirect,
  type ActionFailure,
  type Actions,
} from "@sveltejs/kit";
import bcrypt from "bcrypt";
import z from "zod";

const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .trim()
    .min(1, "Email is required"),
  password: z
    .string({ error: "Password is required" })
    .trim()
    .min(6, "Password must be at least 6 characters long"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export interface LoginFormFail {
  message?: string;
  errors?: Partial<Record<keyof LoginFormData, string[]>>;
  values?: Partial<LoginFormData>;
}

export const actions: Actions = {
  default: async ({
    request,
    cookies,
  }): Promise<ActionFailure<LoginFormFail> | void> => {
    try {
      const data = await request.formData();
      const formData = Object.fromEntries(data);

      const parsed = loginSchema.safeParse(formData);

      if (!parsed.success) {
        const errors = z.flattenError(parsed.error);
        return fail(400, {
          message: "Invalid form submission",
          errors: errors.fieldErrors,
          values: formData,
        });
      }

      const { email, password } = parsed.data;

      // get user by email
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return fail(400, { message: "Invalid credentials" });
      }

      // verify password
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return fail(400, { message: "Invalid credentials" });
      }

      // create user session and set cookie
      await createSession(user.id, cookies);

      return redirect(302, Routes.home);
    } catch (error) {
      // let SvelteKit handle redirects & HTTP errors
      if (isRedirect(error) || isHttpError(error)) {
        throw error;
      }

      console.log("Login error: ", error);
      return fail(500, {
        message: "something went wrong, please try again later",
      });
    }
  },
};
