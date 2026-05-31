# 메이크로컬 DB_SCHEMA.md v0.1

## 1. 문서 목적

이 문서는 메이크로컬 MVP의 데이터베이스 구조를 정의한다.

MVP 단계에서는 회원가입과 로그인을 보류하지만, 제작 의뢰, 첨부 파일, AI 제작의뢰서, 제조업체 DB, 추천 업체, 운영자 메모, 상태 관리 데이터는 구조적으로 저장해야 한다.

향후 의뢰자 회원가입, 제조업체 회원가입, 직접 견적 제출, 결제, 리뷰, 자동 견적 고도화로 확장할 수 있도록 기본 구조를 단순하지만 확장 가능하게 설계한다.

## 2. 설계 원칙

1. MVP에서는 로그인 없이 제작 의뢰를 받을 수 있어야 한다.
2. 연락처 정보는 제작 의뢰 테이블에 저장한다.
3. 파일은 Supabase Storage에 저장하고, 파일 메타데이터는 DB에 저장한다.
4. AI가 생성한 초안과 사용자가 수정한 최종 입력값은 구분해서 저장한다.
5. 제조업체 DB는 초기에는 단순하게 시작하고, 실제 운영 데이터가 쌓이면 확장한다.
6. 추천 업체는 AI/룰 기반 추천 결과와 사용자의 최종 선택을 구분해 저장한다.
7. 운영자가 검토하고 상태를 변경할 수 있어야 한다.
8. 모든 주요 테이블에는 `created_at`, `updated_at`을 둔다.
9. 주요 상태값은 enum 또는 제한된 문자열로 관리한다.
10. 향후 자동 견적 고도화를 위해 실제 견적 데이터 저장 테이블을 추가할 수 있게 설계한다.

## 3. 핵심 테이블 목록

MVP에 필요한 핵심 테이블은 다음과 같다.

1. `prototype_requests` : 제작 의뢰 기본 정보
2. `request_files` : 제작 의뢰 첨부 파일
3. `rfq_drafts` : AI 생성 제작의뢰서 및 사용자 수정 최종 의뢰서
4. `suppliers` : 제조업체 DB
5. `supplier_recommendations` : 추천 업체 목록 및 선택 정보
6. `admin_notes` : 운영자 메모
7. `request_status_logs` : 상태 변경 이력

향후 확장 테이블은 다음과 같다.

1. `supplier_quotes` : 제조업체 견적 제출 내역
2. `users` : 의뢰자 및 제조업체 계정
3. `supplier_profiles` : 제조업체 공개 프로필
4. `reviews` : 제작 후기 및 평가
5. `payments` : 결제 및 수수료 관리

## 4. 테이블 상세 설계

## 4.1 `prototype_requests`

제작 의뢰의 기본 정보와 연락처, 현재 상태를 저장한다.

### 역할

- 사용자의 제작 문의 1건을 나타낸다.
- 로그인 없이 접수되므로 연락처 정보를 포함한다.
- 제작의뢰서 상세 내용은 `rfq_drafts`에 분리 저장한다.
- 첨부 파일은 `request_files`에 분리 저장한다.

### 컬럼

| 컬럼명 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `id` | uuid | O | 제작 의뢰 ID |
| `request_code` | text | O | 사용자 안내용 접수번호 |
| `status` | text | O | 현재 의뢰 상태 |
| `title` | text | X | 의뢰 제목 |
| `description` | text | X | 제품/부품 설명 |
| `purpose` | text | X | 제작 목적 |
| `contact_name` | text | O | 의뢰자 이름 |
| `company_name` | text | X | 회사명/소속 |
| `email` | text | O | 이메일 |
| `phone` | text | X | 휴대폰 번호 |
| `preferred_contact` | text | X | 연락 선호 방식 |
| `source` | text | X | 유입 경로 |
| `submitted_at` | timestamptz | X | 최종 제출 시각 |
| `created_at` | timestamptz | O | 생성 시각 |
| `updated_at` | timestamptz | O | 수정 시각 |

### 상태값

`status`는 다음 값 중 하나를 사용한다.

- `draft` : 작성 중
- `submitted` : 접수 완료
- `reviewing` : 운영자 검토 중
- `needs_info` : 정보 보완 필요
- `supplier_recommended` : 업체 추천 완료
- `quote_requested` : 견적 요청 중
- `quote_received` : 견적 회신 완료
- `in_production` : 제작 진행 중
- `completed` : 완료
- `on_hold` : 보류
- `cancelled` : 취소

