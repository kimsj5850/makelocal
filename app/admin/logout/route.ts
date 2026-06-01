import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin/auth";

export async function GET(request: Request) {
  const loginUrl = new URL("/admin/login", request.url);
  const response = NextResponse.redirect(loginUrl);

  response.cookies.delete({
    name: ADMIN_SESSION_COOKIE,
    path: "/admin",
  });

  return response;
}
