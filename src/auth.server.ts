import { createId } from "@paralleldrive/cuid2";
import { generators, Issuer, TokenSet } from "openid-client";
import invariant from "tiny-invariant";
import {
  getUserByAuth0UserId,
  getUserIdByAuth0UserId,
} from "./models/users.server";
import { getSession } from "./session.server";
import { createLoginSession } from "./login-session.server";
import { safeRedirect } from "./utils";
import type { User } from "@prisma/client";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function authorize(
  request: Request,
  mode: AuthorizeMode = "login"
) {
  const redirectTo = safeRedirect(
    new URL(request.url).searchParams.get("redirectTo")
  );

  // do not execute this loader if we are already logged in
  const session = await getSession();
  const userId = session.get("userId");
  if (userId) {
    redirect(redirectTo);
  }

  const codeVerifier = generators.codeVerifier();
  const codeChallenge = generators.codeChallenge(codeVerifier);
  const state = createId();

  const oidcClient = await getOidcClient();

  const url = new URL(
    oidcClient.authorizationUrl({
      scope: "openid email profile",
      state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    })
  );

  if (mode === "signup") {
    url.searchParams.set("screen_hint", "signup");
  }

  return await createLoginSession({
    request,
    url: url.toString(),
    redirectTo,
    codeVerifier,
    state,
  });
}

type AuthorizeMode = "signup" | "login";

export async function requireUserId() {
  const url = getRequestUrl();
  const auth0UserId = await requireAuth0UserId(url);

  const userId = await getUserIdByAuth0UserId(auth0UserId);
  if (!userId) throw redirectToSignup(url);

  return userId;
}

export async function requireUser() {
  const url = getRequestUrl();
  const auth0UserId = await requireAuth0UserId(url);

  const user = await getUserByAuth0UserId(auth0UserId);
  if (!user) throw redirectToSignup(url);

  const session = await getSession();
  const claims = new TokenSet({ id_token: session.get("idToken") }).claims();
  return {
    ...user,
    email: claims.email,
    pictureUrl: claims.picture,
  } as ExtendedUser;
}

async function requireAuth0UserId(url: string) {
  const session = await getSession();
  const auth0UserId = session.get("userId");

  if (!auth0UserId) redirectToLogin(url);

  return auth0UserId;
}

function redirectToLogin(url: string) {
  redirect(`/login?redirectTo=${encodeURIComponent(url)}`);
}

function redirectToSignup(url: string) {
  redirect(`/signup?redirectTo=${encodeURIComponent(url)}`);
}

export type ExtendedUser = User & {
  email: string;
  pictureUrl: string;
};

export async function getOidcClient() {
  invariant(process.env.OIDC_ISSUER, "OIDC_ISSUER not set");
  invariant(process.env.OIDC_CLIENT_ID, "OIDC_CLIENT_ID not set");
  invariant(process.env.OIDC_CLIENT_SECRET, "OIDC_CLIENT_SECRET not set");
  invariant(process.env.BASE_URL, "BASE_URL not set");

  const issuer = await Issuer.discover(process.env.OIDC_ISSUER);
  const client = new issuer.Client({
    client_id: process.env.OIDC_CLIENT_ID,
    client_secret: process.env.OIDC_CLIENT_SECRET,
    redirect_uris: [`${process.env.BASE_URL}/callback`],
    response_types: ["code"],
  });

  return client;
}

export function getOidcLogoutUrl(idToken: string) {
  invariant(process.env.OIDC_ISSUER, "OIDC_ISSUER not set");
  invariant(process.env.BASE_URL, "BASE_URL not set");

  // Auth0 does not provide the logout endpoint via OIDC discovery
  return `${
    process.env.OIDC_ISSUER
  }/oidc/logout?id_token_hint=${encodeURIComponent(
    idToken
  )}&post_logout_redirect_uri=${encodeURIComponent(
    `${process.env.BASE_URL}/logged-out`
  )}`;
}

function getRequestUrl() {
  const initialUrl = headers().get("x-initial-url");
  invariant(initialUrl, "x-initial-url header is missing");

  return initialUrl;
}
