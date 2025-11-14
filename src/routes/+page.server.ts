import { Routes } from "@/data/routes.js";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  // redirect to login if user is not authenticated
  if (!locals.user) {
    redirect(302, Routes.login);
  }

  return {
    user: locals.user,
  };
};