## 4.2 `request_files`

제작 의뢰에 첨부된 파일의 메타데이터를 저장한다.

### 역할

- PDF, STEP, STL, JPG, PNG 파일의 정보를 저장한다.
- 실제 파일은 Supabase Storage에 저장한다.
- 파일 없이도 제작 의뢰가 가능하므로 이 테이블은 선택적 관계다.

### 컬럼

| 컬럼명 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `id` | uuid | O | 파일 ID |
| `request_id` | uuid | O | 제작 의뢰 ID |
| `original_file_name` | text | O | 원본 파일명 |
| `stored_file_name` | text | O | 저장된 파일명 |
| `storage_path` | text | O | Supabase Storage 경로 |
| `file_type` | text | O | 파일 확장자 또는 MIME 타입 |
| `file_size` | integer | X | 파일 크기 byte |
| `uploaded_at` | timestamptz | O | 업로드 시각 |
| `created_at` | timestamptz | O | 생성 시각 |

### 허용 파일 형식

- `pdf`
- `step`
- `stp`
- `stl`
- `jpg`
- `jpeg`
- `png`

초기 MVP에서는 ZIP 파일을 허용하지 않는다.

## 4.3 `rfq_drafts`

AI가 생성한 제작의뢰서 초안과 사용자가 수정한 최종 제작의뢰서 데이터를 저장한다.

### 역할

- AI 결과와 사용자가 확정한 값을 구분한다.
- 제작방법 추천, 예상 견적 범위, 예상 납기, 누락 정보, 업체 확인 질문 등을 저장한다.
- JSONB 컬럼을 활용해 초기에는 유연하게 저장하되, 주요 검색이 필요한 값은 별도 컬럼으로도 둔다.

### 컬럼

| 컬럼명 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `id` | uuid | O | 제작의뢰서 ID |
| `request_id` | uuid | O | 제작 의뢰 ID |
| `ai_generated` | jsonb | X | AI가 생성한 전체 원본 응답 |
| `final_rfq` | jsonb | X | 사용자가 수정·확정한 최종 의뢰서 |
| `recommended_processes` | text[] | X | 추천 제작 공정 |
| `material` | text | X | 소재 |
| `quantity` | text | X | 수량 |
| `tolerance` | text | X | 공차 |
| `post_processing` | text | X | 후처리 |
| `assembly_required` | boolean | X | 조립 여부 |
| `estimated_cost_min` | integer | X | 예상 견적 최소값 KRW |
| `estimated_cost_max` | integer | X | 예상 견적 최대값 KRW |
| `estimated_lead_time_min_days` | integer | X | 예상 납기 최소일 |
| `estimated_lead_time_max_days` | integer | X | 예상 납기 최대일 |
| `cost_confidence` | text | X | 견적 신뢰도 |
| `missing_information` | text[] | X | 누락 정보 |
| `supplier_questions` | text[] | X | 업체 확인 질문 |
| `cost_drivers` | text[] | X | 견적 상승 요인 |
| `created_at` | timestamptz | O | 생성 시각 |
| `updated_at` | timestamptz | O | 수정 시각 |

### 참고

`final_rfq`에는 사용자가 최종 확인한 전체 제작의뢰서 표 데이터를 저장한다.

예시 구조:

```json
{
  "title": "알루미늄 브라켓 시제품 제작",
  "part_description": "센서 고정용 브라켓",
  "purpose": "시제품 검증용",
  "material": "알루미늄 6061",
  "quantity": "5개",
  "tolerance": "일반 공차",
  "post_processing": "아노다이징 검토",
  "assembly_required": false,
  "notes": "외관보다 기능 검증이 중요함"
}
```

## 4.4 `suppliers`

제조업체 DB를 저장한다.

### 역할

- 관리자용 제조업체 DB다.
- 초기에는 외부 공개용이 아니라 내부 매칭용으로 사용한다.
- 향후 제조업체 회원가입 및 공개 프로필로 확장할 수 있다.

### 컬럼

