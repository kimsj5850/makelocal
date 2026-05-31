# 메이크로컬 ARCHITECTURE.md v0.1

## 1. 문서 목적

이 문서는 메이크로컬 MVP 개발을 위한 프로젝트 구조, 폴더 규칙, 페이지 구성, 컴포넌트 분리 기준, 데이터 접근 방식, AI API 호출 방식, 파일 업로드 방식, 관리자 기능 구조를 정의한다.

Codex 또는 다른 개발 도구가 작업할 때 이 문서를 기준으로 프로젝트 구조를 유지해야 한다. 기능 추가나 수정이 필요하더라도 기존 구조를 임의로 변경하지 않는다.

## 2. 기술 스택

### 2.1 프론트엔드 및 앱 프레임워크

- Next.js App Router
- TypeScript
- Tailwind CSS

### 2.2 백엔드 및 데이터 저장

- Supabase Database
- Supabase Storage
- Supabase 클라이언트 라이브러리

### 2.3 AI 기능

- OpenAI API 또는 교체 가능한 AI Provider 구조
- AI 호출 로직은 `lib/ai/` 내부에 캡슐화한다.
- 페이지 컴포넌트에서 직접 AI API를 호출하지 않는다.

### 2.4 배포

- Vercel

### 2.5 버전 관리

- GitHub
- 기본 개발 브랜치: `dev`
- 안정 배포 브랜치: `main`

## 3. 전체 폴더 구조

초기 프로젝트 구조는 다음을 기준으로 한다.

```txt
makelocal/
  app/
    page.tsx
    request/
      start/
        page.tsx
      upload/
        page.tsx
      rfq/
        page.tsx
      suppliers/
        page.tsx
      review/
        page.tsx
      complete/
        page.tsx
    admin/
      requests/
        page.tsx
        [id]/
          page.tsx
      suppliers/
        page.tsx
        new/
          page.tsx
        [id]/
          page.tsx
    api/
      ai/
        generate-rfq/
          route.ts
      matching/
        recommend-suppliers/
          route.ts

  components/
    landing/
    request/
    admin/
    suppliers/
    common/
    ui/

  lib/
    supabase/
    ai/
    storage/
    matching/
    validators/
    constants/

  types/
    request.ts
    supplier.ts
    rfq.ts
    recommendation.ts
    common.ts

  database/
    schema.sql
    seed.sql

  docs/
    PRODUCT_SPEC.md
    ARCHITECTURE.md
    DB_SCHEMA.md
    CODEX_RULES.md
    TASK_LOG.md

  public/
    images/
    icons/
```

## 4. 라우팅 구조

### 4.1 공개 사용자 페이지

| 경로 | 목적 |
|---|---|
| `/` | 랜딩페이지 |
| `/request/start` | 제작 의뢰 시작 안내 |
| `/request/upload` | 도면 및 참고 파일 업로드 |
| `/request/rfq` | 제작의뢰서 자동 생성 및 수정 |
| `/request/suppliers` | 추천 업체 확인 및 선택 |
| `/request/review` | 최종 요약 및 연락처 입력 |
| `/request/complete` | 제출 완료 안내 |

### 4.2 관리자 페이지

| 경로 | 목적 |
|---|---|
| `/admin/requests` | 제작 의뢰 목록 |
| `/admin/requests/[id]` | 제작 의뢰 상세 |
| `/admin/suppliers` | 제조업체 목록 |
| `/admin/suppliers/new` | 제조업체 등록 |
| `/admin/suppliers/[id]` | 제조업체 상세 및 수정 |

### 4.3 API 라우트

| 경로 | 목적 |
|---|---|
| `/api/ai/generate-rfq` | 제작의뢰서, 제작방법, 예상 견적 범위, 예상 납기 생성 |
| `/api/matching/recommend-suppliers` | 조건 기반 제조업체 추천 |

## 5. 사용자 흐름 구조

사용자 제작 의뢰 흐름은 여러 페이지로 나누되, 하나의 제작 의뢰 세션 또는 임시 저장 데이터로 이어진다.

### 5.1 사용자 흐름

