import { Routes } from "@/data/routes.js";
import prisma from "@/server/prisma.js";
import { createSession } from "@/server/session.js";
import { fail, redirect } from "@sveltejs/kit";
import bcrypt from "bcrypt";

export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();

    if (!email) {
      return fail(400, { message: "Email is required" });
    }

    if (!password) {
      return fail(400, { message: "Password is required" });
    }

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

    throw redirect(302, Routes.home);
  },
};
