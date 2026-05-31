# 메이크로컬

메이크로컬은 시제품 제작 수요자와 지역 중소 제조업체를 연결하는 AI 기반 제조 매칭 MVP입니다.

초기 MVP는 완전 자동 견적 플랫폼이 아니라, 사용자가 도면 또는 요구사항을 입력하면 AI가 제작의뢰서 초안과 예상 제작방법, 예상 견적 범위, 예상 납기 일정을 제안하고 운영자가 지역 제조업체 후보를 검토하는 파일럿 서비스로 시작합니다.

## 기술 스택

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Database / Storage
- OpenAI API 연동 예정
- Vercel 배포 예정

## 로컬 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`에 접속합니다.

## 환경변수 설정 방법

`.env.example`을 참고해 `.env.local`을 생성하고 값을 입력합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_ACCESS_TOKEN=
```

`SUPABASE_SERVICE_ROLE_KEY`와 `OPENAI_API_KEY`는 클라이언트에 노출하지 않습니다.

## 주요 폴더 구조

```txt
app/                  Next.js App Router 페이지와 API 라우트
components/landing/   랜딩페이지 섹션 컴포넌트
components/request/   제작 의뢰 흐름 컴포넌트 예정
components/admin/     관리자 화면 컴포넌트 예정
components/suppliers/ 제조업체 관련 컴포넌트 예정
lib/supabase/         Supabase 클라이언트 설정
lib/ai/               AI 호출 로직 예정
lib/storage/          파일 업로드 로직 예정
lib/matching/         업체 추천 로직 예정
types/                공통 TypeScript 타입
database/             Supabase SQL 초안과 seed 데이터
docs/                 제품, 아키텍처, DB, 작업 규칙 문서
```

## 현재 구현 범위

- Next.js + TypeScript + Tailwind CSS 초기 구조
- 기본 랜딩페이지 뼈대
- `/request/start` placeholder 페이지
- Supabase 클라이언트 설정 파일
- 환경변수 예시 파일
- DB 스키마 및 seed SQL 초안
- 기준 문서 정규 파일명 배치

## 아직 구현하지 않은 기능

- 제작 의뢰 폼
- 파일 업로드
- AI 제작의뢰서 생성
- 제조업체 추천
- 관리자 대시보드 실제 기능
- Supabase DB 저장
- Supabase Storage 업로드
- 회원가입 및 로그인
- 결제
- 채팅
- 리뷰
