import prisma from "@/server/prisma";
import type { Cookies } from "@sveltejs/kit";

export const DEFAULT_EXPIRE_DATE = new Date(
  Date.now() + 1000 * 60 * 60 * 24 * 7
); // 7 days
export const SESSION_COOKIE_NAME = "session";
export const SESSION_COOKIE_PATH = "/";

export const createSession = async (
  userId: string,
  cookies: Cookies,
  expiresAt?: Date
) => {
  expiresAt = expiresAt ? expiresAt : DEFAULT_EXPIRE_DATE;

  // create session
  const session = await prisma.session.create({
    data: {
      userId: userId,
      expiresAt,
    },
  });

  // save session cookie
  cookies.set(SESSION_COOKIE_NAME, session.id, {
    path: SESSION_COOKIE_PATH,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: expiresAt,
  });
};

export const deleteSession = async (cookies: Cookies) => {
  const sessionId = cookies.get(SESSION_COOKIE_NAME);
  if (sessionId) {
    await prisma.session.delete({ where: { id: sessionId } });
  }

  cookies.delete(SESSION_COOKIE_NAME, { path: SESSION_COOKIE_PATH });
};
