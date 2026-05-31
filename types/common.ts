export type RequestStatus =
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
  | "cancelled";

export type SupportedRequestFileExtension =
  | "pdf"
  | "step"
  | "stp"
  | "stl"
  | "jpg"
  | "jpeg"
  | "png";
