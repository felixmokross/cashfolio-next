import { getLoginSession, loginSessionStorage } from "./login-session.server";
import { createCookieSessionStorage } from "./session-storage.server";

const USER_SESSION_KEY = "userId";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session_next",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getSession() {
  return sessionStorage.getSession();
}

export async function createUserSession({
  userId,
  idToken,
  redirectTo,
}: {
  userId: string;
  idToken: string;
  redirectTo: string;
}) {
  const session = await getSession();
  session.set(USER_SESSION_KEY, userId);
  session.set("idToken", idToken);

  return new Response(null, {
    status: 302,
    headers: [
      ["Location", redirectTo],
      [
        "Set-Cookie",
        await sessionStorage.commitSession(session, {
          maxAge: 60 * 60 * 24 * 7, // 7 days
        }),
      ],
      [
        "Set-Cookie",
        await loginSessionStorage.destroySession(await getLoginSession()),
      ],
    ],
  });
}