1. 랜딩페이지 접속
2. 제작 의뢰 시작
3. 파일 업로드 또는 도면 없이 진행
4. 제작의뢰서 자동 생성 및 수정
5. 추천 업체 선택 또는 운영자에게 맡기기
6. 최종 요약 확인 및 연락처 입력
7. 제작 문의 제출 완료

### 5.2 상태 저장 방식

초기 MVP에서는 다음 중 하나를 선택할 수 있다.

1. 단계별 입력값을 브라우저 상태 또는 localStorage에 임시 저장한 뒤 최종 제출 시 DB에 저장
2. 첫 단계에서 draft request를 생성하고 이후 단계마다 DB에 부분 저장

권장 방식은 2번이다. 이유는 파일 업로드와 중간 이탈 대응, 관리자 확인을 고려하면 draft 상태를 DB에 저장하는 편이 안전하기 때문이다.

단, 초기 개발 복잡도를 줄이기 위해 1차 구현에서는 localStorage 방식으로 시작하고, 파일 업로드 시점에 request draft를 생성하는 절충안을 사용할 수 있다.

## 6. 컴포넌트 분리 기준

### 6.1 기본 원칙

- 페이지 파일(`page.tsx`)은 라우팅과 데이터 준비 역할만 한다.
- 실제 UI는 `components/` 내부에 분리한다.
- 비즈니스 로직은 페이지 컴포넌트 안에 직접 작성하지 않는다.
- 공통 UI는 `components/ui/` 또는 `components/common/`에 둔다.
- 기능별 UI는 기능 폴더에 둔다.

### 6.2 컴포넌트 폴더 역할

| 폴더 | 역할 |
|---|---|
| `components/landing/` | 랜딩페이지 전용 섹션 |
| `components/request/` | 제작 의뢰 사용자 흐름 관련 컴포넌트 |
| `components/admin/` | 관리자 화면 컴포넌트 |
| `components/suppliers/` | 제조업체 카드, 목록, 폼 관련 컴포넌트 |
| `components/common/` | 여러 영역에서 쓰이는 공통 컴포넌트 |
| `components/ui/` | 버튼, 입력창, 카드, 배지 등 기본 UI 컴포넌트 |

### 6.3 예시 컴포넌트

```txt
components/
  landing/
    HeroSection.tsx
    ProblemSection.tsx
    SolutionSection.tsx
    ServiceFlowSection.tsx
    CtaSection.tsx

  request/
    FileUploadStep.tsx
    RfqEditor.tsx
    SupplierRecommendationList.tsx
    ReviewSummary.tsx
    ContactForm.tsx

  admin/
    AdminRequestTable.tsx
    AdminRequestDetail.tsx
    RequestStatusSelect.tsx
    AdminNoteBox.tsx

  suppliers/
    SupplierForm.tsx
    SupplierCard.tsx
    SupplierFilter.tsx
```

## 7. 데이터 접근 구조

### 7.1 Supabase 클라이언트

Supabase 관련 코드는 `lib/supabase/` 내부에 둔다.

```txt
lib/supabase/
  client.ts
  server.ts
  requests.ts
  suppliers.ts
  files.ts
```

### 7.2 데이터 접근 원칙

- 페이지 컴포넌트에서 Supabase 쿼리를 직접 길게 작성하지 않는다.
- DB 조회 및 저장 함수는 `lib/supabase/` 내부에 작성한다.
- 타입은 `types/` 내부에서 정의하고 재사용한다.
- Supabase Storage 업로드 로직은 `lib/storage/` 또는 `lib/supabase/files.ts`에 둔다.

### 7.3 예시 함수

```ts
createRequestDraft(input)
updateRequestRfq(requestId, rfqData)
getRequestById(requestId)
listRequests()
createSupplier(input)
listSuppliers(filters)
recommendSuppliers(requestId)
```

## 8. AI 기능 구조

### 8.1 기본 원칙

AI 호출은 페이지나 UI 컴포넌트에서 직접 하지 않는다.

AI 관련 로직은 다음 구조로 분리한다.

```txt
lib/ai/
  client.ts
  prompts.ts
  generateRfq.ts
  estimate.ts
  processRecommendation.ts
```

