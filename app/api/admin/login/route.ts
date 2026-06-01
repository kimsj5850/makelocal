import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  ADMIN_SESSION_VALUE,
} from "@/lib/admin/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { token?: string };
    const token = body.token?.trim();
    const adminAccessToken = process.env.ADMIN_ACCESS_TOKEN;

    if (!adminAccessToken) {
      return NextResponse.json(
        {
          ok: false,
          message: "관리자 인증 처리 중 문제가 발생했습니다.",
        },
        { status: 500 },
      );
    }

    if (!token || token !== adminAccessToken) {
      return NextResponse.json(
        {
          ok: false,
          message: "관리자 토큰이 올바르지 않습니다.",
        },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/admin",
      maxAge: ADMIN_SESSION_MAX_AGE,
    });

    return response;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "관리자 인증 처리 중 문제가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
