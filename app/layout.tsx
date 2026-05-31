import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "메이크로컬 | AI 기반 제조 매칭 파일럿",
  description:
    "시제품 제작 문의를 제작업체가 검토하기 쉬운 의뢰서로 정리하고 적합한 지역 제조업체 후보를 추천합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
