"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RequestStepIndicator } from "@/components/request/RequestStepIndicator";
import {
  ALLOWED_FILE_EXTENSIONS,
  formatUploadFileSize,
  validateFinalUploadFiles,
} from "@/lib/storage/fileValidation";
import {
  getRequestDraft,
  saveRequestDraft,
  updateRequestDraft,
} from "@/lib/storage/requestDraftStorage";
import type { RequestFileDraft } from "@/types/request";

const maxFileCount = 5;

type UploadDraftFileResponse =
  | {
      ok: true;
      files: RequestFileDraft[];
    }
  | {
      ok: false;
      message: string;
    };

export function FileUploadStep() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<RequestFileDraft[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      setSelectedFiles(getRequestDraft().files);
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  const addFiles = async (fileList: FileList | File[]) => {
    const incomingFiles = Array.from(fileList);

    if (incomingFiles.length === 0) {
      return;
    }

    if (selectedFiles.length + incomingFiles.length > maxFileCount) {
      setErrorMessage("파일은 최대 5개까지 첨부할 수 있습니다.");
      return;
    }

    const validationMessage = validateFinalUploadFiles(incomingFiles);

    if (validationMessage) {
      setErrorMessage(
        validationMessage === "지원하지 않는 파일 형식입니다."
          ? "지원하지 않는 파일 형식입니다. PDF, STEP, STL, JPG, PNG 파일만 첨부할 수 있습니다."
          : validationMessage,
      );
      return;
    }

    setIsUploading(true);
    setErrorMessage("");

    try {
      const draft = getRequestDraft();
      const formData = new FormData();

      saveRequestDraft({ draftId: draft.draftId });
      formData.append("draftId", draft.draftId);
      incomingFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/requests/upload-draft-file", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as UploadDraftFileResponse;

      if (!response.ok) {
        setErrorMessage(
          result.ok
            ? "첨부 파일 업로드 중 문제가 발생했습니다."
            : result.message || "첨부 파일 업로드 중 문제가 발생했습니다.",
        );
        return;
      }

      if (!result.ok) {
        setErrorMessage(
          result.message || "첨부 파일 업로드 중 문제가 발생했습니다.",
        );
        return;
      }

      const updatedFiles = [...selectedFiles, ...result.files];
      setSelectedFiles(updatedFiles);
      updateRequestDraft("files", updatedFiles);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      setErrorMessage("첨부 파일 업로드 중 문제가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = selectedFiles.filter(
      (selectedFile) => selectedFile.id !== fileId,
    );
    setSelectedFiles(updatedFiles);
    updateRequestDraft("files", updatedFiles);
    setErrorMessage("");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 sm:px-8 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-lg border border-slate-200 bg-gradient-to-b from-blue-50 to-white p-6 shadow-sm sm:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-md border border-blue-100 bg-white px-3 py-1.5 text-sm font-semibold text-blue-700 shadow-sm">
              1단계 · 파일 첨부
            </div>
            <h1 className="mt-6 break-keep text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              도면 또는 참고 파일을 첨부해주세요
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              PDF 도면, STEP/STL 3D 모델, JPG/PNG 이미지 파일을 첨부할 수
              있습니다. 아직 도면이 없다면 파일 없이 다음 단계로 진행할 수
              있습니다.
            </p>
          </div>
        </section>

        <div className="mt-8">
          <RequestStepIndicator currentStep={1} />
        </div>

        <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold text-blue-700">파일 첨부</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                파일을 선택하거나 이곳에 끌어다 놓으세요
              </h2>
              <p className="mt-3 leading-7 text-slate-600">
                PDF, STEP, STL, JPG, PNG 파일을 첨부할 수 있습니다.
              </p>

              <div
                className="mt-6 rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/60 p-8 text-center"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  void addFiles(event.dataTransfer.files);
                }}
              >
                <input
                  ref={fileInputRef}
                  className="sr-only"
                  id="request-files"
                  multiple
                  type="file"
                  accept=".pdf,.step,.stp,.stl,.jpg,.jpeg,.png"
                  disabled={isUploading}
                  onChange={(event) => {
                    if (event.target.files) {
                      void addFiles(event.target.files);
                    }
                  }}
                />
                <p className="text-lg font-bold text-slate-950">
                  도면과 참고 자료를 첨부하세요
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  파일당 최대 20MB, 최대 5개까지 첨부할 수 있습니다.
                </p>
                <label
                  htmlFor="request-files"
                  className={`mt-6 inline-flex min-h-12 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-700/20 transition ${
                    isUploading
                      ? "cursor-wait bg-blue-400"
                      : "cursor-pointer bg-blue-700 hover:bg-blue-800"
                  }`}
                >
                  {isUploading ? "업로드 중입니다" : "파일 선택"}
                </label>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                {ALLOWED_FILE_EXTENSIONS.map((extension) => (
                  <span
                    key={extension}
                    className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5"
                  >
                    .{extension}
                  </span>
                ))}
              </div>

              {errorMessage ? (
                <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {errorMessage}
                </p>
              ) : null}
            </div>

            <aside className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-slate-950">
                  선택된 파일
                </h2>
                <span className="rounded-md bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                  {selectedFiles.length}/{maxFileCount}
                </span>
              </div>

              {selectedFiles.length > 0 ? (
                <ul className="mt-5 grid gap-3">
                  {selectedFiles.map((selectedFile) => (
                    <li
                      key={selectedFile.id}
                      className="rounded-md border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="break-all text-sm font-bold text-slate-950">
                            {selectedFile.name}
                          </p>
                          <p className="mt-2 text-xs text-slate-500">
                            {selectedFile.extension.toUpperCase()} ·{" "}
                            {formatUploadFileSize(selectedFile.size)} ·{" "}
                            {selectedFile.storagePath
                              ? "업로드 완료"
                              : "임시 저장"}
                          </p>
                        </div>
                        <button
                          className="shrink-0 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                          type="button"
                          onClick={() => removeFile(selectedFile.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-5 rounded-md border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600">
                  아직 선택된 파일이 없습니다. 파일 없이도 다음 단계로 진행할 수
                  있습니다.
                </div>
              )}
            </aside>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h2 className="text-xl font-bold text-slate-950">
            도면이 아직 없어도 괜찮습니다
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            스케치, 사진, 설명만으로도 다음 단계에서 제작의뢰서를 작성할 수
            있습니다. 부족한 정보는 운영자 검토 과정에서 보완할 수 있습니다.
          </p>
        </section>

        <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                다음 단계에서 의뢰서 정보를 정리합니다
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                첨부한 파일은 즉시 Supabase Storage에 임시 업로드되고,
                최종 제출 시 파일 메타데이터가 제작 문의에 연결됩니다.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/request/start"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-200 hover:bg-blue-50"
              >
                이전 단계로 돌아가기
              </Link>
              <Link
                href="/request/rfq"
                aria-disabled={isUploading}
                className={`inline-flex min-h-12 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-700/20 transition ${
                  isUploading
                    ? "pointer-events-none bg-blue-400"
                    : "bg-blue-700 hover:bg-blue-800"
                }`}
              >
                파일 첨부 후 다음 단계로
              </Link>
              <Link
                href="/request/rfq"
                className={`inline-flex min-h-12 items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold transition ${
                  selectedFiles.length === 0
                    ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                    : "border-slate-200 bg-white text-slate-900 hover:border-blue-200 hover:bg-blue-50"
                }`}
              >
                도면 없이 진행하기
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
