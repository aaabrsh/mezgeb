import { Routes } from "@/data/routes.js";
import prisma from "@/server/prisma";
import { createSession } from "@/server/session.js";
import { fail, redirect } from "@sveltejs/kit";
import bcrypt from "bcrypt";

export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const full_name = data.get("full_name")?.toString();
    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();
    const confirm_password = data.get("confirm_password")?.toString();

    if (!email) {
      return fail(400, { message: "Email is required" });
    }

    if (!full_name) {
      return fail(400, { message: "User's full name is required" });
    }

    if (!password) {
      return fail(400, { message: "Password is required" });
    }

    if (password.length < 6) {
      return fail(400, {
        message: "Password must be at least 6 characters long",
      });
    }

    if (password !== confirm_password) {
      return fail(400, { message: "Passwords do not match" });
    }

    // check duplicate user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return fail(400, { message: "User already exists" });
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
  },
};