API 라우트는 `lib/ai/` 함수를 호출하는 얇은 계층으로 유지한다.

```txt
app/api/ai/generate-rfq/route.ts
```

### 8.2 AI 생성 대상

AI는 다음 데이터를 생성한다.

- 제작의뢰서 초안
- 추천 제작방법
- 예상 견적 범위
- 예상 납기 일정
- 견적 상승 요인
- 누락 정보 체크리스트
- 업체 확인 질문 리스트

### 8.3 AI 응답 원칙

- 확정 견적을 제공하지 않는다.
- 예상 견적은 범위로 제공한다.
- 알 수 없는 항목은 임의로 채우지 않고 “확인 필요” 또는 빈칸으로 둔다.
- AI 결과는 사용자가 수정할 수 있어야 한다.
- 실제 견적은 제조업체 검토 후 확정된다는 안내를 포함한다.

### 8.4 AI 응답 형식

AI 응답은 가능한 한 JSON 구조로 받는다.

예시:

```json
{
  "title": "알루미늄 브라켓 시제품 제작",
  "recommended_processes": ["MCT", "CNC 가공"],
  "material": "알루미늄 추정, 확인 필요",
  "quantity": null,
  "tolerance": "도면 확인 필요",
  "post_processing": "아노다이징 여부 확인 필요",
  "estimated_cost_range": {
    "min": 1000000,
    "max": 2000000,
    "currency": "KRW",
    "confidence": "low"
  },
  "estimated_lead_time": "영업일 기준 7~14일",
  "missing_information": [
    "수량",
    "재질 확정",
    "후처리 여부",
    "요구 공차"
  ],
  "supplier_questions": [
    "재질은 알루미늄 6061로 진행해도 되는지 확인 필요",
    "표면처리 여부 확인 필요"
  ],
  "cost_drivers": [
    "공차 요구 수준",
    "후처리 여부",
    "수량",
    "형상 복잡도"
  ]
}
```

## 9. 파일 업로드 구조

### 9.1 허용 파일 형식

초기 MVP에서 허용하는 파일 형식은 다음과 같다.

- PDF
- STEP
- STL
- JPG
- PNG

ZIP 파일은 허용하지 않는다.

### 9.2 파일 업로드 원칙

- 파일 없이도 다음 단계로 이동할 수 있어야 한다.
- 업로드 파일은 Supabase Storage에 저장한다.
- 파일 메타데이터는 `request_files` 테이블에 저장한다.
- 파일 크기 제한은 초기값 20MB로 설정한다.
- 허용되지 않는 확장자는 사용자에게 명확한 오류 메시지를 보여준다.

### 9.3 Storage 경로 예시

```txt
requests/{requestId}/{timestamp}_{originalFileName}
```

## 10. 제조업체 추천 구조

### 10.1 초기 추천 방식

초기 MVP에서는 AI 기반 복잡한 추천보다 룰 기반 추천을 우선한다.

추천 기준:

- 제작 공정 일치
- 지역 일치
- 소재 대응 가능 여부
- 소량 시제품 대응 여부
- 후처리 가능 여부 또는 협력 가능 여부
- 관리자 추천 메모

### 10.2 추천 결과 구조

추천 업체 카드에는 다음 정보를 표시한다.

- 업체명
- 지역
- 가능 공정
- 주요 장비
- 소량 시제품 가능 여부
- 추천 이유
- 선택 버튼

사용자는 추천 업체를 선택하거나 “운영자에게 맡기기”를 선택할 수 있다.

### 10.3 추천 로직 파일 위치

```txt
lib/matching/
  recommendSuppliers.ts
  scoring.ts
  matchReason.ts
```

## 11. 관리자 구조

### 11.1 관리자 기능 원칙

초기 MVP에서는 별도 관리자 로그인은 보류할 수 있으나, 배포 시에는 최소한의 접근 제한을 적용해야 한다.

개발 초기에는 환경변수 기반 간단한 관리자 접근 방식 또는 임시 보호 방식을 사용할 수 있다.

