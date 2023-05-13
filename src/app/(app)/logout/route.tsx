import { getOidcLogoutUrl } from "@/auth.server";
import { getSession, sessionStorage } from "@/session.server";
import { redirect } from "next/navigation";

export async function GET() {
  const session = await getSession();
  const authUserId = session.get("userId");
  if (!authUserId) redirect("/logged-out");

  const idToken = session.get("idToken");

  return new Response(null, {
    status: 302,
    headers: {
      Location: getOidcLogoutUrl(idToken),
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
