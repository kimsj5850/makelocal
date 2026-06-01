import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_VALUE = "authenticated";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();

  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value === ADMIN_SESSION_VALUE;
}

export async function requireAdminAuth() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}
