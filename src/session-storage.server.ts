import { cookies } from "next/headers";

type CreateCookieSessionStorageOptions = {
  cookie: {
    name: string;
    httpOnly: boolean;
    path: string;
    sameSite: string;
    secure: boolean;
  };
};

export function createCookieSessionStorage({
  cookie,
}: CreateCookieSessionStorageOptions) {
  return {
    async getSession() {
      const session = JSON.parse(
        cookies().get(cookie.name)?.value || "{}"
      ) as SessionCookie;
      return {
        get(key: string) {
          if (!session[key]) return undefined;

          const { value, isFlash } = session[key];
          if (isFlash) delete session[key];
          return value;
        },
        set(key: string, value: string) {
          session[key] = { value, isFlash: false };
        },
        flash(key: string, value: string) {
          session[key] = { value, isFlash: true };
        },
        toString() {
          return JSON.stringify(session);
        },
      } as Session;
    },
    async commitSession(session: Session) {
      return `${cookie.name}=${session}; HttpOnly; Path=${cookie.path}; SameSite=${cookie.sameSite}; Secure=${cookie.secure}`;
    },
  };
}

type Session = {
  get(key: string): string;
  set(key: string, value: string): void;
  flash(key: string, value: string): void;
};
type SessionCookie = Record<string, { value: string; isFlash: boolean }>;
