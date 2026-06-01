import Link from "next/link";
import { AdminSupplierStatusBadge } from "@/components/admin/AdminSupplierStatusBadge";
import type { Supplier } from "@/types/supplier";

function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date(value));
}

function displayValue(value: string | null | undefined) {
  return value?.trim() ? value : "-";
}

function displayBoolean(value: boolean | null | undefined) {
  return value ? "가능" : "불가능";
}

function TagList({ values }: { values: string[] | null | undefined }) {
  if (!values || values.length === 0) {
    return <span className="text-sm font-semibold text-slate-600">-</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <span
          key={value}
          className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700"
        >
          {value}
        </span>
      ))}
    </div>
  );
}

function DetailCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function InfoGrid({
  items,
}: {
  items: { label: string; value: React.ReactNode }[];
}) {
  return (
    <dl className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-md bg-slate-50 p-4">
          <dt className="text-xs font-bold uppercase text-slate-500">
            {item.label}
          </dt>
          <dd className="mt-2 text-sm font-semibold leading-6 text-slate-900">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function AdminSupplierDetail({ supplier }: { supplier: Supplier }) {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link
          href="/admin/suppliers"
          className="inline-flex min-h-10 items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
        >
          목록으로 돌아가기
        </Link>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  개발용 관리자 화면
                </span>
                <AdminSupplierStatusBadge isActive={supplier.is_active} />
              </div>
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {supplier.company_name}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                현재 제조업체 DB 관리 화면은 개발용 관리자 화면입니다. 실제
                배포 전에는 관리자 인증을 적용해야 합니다.
              </p>
            </div>

            <div className="grid gap-3 rounded-lg bg-slate-50 p-4 text-sm lg:min-w-80">
              <div className="flex justify-between gap-4">
                <span className="font-semibold text-slate-500">지역</span>
                <span className="font-bold text-slate-900">
                  {displayValue(supplier.region)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-semibold text-slate-500">평균 납기</span>
                <span className="font-bold text-slate-900">
                  {displayValue(supplier.average_lead_time)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-semibold text-slate-500">
                  소량 시제품
                </span>
                <span className="font-bold text-slate-900">
                  {displayBoolean(supplier.small_batch_available)}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <DetailCard title="기본 정보">
            <InfoGrid
              items={[
                { label: "업체명", value: supplier.company_name },
                { label: "지역", value: displayValue(supplier.region) },
                { label: "주소", value: displayValue(supplier.address) },
                {
                  label: "사용 여부",
                  value: (
                    <AdminSupplierStatusBadge isActive={supplier.is_active} />
                  ),
                },
                { label: "등록일", value: formatDateTime(supplier.created_at) },
                {
                  label: "최근 수정일",
                  value: formatDateTime(supplier.updated_at),
                },
              ]}
            />
          </DetailCard>

          <DetailCard title="연락처 정보">
            <InfoGrid
              items={[
                {
                  label: "담당자명",
                  value: displayValue(supplier.contact_name),
                },
                { label: "연락처", value: displayValue(supplier.phone) },
                { label: "이메일", value: displayValue(supplier.email) },
                { label: "웹사이트", value: displayValue(supplier.website) },
              ]}
            />
          </DetailCard>
        </div>

        <DetailCard title="제조 역량">
          <InfoGrid
            items={[
              { label: "가능 공정", value: <TagList values={supplier.main_processes} /> },
              { label: "보유 장비", value: <TagList values={supplier.machines} /> },
              { label: "대응 소재", value: <TagList values={supplier.materials} /> },
              {
                label: "소량 시제품 가능 여부",
                value: displayBoolean(supplier.small_batch_available),
              },
              {
                label: "후처리 가능 여부",
                value: displayBoolean(supplier.post_processing_available),
              },
              {
                label: "평균 납기",
                value: displayValue(supplier.average_lead_time),
              },
            ]}
          />
        </DetailCard>

        <DetailCard title="설명 및 메모">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-md bg-slate-50 p-4">
              <h3 className="text-xs font-bold uppercase text-slate-500">
                업체 설명
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-slate-900">
                {displayValue(supplier.description)}
              </p>
            </div>
            <div className="rounded-md bg-slate-50 p-4">
              <h3 className="text-xs font-bold uppercase text-slate-500">
                관리자 메모
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-slate-900">
                {displayValue(supplier.admin_memo)}
              </p>
            </div>
          </div>
        </DetailCard>
      </div>
    </main>
  );
}
