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

alter table prototype_requests enable row level security;
alter table request_files enable row level security;
alter table rfq_drafts enable row level security;
alter table suppliers enable row level security;
alter table supplier_recommendations enable row level security;
alter table admin_notes enable row level security;
alter table request_status_logs enable row level security;
