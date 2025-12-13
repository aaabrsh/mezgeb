import { fail, isHttpError, isRedirect } from "@sveltejs/kit";

type ErrorResponse = { message: string } & Record<string, any>;

export const serverError = <T extends ErrorResponse>(data?: T) =>
  fail(500, {
    ...data,
    success: false as false,
    message: data?.message || "something went wrong, please try again later",
  });

export const notFoundError = <T extends ErrorResponse>(data: T) =>
  fail(404, { ...data, success: false as false });

export const badRequestError = <T extends ErrorResponse>(data: T) =>
  fail(404, { ...data, success: false as false });

export const skipRedirectAndHttpErrors = (error: any) => {
  // throw redirects & HTTP errors so that SvelteKit handles them in its own way
  if (isRedirect(error) || isHttpError(error)) {
    throw error;
  }
};
