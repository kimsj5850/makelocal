import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <span className="inline-flex rounded-md bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
          관리자 인증
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
          메이크로컬 관리자 로그인
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          관리자 페이지에 접근하려면 관리자 토큰을 입력해주세요.
        </p>

        <AdminLoginForm />

        <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-800">
          이 화면은 MVP 개발용 간단 인증입니다. 정식 배포 전에는 Supabase
          Auth 등 정식 인증 방식으로 전환해야 합니다.
        </p>
      </section>
    </main>
  );
}
