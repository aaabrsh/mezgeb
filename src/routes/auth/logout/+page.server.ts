import { Routes } from "@/data/routes.js";
import { deleteSession } from "@/server/session.server.js";
import { redirect } from "@sveltejs/kit";

export const actions = {
  default: async ({ cookies }) => {
    await deleteSession(cookies);
    throw redirect(302, Routes.login);
  },
};
