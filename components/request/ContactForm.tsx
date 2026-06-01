"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  getRequestDraft,
  saveRequestDraft,
} from "@/lib/storage/requestDraftStorage";
import type { ContactDraft, SubmitRequestResponse } from "@/types/request";

const contactMethods = ["이메일", "전화", "문자", "카카오톡", "상관없음"];

type ContactFormState = {
  company: string;
  email: string;
  message: string;
  name: string;
  phone: string;
  preferredContact: string;
};

const initialFormState: ContactFormState = {
  company: "",
  email: "",
  message: "",
  name: "",
  phone: "",
  preferredContact: "이메일",
};

export function ContactForm() {
  const router = useRouter();
  const [formState, setFormState] = useState(initialFormState);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      const savedContact = getRequestDraft().contact;
      setFormState({
        company: savedContact.companyName ?? "",
        email: savedContact.email ?? "",
        message: savedContact.message ?? "",
        name: savedContact.name ?? "",
        phone: savedContact.phone ?? "",
        preferredContact: savedContact.preferredContact ?? "이메일",
      });
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  const toContactDraft = (state: ContactFormState): ContactDraft => ({
    name: state.name,
    companyName: state.company,
    email: state.email,
    phone: state.phone,
    preferredContact: state.preferredContact,
    message: state.message,
  });

  const updateField = (field: keyof ContactFormState, value: string) => {
    setFormState((current) => {
      const nextState = { ...current, [field]: value };
      saveRequestDraft({ contact: toContactDraft(nextState) });
      return nextState;
    });

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.name.trim() || !formState.email.trim()) {
      setErrorMessage("이름과 이메일은 필수 입력 항목입니다.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const contactDraft = toContactDraft(formState);
    saveRequestDraft({ contact: contactDraft });

    try {
      const draft = {
        ...getRequestDraft(),
        contact: contactDraft,
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch("/api/requests/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(draft),
      });
      const result = (await response.json()) as SubmitRequestResponse;

      if (!result.ok) {
        setErrorMessage(
          result.message ||
            "제작 문의 저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
        );
        return;
      }

      if (!response.ok) {
        setErrorMessage(
          "제작 문의 저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
        );
        return;
      }

      window.sessionStorage.setItem(
        "makelocal_last_request_code",
        result.requestCode,
      );
      router.push("/request/complete");
    } catch {
      setErrorMessage(
        "제작 문의 저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      action="/request/complete"
      onSubmit={handleSubmit}
      className="grid gap-6 self-start xl:sticky xl:top-6"
    >
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">
          연락처 정보를 입력해주세요
        </h2>
        <p className="mt-3 leading-7 text-slate-600">
          제작 가능성 검토와 제조업체 연결 안내를 위해 필요한 정보입니다.
        </p>

        <div className="mt-6 grid gap-5">
          <TextField
            id="contact-name"
            label="이름"
            placeholder="홍길동"
            value={formState.name}
            required
            onInvalid={() =>
              setErrorMessage("이름과 이메일은 필수 입력 항목입니다.")
            }
            onChange={(value) => updateField("name", value)}
          />
          <TextField
            id="contact-company"
            label="회사명/소속"
            placeholder="회사명 또는 소속 기관"
            value={formState.company}
            onChange={(value) => updateField("company", value)}
          />
          <TextField
            id="contact-email"
            label="이메일"
            placeholder="name@example.com"
            type="email"
            value={formState.email}
            required
            onInvalid={() =>
              setErrorMessage("이름과 이메일은 필수 입력 항목입니다.")
            }
            onChange={(value) => updateField("email", value)}
          />
          <TextField
            id="contact-phone"
            label="휴대폰 번호"
            placeholder="010-0000-0000"
            type="tel"
            value={formState.phone}
            onChange={(value) => updateField("phone", value)}
          />

          <label className="grid gap-2" htmlFor="preferred-contact">
            <span className="text-sm font-bold text-slate-950">
              연락 선호 방식
            </span>
            <select
              id="preferred-contact"
              className="min-h-12 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              value={formState.preferredContact}
              onChange={(event) =>
                updateField("preferredContact", event.target.value)
              }
            >
              {contactMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2" htmlFor="contact-message">
            <span className="text-sm font-bold text-slate-950">
              추가 전달사항
            </span>
            <textarea
              id="contact-message"
              className="min-h-32 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              placeholder="매니저에게 전달하고 싶은 내용을 입력해주세요."
              value={formState.message}
              onChange={(event) => updateField("message", event.target.value)}
            />
          </label>
        </div>

        {errorMessage ? (
          <p
            className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-3">
          <Link
            href="/request/suppliers"
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-200 hover:bg-blue-50"
          >
            이전 단계로 돌아가기
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-700/20 transition hover:bg-blue-800"
          >
            {isSubmitting ? "저장 중입니다" : "제작 문의 제출하기"}
          </button>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-200 hover:bg-blue-50"
          >
            나중에 다시 작성하기
          </Link>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-500">
          제출 시 연락처와 이전 단계에서 업로드한 파일 메타데이터가 저장되며,
          이메일 발송은 아직 수행하지 않습니다.
        </p>
      </section>
    </form>
  );
}

function TextField({
  id,
  label,
  onChange,
  onInvalid,
  placeholder,
  required = false,
  type = "text",
  value,
}: {
  id: string;
  label: string;
  onChange: (value: string) => void;
  onInvalid?: () => void;
  placeholder: string;
  required?: boolean;
  type?: "email" | "tel" | "text";
  value: string;
}) {
  return (
    <label className="grid gap-2" htmlFor={id}>
      <span className="text-sm font-bold text-slate-950">
        {label}
        {required ? <span className="text-blue-700"> *</span> : null}
      </span>
      <input
        id={id}
        aria-required={required}
        className="min-h-12 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onInvalid={onInvalid}
      />
    </label>
  );
}
