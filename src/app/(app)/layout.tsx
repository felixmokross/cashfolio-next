import { requireUser } from "@/auth.server";
import { UserProvider } from "@/user-context";
import { headers } from "next/headers";
import invariant from "tiny-invariant";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialUrl = headers().get("x-initial-url");
  invariant(initialUrl, "x-initial-url header is missing");
  const user = await requireUser(initialUrl);
  return <UserProvider user={user}>{children}</UserProvider>;
}
