import prisma from "@/server/prisma";
import { deleteSession, SESSION_COOKIE_NAME } from "@/server/session";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get(SESSION_COOKIE_NAME);

  if (sessionId) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            full_name: true,
          },
        },
      },
    });

    if (session && session.expiresAt > new Date()) {
      event.locals.user = {
        id: session.user.id,
        email: session.user.email,
        full_name: session.user.full_name,
      };
    } else {
      deleteSession(event.cookies);
    }
  }

  return resolve(event);
};
