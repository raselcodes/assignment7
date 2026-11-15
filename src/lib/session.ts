import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

/** Server-side guard: returns the session or redirects to /signin with a toast reason. */
export async function requireSession(returnTo: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect(`/signin?reason=protected&redirect=${encodeURIComponent(returnTo)}`);
  }
  return session;
}
