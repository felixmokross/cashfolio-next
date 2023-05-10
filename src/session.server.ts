import invariant from "tiny-invariant";
import { getLoginSession, loginSessionStorage } from "./login-session.server";
import { createCookieSessionStorage } from "./session-storage.server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

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

// export async function createUserSession({
//   request,
//   userId,
//   idToken,
//   redirectTo,
// }: {
//   request: Request;
//   userId: string;
//   idToken: string;
//   redirectTo: string;
// }) {
//   const session = await getSession(request);
//   session.set(USER_SESSION_KEY, userId);
//   session.set("idToken", idToken);
//   redirect(redirectTo, {
//     headers: [
//       [
//         "Set-Cookie",
//         await sessionStorage.commitSession(session, {
//           maxAge: 60 * 60 * 24 * 7, // 7 days
//         }),
//       ],
//       [
//         "Set-Cookie",
//         await loginSessionStorage.destroySession(
//           await getLoginSession(request)
//         ),
//       ],
//     ],
//   });
// }