| 컬럼명 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `id` | uuid | O | 업체 ID |
| `company_name` | text | O | 업체명 |
| `region` | text | X | 지역 |
| `address` | text | X | 주소 |
| `main_processes` | text[] | X | 가능 공정 |
| `machines` | text[] | X | 보유 장비 |
| `materials` | text[] | X | 대응 소재 |
| `small_batch_available` | boolean | X | 소량 시제품 가능 여부 |
| `post_processing_available` | boolean | X | 후처리 가능 여부 |
| `average_lead_time` | text | X | 평균 납기 |
| `contact_name` | text | X | 담당자명 |
| `phone` | text | X | 연락처 |
| `email` | text | X | 이메일 |
| `website` | text | X | 웹사이트 |
| `description` | text | X | 업체 설명 |
| `admin_memo` | text | X | 관리자 메모 |
| `is_active` | boolean | O | 사용 여부 |
| `created_at` | timestamptz | O | 생성 시각 |
| `updated_at` | timestamptz | O | 수정 시각 |

### 주요 공정 예시

- 선반
- 밀링
- MCT
- CNC
- 판금
- 레이저 절단
- 용접
- 표면처리
- 지그 제작
- 3D프린팅
- 사출 전 단계

## 4.5 `supplier_recommendations`

제작 의뢰별 추천 업체와 사용자의 선택 정보를 저장한다.

### 역할

- AI 또는 룰 기반으로 추천된 업체 목록을 저장한다.
- 추천 점수와 추천 사유를 저장한다.
- 사용자가 특정 업체를 선택했는지, 운영자에게 맡겼는지 저장한다.

### 컬럼

| 컬럼명 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `id` | uuid | O | 추천 ID |
| `request_id` | uuid | O | 제작 의뢰 ID |
| `supplier_id` | uuid | X | 업체 ID |
| `recommendation_rank` | integer | X | 추천 순위 |
| `score` | numeric | X | 추천 점수 |
| `match_reason` | text | X | 추천 사유 |
| `matched_processes` | text[] | X | 매칭된 공정 |
| `is_user_selected` | boolean | O | 사용자가 선택했는지 여부 |
| `is_operator_delegated` | boolean | O | 운영자에게 맡기기 선택 여부 |
| `admin_selected` | boolean | O | 운영자가 최종 추천했는지 여부 |
| `created_at` | timestamptz | O | 생성 시각 |

### 운영자에게 맡기기 처리

사용자가 “운영자에게 맡기기”를 선택한 경우 `supplier_id`는 null일 수 있으며, `is_operator_delegated`를 true로 저장한다.

## 4.6 `admin_notes`

운영자 메모를 저장한다.

### 역할

- 제작 의뢰별 운영자 메모를 남긴다.
- 고객과의 통화 내용, 업체 문의 상황, 보완 필요사항 등을 기록한다.

### 컬럼

| 컬럼명 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `id` | uuid | O | 메모 ID |
| `request_id` | uuid | O | 제작 의뢰 ID |
| `note` | text | O | 메모 내용 |
| `created_by` | text | X | 작성자 |
| `created_at` | timestamptz | O | 작성 시각 |

## 4.7 `request_status_logs`

제작 의뢰의 상태 변경 이력을 저장한다.

### 역할

- 상태가 언제 어떻게 변경되었는지 추적한다.
- 운영상 문제가 생겼을 때 이력을 확인할 수 있다.

### 컬럼

| 컬럼명 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `id` | uuid | O | 로그 ID |
| `request_id` | uuid | O | 제작 의뢰 ID |
| `from_status` | text | X | 이전 상태 |
| `to_status` | text | O | 변경 상태 |
| `changed_by` | text | X | 변경자 |
| `memo` | text | X | 변경 사유 |
| `created_at` | timestamptz | O | 생성 시각 |

## 5. SQL 스키마 초안

아래 SQL은 Supabase PostgreSQL 기준 초안이다. 실제 개발 시에는 `database/schema.sql`에 저장한다.

