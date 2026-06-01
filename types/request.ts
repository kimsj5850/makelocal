export type RequestFileDraft = {
  id: string;
  name: string;
  size: number;
  type: string;
  extension: string;
};

export type RfqDraft = {
  title?: string;
  partDescription?: string;
  purpose?: string;
  recommendedProcess?: string;
  material?: string;
  quantity?: string;
  mainDimensions?: string;
  tolerance?: string;
  postProcessing?: string;
  assemblyRequired?: string;
  desiredLeadTime?: string;
  estimatedCostRange?: string;
  estimatedLeadTime?: string;
  costDrivers?: string;
  supplierQuestions?: string;
  additionalRequests?: string;
};

export type SelectedSupplierDraft = {
  selectionType: "supplier" | "manager" | "none";
  supplierId?: string;
  supplierName?: string;
  region?: string;
  processes?: string[];
  matchReason?: string;
};

export type ContactDraft = {
  name?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  preferredContact?: string;
  message?: string;
};

export type RequestDraft = {
  files: RequestFileDraft[];
  rfq: RfqDraft;
  selectedSupplier: SelectedSupplierDraft;
  contact: ContactDraft;
  updatedAt: string;
};

export type SubmitRequestSuccessResponse = {
  ok: true;
  requestId: string;
  requestCode: string;
};

export type SubmitRequestErrorResponse = {
  ok: false;
  message: string;
};

export type SubmitRequestResponse =
  | SubmitRequestSuccessResponse
  | SubmitRequestErrorResponse;

export type PrototypeRequestStatus =
  | "draft"
  | "submitted"
  | "reviewing"
  | "needs_info"
  | "supplier_recommended"
  | "quote_requested"
  | "quote_received"
  | "in_production"
  | "completed"
  | "on_hold"
  | "cancelled"
  | string;

export type PrototypeRequestListItem = {
  id: string;
  request_code: string;
  status: PrototypeRequestStatus;
  title: string | null;
  contact_name: string | null;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  submitted_at: string | null;
  created_at: string;
};

export type PrototypeRequestRecord = PrototypeRequestListItem & {
  description: string | null;
  purpose: string | null;
  preferred_contact: string | null;
  updated_at: string;
};

export type RequestFileRecord = {
  id: string;
  request_id: string;
  original_file_name: string;
  stored_file_name: string;
  storage_path: string;
  file_type: string;
  file_size: number | null;
  uploaded_at: string;
  created_at: string;
};

export type RfqDraftRecord = {
  id: string;
  request_id: string;
  ai_generated: unknown | null;
  final_rfq: RfqDraft | Record<string, unknown> | null;
  recommended_processes: string[] | null;
  material: string | null;
  quantity: string | null;
  tolerance: string | null;
  post_processing: string | null;
  assembly_required: boolean | null;
  estimated_cost_min: number | null;
  estimated_cost_max: number | null;
  estimated_lead_time_min_days: number | null;
  estimated_lead_time_max_days: number | null;
  cost_confidence: string | null;
  missing_information: string[] | null;
  supplier_questions: string[] | null;
  cost_drivers: string[] | null;
  created_at: string;
  updated_at: string;
};

export type SupplierRecommendationRecord = {
  id: string;
  request_id: string;
  supplier_id: string | null;
  recommendation_rank: number | null;
  score: number | null;
  match_reason: string | null;
  matched_processes: string[] | null;
  is_user_selected: boolean;
  is_operator_delegated: boolean;
  admin_selected: boolean;
  created_at: string;
};

export type RequestStatusLogRecord = {
  id: string;
  request_id: string;
  from_status: PrototypeRequestStatus | null;
  to_status: PrototypeRequestStatus;
  changed_by: string | null;
  memo: string | null;
  created_at: string;
};

export type AdminNoteRecord = {
  id: string;
  request_id: string;
  note: string;
  created_by: string | null;
  created_at: string;
};

export type PrototypeRequestDetail = {
  request: PrototypeRequestRecord;
  files: RequestFileRecord[];
  rfqDraft: RfqDraftRecord | null;
  recommendations: SupplierRecommendationRecord[];
  statusLogs: RequestStatusLogRecord[];
  adminNotes: AdminNoteRecord[];
};
