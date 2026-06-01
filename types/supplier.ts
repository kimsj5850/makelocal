export type {
  SelectedSupplierDraft,
  SupplierRecommendationRecord,
} from "@/types/request";

export type Supplier = {
  id: string;
  company_name: string;
  region?: string | null;
  address?: string | null;
  main_processes?: string[] | null;
  machines?: string[] | null;
  materials?: string[] | null;
  small_batch_available?: boolean | null;
  post_processing_available?: boolean | null;
  average_lead_time?: string | null;
  contact_name?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  description?: string | null;
  admin_memo?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateSupplierInput = {
  company_name: string;
  region?: string;
  address?: string;
  main_processes?: string[];
  machines?: string[];
  materials?: string[];
  small_batch_available?: boolean;
  post_processing_available?: boolean;
  average_lead_time?: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  admin_memo?: string;
  is_active?: boolean;
};
