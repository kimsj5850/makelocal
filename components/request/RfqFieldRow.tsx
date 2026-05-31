"use client";

export type RfqFieldStatus = "AI 추천" | "직접 입력" | "확인 필요";

export type RfqInputType = "text" | "textarea" | "select";

type RfqFieldRowProps = {
  description: string;
  inputType: RfqInputType;
  label: string;
  onChange: (value: string) => void;
  options?: string[];
  status: RfqFieldStatus;
  value: string;
};

const statusClasses: Record<RfqFieldStatus, string> = {
  "AI 추천": "border-blue-200 bg-blue-50 text-blue-700",
  "직접 입력": "border-slate-200 bg-slate-100 text-slate-700",
  "확인 필요": "border-amber-200 bg-amber-50 text-amber-700",
};

export function RfqFieldRow({
  description,
  inputType,
  label,
  onChange,
  options = [],
  status,
  value,
}: RfqFieldRowProps) {
  const inputClasses =
    "w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

  return (
    <div className="grid gap-4 border-b border-slate-200 px-5 py-5 last:border-b-0 lg:grid-cols-[0.9fr_1.4fr] lg:items-start">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-slate-950">{label}</h3>
          <span
            className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${statusClasses[status]}`}
          >
            {status}
          </span>
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <div>
        {inputType === "textarea" ? (
          <textarea
            className={`${inputClasses} min-h-28 resize-y`}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : null}

        {inputType === "select" ? (
          <select
            className={inputClasses}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : null}

        {inputType === "text" ? (
          <input
            className={inputClasses}
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : null}
      </div>
    </div>
  );
}
