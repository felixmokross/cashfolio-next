import { createCookieSessionStorage } from "./session-storage.server";

export const loginSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__login_session_next",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getLoginSession(request: Request) {
  return loginSessionStorage.getSession();
}

export async function createLoginSession({
  request,
  url,
  redirectTo,
  codeVerifier,
  state,
}: {
  request: Request;
  url: string;
  redirectTo: string;
  codeVerifier: string;
  state: string;
}) {
  const loginSession = await getLoginSession(request);
  loginSession.flash("redirectTo", redirectTo);
  loginSession.flash("codeVerifier", codeVerifier);
  loginSession.flash("state", state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: url,
      "Set-Cookie": await loginSessionStorage.commitSession(loginSession),
    },
  });
}