```sql
create extension if not exists "uuid-ossp";

create table if not exists prototype_requests (
  id uuid primary key default uuid_generate_v4(),
  request_code text not null unique,
  status text not null default 'draft',
  title text,
  description text,
  purpose text,
  contact_name text,
  company_name text,
  email text,
  phone text,
  preferred_contact text,
  source text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists request_files (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid not null references prototype_requests(id) on delete cascade,
  original_file_name text not null,
  stored_file_name text not null,
  storage_path text not null,
  file_type text not null,
  file_size integer,
  uploaded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists rfq_drafts (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid not null references prototype_requests(id) on delete cascade,
  ai_generated jsonb,
  final_rfq jsonb,
  recommended_processes text[],
  material text,
  quantity text,
  tolerance text,
  post_processing text,
  assembly_required boolean,
  estimated_cost_min integer,
  estimated_cost_max integer,
  estimated_lead_time_min_days integer,
  estimated_lead_time_max_days integer,
  cost_confidence text,
  missing_information text[],
  supplier_questions text[],
  cost_drivers text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists suppliers (
  id uuid primary key default uuid_generate_v4(),
  company_name text not null,
  region text,
  address text,
  main_processes text[],
  machines text[],
  materials text[],
  small_batch_available boolean default false,
  post_processing_available boolean default false,
  average_lead_time text,
  contact_name text,
  phone text,
  email text,
  website text,
  description text,
  admin_memo text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists supplier_recommendations (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid not null references prototype_requests(id) on delete cascade,
  supplier_id uuid references suppliers(id) on delete set null,
  recommendation_rank integer,
  score numeric,
  match_reason text,
  matched_processes text[],
  is_user_selected boolean not null default false,
  is_operator_delegated boolean not null default false,
  admin_selected boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists admin_notes (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid not null references prototype_requests(id) on delete cascade,
  note text not null,
  created_by text,
  created_at timestamptz not null default now()
);

create table if not exists request_status_logs (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid not null references prototype_requests(id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_by text,
  memo text,
  created_at timestamptz not null default now()
);
```

## 6. 인덱스 설계

초기 MVP에서 필요한 인덱스는 다음과 같다.

```sql
create index if not exists idx_prototype_requests_status
on prototype_requests(status);

create index if not exists idx_prototype_requests_created_at
on prototype_requests(created_at desc);

create index if not exists idx_request_files_request_id
on request_files(request_id);

create index if not exists idx_rfq_drafts_request_id
on rfq_drafts(request_id);

create index if not exists idx_suppliers_region
on suppliers(region);

create index if not exists idx_suppliers_is_active
on suppliers(is_active);

create index if not exists idx_supplier_recommendations_request_id
on supplier_recommendations(request_id);

create index if not exists idx_admin_notes_request_id
on admin_notes(request_id);

create index if not exists idx_request_status_logs_request_id
on request_status_logs(request_id);
```

## 7. updated_at 자동 갱신 함수

Supabase PostgreSQL에서 `updated_at` 자동 갱신을 위해 다음 트리거를 사용할 수 있다.

```sql
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_prototype_requests_updated_at
before update on prototype_requests
for each row
execute procedure update_updated_at_column();

create trigger update_rfq_drafts_updated_at
before update on rfq_drafts
for each row
execute procedure update_updated_at_column();

create trigger update_suppliers_updated_at
before update on suppliers
for each row
execute procedure update_updated_at_column();
```

## 8. RLS 정책 초안

MVP 초기에는 로그인 기능이 없으므로 RLS 설정을 신중히 다뤄야 한다.

권장 방식은 다음과 같다.

1. 공개 사용자는 API Route를 통해서만 제작 의뢰를 생성한다.
2. 클라이언트에서 직접 Supabase에 쓰기 권한을 열지 않는다.
3. 서버 API에서 서비스 역할 키를 사용해 DB에 저장한다.
4. 관리자 페이지는 임시 토큰 또는 Basic Auth로 보호한다.
5. 정식 서비스 전에는 Supabase Auth 기반으로 전환한다.

따라서 초기에는 모든 테이블에 RLS를 켜고, 직접 클라이언트 접근을 제한하는 방식을 권장한다.

예시:

```sql
alter table prototype_requests enable row level security;
alter table request_files enable row level security;
alter table rfq_drafts enable row level security;
alter table suppliers enable row level security;
alter table supplier_recommendations enable row level security;
alter table admin_notes enable row level security;
alter table request_status_logs enable row level security;
```

실제 정책은 서버 API 구조가 정해진 뒤 추가한다.

## 9. Supabase Storage 설계

### 9.1 버킷

초기 버킷 이름:

```txt
request-files
```

### 9.2 저장 경로

```txt
requests/{requestId}/{timestamp}_{safeFileName}
```

예시:

```txt
requests/0d8c8f1e-1234-4a9c-9c9a-111111111111/1718000000_bracket.step
```

### 9.3 파일 접근 정책

MVP 초기에는 파일을 공개하지 않는다.
관리자 화면에서 signed URL을 생성해 일정 시간 동안만 확인하는 방식을 사용한다.

## 10. 데이터 흐름

### 10.1 제작 의뢰 생성 흐름

