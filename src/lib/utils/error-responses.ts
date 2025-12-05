import { fail } from "@sveltejs/kit";

export const serverError = <T extends Record<string, any>>(
  message?: string,
  data?: T
) =>
  fail(500, {
    message: message || "something went wrong, please try again later",
    ...data,
  });

export const notFoundError = <
  T extends { message: string } & Record<string, any>
>(
  data: T
) => fail(404, data);

export const badRequestError = <
  T extends { message: string } & Record<string, any>
>(
  data: T
) => fail(404, data);
