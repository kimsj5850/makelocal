import Link from "next/link";

type AdminSupplierFormProps = {
  formAction: (formData: FormData) => Promise<void>;
  error?: string;
};

function Field({
  label,
  name,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-800">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="min-h-12 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function TextareaField({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-800">{label}</span>
      <textarea
        name={name}
        placeholder={placeholder}
        rows={5}
        className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: "true" | "false";
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-800">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="min-h-12 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      >
        <option value="true">사용 중 / 가능</option>
        <option value="false">비활성 / 불가능</option>
      </select>
    </label>
  );
}

export function AdminSupplierForm({
  formAction,
  error,
}: AdminSupplierFormProps) {
  const errorMessage =
    error === "company_name"
      ? "업체명은 필수 입력 항목입니다."
      : error === "submit"
        ? "제조업체 등록 중 문제가 발생했습니다. 다시 시도해주세요."
        : "";

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {errorMessage ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <form action={formAction} className="space-y-8">
        <div>
          <h2 className="text-lg font-bold text-slate-950">기본 정보</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field
              label="업체명"
              name="company_name"
              required
              placeholder="예: 대구정밀가공"
            />
            <Field label="지역" name="region" placeholder="예: 대구, 경북, 부산" />
            <Field
              label="주소"
              name="address"
              placeholder="예: 대구 북구 3공단로 ..."
            />
            <Field
              label="평균 납기"
              name="average_lead_time"
              placeholder="예: 7~14일"
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-950">제조 역량</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            가능 공정, 보유 장비, 대응 소재는 쉼표로 구분해서 입력하세요.
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field
              label="가능 공정"
              name="main_processes"
              placeholder="예: MCT, CNC, 밀링"
            />
            <Field
              label="보유 장비"
              name="machines"
              placeholder="예: MCT 3대, CNC 2대"
            />
            <Field
              label="대응 소재"
              name="materials"
              placeholder="예: 알루미늄, 스틸, SUS"
            />
            <SelectField
              label="소량 시제품 가능 여부"
              name="small_batch_available"
              defaultValue="true"
            />
            <SelectField
              label="후처리 가능 여부"
              name="post_processing_available"
              defaultValue="false"
            />
            <SelectField label="사용 여부" name="is_active" defaultValue="true" />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-950">연락처 정보</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field label="담당자명" name="contact_name" />
            <Field label="연락처" name="phone" />
            <Field label="이메일" name="email" type="email" />
            <Field label="웹사이트" name="website" placeholder="https://..." />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <TextareaField
            label="업체 설명"
            name="description"
            placeholder="소량 시제품 및 정밀 부품 가공 가능 업체"
          />
          <TextareaField
            label="관리자 메모"
            name="admin_memo"
            placeholder="테스트 등록 데이터"
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
          <Link
            href="/admin/suppliers"
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-blue-200 hover:bg-blue-50"
          >
            목록으로 돌아가기
          </Link>
          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-blue-700/20 transition hover:bg-blue-800"
          >
            제조업체 등록하기
          </button>
        </div>
      </form>
    </section>
  );
}
