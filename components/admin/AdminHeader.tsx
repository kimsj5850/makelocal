"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminHeader() {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return null;
  }

  return (
    <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link href="/admin/requests" className="text-lg font-bold text-slate-950">
            메이크로컬 관리자
          </Link>
          <p className="mt-1 text-xs font-semibold text-amber-700">
            현재 인증 방식은 MVP 개발용 간단 인증입니다. 정식 배포 전에는
            Supabase Auth 등 정식 인증으로 전환해야 합니다.
          </p>
        </div>
        <nav className="flex flex-wrap gap-2 text-sm font-bold">
          <Link
            href="/admin/requests"
            className="inline-flex min-h-10 items-center rounded-md px-3 py-2 text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
          >
            제작 문의 관리
          </Link>
          <Link
            href="/admin/suppliers"
            className="inline-flex min-h-10 items-center rounded-md px-3 py-2 text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
          >
            제조업체 DB
          </Link>
          <Link
            href="/admin/logout"
            className="inline-flex min-h-10 items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            로그아웃
          </Link>
        </nav>
      </div>
    </header>
  );
}
