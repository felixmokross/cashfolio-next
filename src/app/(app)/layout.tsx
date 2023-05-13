import { requireUser } from "@/auth.server";
import { NavBar } from "@/components/nav-bar";
import { UserProvider } from "@/user-context";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  return (
    <UserProvider user={user}>
      <NavBar />
      {children}
    </UserProvider>
  );
}