정식 서비스 전에는 반드시 인증 기반 관리자 보호가 필요하다.

### 11.2 관리자 주요 기능

- 제작 의뢰 목록 확인
- 제작 의뢰 상세 확인
- 첨부 파일 확인
- AI 생성 제작의뢰서 확인
- 최종 사용자 입력값 확인
- 추천 업체 확인 및 수정
- 운영자 메모 작성
- 상태값 변경
- 제조업체 DB 관리

## 12. 타입 정의 원칙

TypeScript 타입은 `types/`에 정의한다.

예시:

```txt
types/
  request.ts
  supplier.ts
  rfq.ts
  recommendation.ts
  common.ts
```

타입 이름 예시:

```ts
RequestStatus
PrototypeRequest
RequestFile
RfqDraft
Supplier
SupplierRecommendation
```

타입은 페이지, 컴포넌트, lib 함수에서 재사용한다.

## 13. 환경변수

초기 예상 환경변수는 다음과 같다.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_APP_URL=
ADMIN_ACCESS_TOKEN=
```

주의:

- `SUPABASE_SERVICE_ROLE_KEY`는 클라이언트에 노출되면 안 된다.
- `OPENAI_API_KEY`는 서버 API 라우트에서만 사용한다.
- 클라이언트 컴포넌트에서 직접 AI API 키를 사용하지 않는다.

## 14. UI 설계 원칙

- 전문적이지만 어렵지 않은 톤을 유지한다.
- 제조업체와 연구소/스타트업 모두 이해할 수 있는 용어를 사용한다.
- “확정 견적”처럼 과도한 기대를 주는 표현을 피한다.
- “예상 견적 범위”, “예상 납기”, “업체 검토 후 확정” 표현을 사용한다.
- 입력 단계가 많아도 사용자가 진행 상황을 알 수 있게 단계 표시를 제공한다.
- 사용자가 수정 가능한 AI 결과임을 명확히 표시한다.

## 15. 페이지별 구현 원칙

### 15.1 랜딩페이지

- 서비스의 문제와 해결을 빠르게 설명한다.
- “제작 의뢰 시작하기” CTA를 명확히 노출한다.
- 초기에는 파일럿 서비스임을 안내한다.

### 15.2 파일 업로드 페이지

- 파일 업로드 영역을 크게 보여준다.
- 허용 파일 형식을 명시한다.
- 파일 없이 진행 버튼을 제공한다.

### 15.3 제작의뢰서 페이지

- 표 형태로 구성한다.
- AI가 채운 항목과 사용자가 직접 입력해야 하는 항목을 구분한다.
- 예상 견적 범위와 예상 납기 일정은 안내성 정보로 표시한다.

### 15.4 추천 업체 페이지

- 추천 업체를 카드 형태로 보여준다.
- 추천 이유를 함께 제공한다.
- “운영자에게 맡기기” 선택지를 제공한다.

### 15.5 최종 요약 페이지

- 첨부 파일, 의뢰서, 추천 업체, 연락처를 한 번에 확인하게 한다.
- 제출 전 수정 가능 경로를 제공한다.

## 16. 개발 변경 원칙

- 한 번에 하나의 기능 단위만 수정한다.
- 작업 범위 밖의 파일을 수정하지 않는다.
- 공통 구조를 변경해야 할 경우 먼저 문서를 수정하고 이유를 남긴다.
- Codex 작업 시 수정 허용 파일과 수정 금지 파일을 명시한다.
- 작업 후 변경 파일 목록, 테스트 방법, 남은 이슈를 기록한다.

## 17. 향후 확장 고려사항

MVP 이후 다음 기능을 확장할 수 있도록 구조를 열어둔다.

- 의뢰자 회원가입 및 의뢰 이력 관리
- 제조업체 회원가입 및 직접 견적 제출
- 견적 비교 기능
- 메시지/채팅 기능
- 결제 및 수수료 관리
- 업체 리뷰/평가
- 실제 견적 데이터 기반 가격 예측
- CAD 형상 분석 기능
- 온프레미스/로컬 보안형 분석 기능

단, MVP 단계에서는 위 기능들을 구현하지 않는다.

