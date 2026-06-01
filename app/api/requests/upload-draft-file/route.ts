import { NextResponse } from "next/server";
import { validateFinalUploadFiles } from "@/lib/storage/fileValidation";
import { uploadDraftFilesToStorage } from "@/lib/supabase/files";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function isUploadedFile(value: FormDataEntryValue): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "size" in value &&
    typeof value.arrayBuffer === "function"
  );
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const draftId = formData.get("draftId");
    const files = formData
      .getAll("files")
      .filter(isUploadedFile)
      .filter((file) => file.size > 0);

    if (typeof draftId !== "string" || !draftId.trim()) {
      return NextResponse.json(
        {
          ok: false,
          message: "파일 업로드 식별자가 없습니다.",
        },
        { status: 400 },
      );
    }

    const validationMessage = validateFinalUploadFiles(files);

    if (validationMessage) {
      return NextResponse.json(
        {
          ok: false,
          message: validationMessage,
        },
        { status: 400 },
      );
    }

    const supabase = createSupabaseServerClient();
    const uploadedFiles = await uploadDraftFilesToStorage(
      supabase,
      draftId,
      files,
    );

    return NextResponse.json({
      ok: true,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        message: "첨부 파일 업로드 중 문제가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