1. 사용자가 파일 업로드 페이지에서 파일을 업로드하거나 도면 없이 진행한다.
2. 시스템이 `prototype_requests`에 draft 상태의 레코드를 생성한다.
3. 파일이 있다면 Supabase Storage에 업로드한다.
4. 파일 메타데이터를 `request_files`에 저장한다.
5. 사용자가 제작의뢰서 페이지에서 정보를 입력한다.
6. AI가 제작의뢰서 초안을 생성한다.
7. AI 결과를 `rfq_drafts.ai_generated`에 저장한다.
8. 사용자가 수정·확정한 결과를 `rfq_drafts.final_rfq`에 저장한다.
9. 추천 업체 결과를 `supplier_recommendations`에 저장한다.
10. 최종 제출 시 `prototype_requests.status`를 `submitted`로 변경한다.
11. 상태 변경 내역을 `request_status_logs`에 저장한다.

### 10.2 관리자 검토 흐름

1. 관리자가 `prototype_requests` 목록을 확인한다.
2. 특정 의뢰의 파일, 의뢰서, 추천 업체 정보를 확인한다.
3. 필요한 경우 `admin_notes`에 메모를 작성한다.
4. 업체 추천을 수정하거나 추가한다.
5. 상태값을 변경한다.
6. 상태 변경 이력은 `request_status_logs`에 저장한다.

## 11. 향후 확장용 테이블 초안

MVP 이후 제조업체 직접 견적 제출 기능을 추가할 경우 다음 테이블을 고려한다.

### 11.1 `supplier_quotes`

| 컬럼명 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | 견적 ID |
| `request_id` | uuid | 제작 의뢰 ID |
| `supplier_id` | uuid | 제조업체 ID |
| `quote_amount` | integer | 견적 금액 |
| `lead_time_days` | integer | 납기 일수 |
| `quote_memo` | text | 견적 메모 |
| `valid_until` | date | 견적 유효일 |
| `status` | text | 견적 상태 |
| `created_at` | timestamptz | 생성 시각 |

### 11.2 `users`

향후 로그인 도입 시 Supabase Auth와 연결해 별도 프로필 테이블을 둔다.

| 컬럼명 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | 사용자 ID, auth.users 참조 |
| `role` | text | requester, supplier, admin |
| `name` | text | 이름 |
| `company_name` | text | 회사명 |
| `phone` | text | 연락처 |
| `created_at` | timestamptz | 생성 시각 |

## 12. 초기 seed 데이터 예시

초기 개발 테스트를 위해 다음과 같은 제조업체 seed 데이터를 사용할 수 있다.

```sql
insert into suppliers (
  company_name,
  region,
  main_processes,
  machines,
  materials,
  small_batch_available,
  post_processing_available,
  average_lead_time,
  description,
  is_active
) values
(
  '대구정밀가공 샘플업체',
  '대구',
  array['MCT', 'CNC', '밀링'],
  array['MCT 3대', 'CNC 2대'],
  array['알루미늄', '스틸', 'SUS'],
  true,
  false,
  '7~14일',
  '소량 시제품 및 정밀 부품 가공 가능 업체 예시 데이터',
  true
),
(
  '로컬판금 샘플업체',
  '대구',
  array['판금', '레이저 절단', '용접'],
  array['레이저 절단기', '절곡기', '용접기'],
  array['스틸', 'SUS', '알루미늄 판재'],
  true,
  true,
  '5~10일',
  '판금 시제품 및 케이스 제작 가능 업체 예시 데이터',
  true
);
```

## 13. Codex 작업 시 주의사항

Codex가 DB 관련 작업을 할 때는 다음을 지켜야 한다.

1. 기존 테이블명을 임의로 변경하지 않는다.
2. 컬럼명을 변경해야 할 경우 변경 이유를 먼저 설명한다.
3. 새로운 테이블을 추가할 때는 이 문서에 먼저 반영한다.
4. SQL은 `database/schema.sql`에 저장한다.
5. seed 데이터는 `database/seed.sql`에 저장한다.
6. Supabase 쿼리 함수는 `lib/supabase/` 내부에 작성한다.
7. 타입 정의는 `types/` 내부에 작성한다.
8. 페이지 컴포넌트 안에 긴 쿼리 로직을 직접 작성하지 않는다.

## 14. 현재 결정된 DB 방향

- 로그인 없이 제작 의뢰 가능
- 제작 의뢰별 연락처 저장
- 파일은 Supabase Storage에 저장
- 파일 메타데이터는 DB 저장
- AI 생성값과 사용자 최종값 구분 저장
- 제조업체 DB는 단순하게 시작
- 추천 업체는 request별로 저장
- 운영자 메모와 상태 이력 저장
- 실제 견적 데이터는 MVP 이후 확장 테이블로 추가

