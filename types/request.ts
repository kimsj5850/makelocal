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
