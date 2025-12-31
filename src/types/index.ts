import { Database } from '@/integrations/supabase/types';

// Database types
export type LoanProduct = Database['public']['Enums']['loan_product'];
export type ApplicationType = Database['public']['Enums']['application_type'];
export type AccountType = Database['public']['Enums']['account_type'];
export type LoanStatus = Database['public']['Enums']['loan_status'];
export type AccountStatus = Database['public']['Enums']['account_status'];
export type LoanAmountRange = Database['public']['Enums']['loan_amount_range'];
export type AppRole = Database['public']['Enums']['app_role'];

// Table types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type LoanApplication = Database['public']['Tables']['loan_applications']['Row'];
export type Guarantor = Database['public']['Tables']['guarantors']['Row'];
export type AccountApplication = Database['public']['Tables']['account_applications']['Row'];
export type Referee = Database['public']['Tables']['referees']['Row'];
export type UserRole = Database['public']['Tables']['user_roles']['Row'];

// Insert types
export type LoanApplicationInsert = Database['public']['Tables']['loan_applications']['Insert'];
export type GuarantorInsert = Database['public']['Tables']['guarantors']['Insert'];
export type AccountApplicationInsert = Database['public']['Tables']['account_applications']['Insert'];
export type RefereeInsert = Database['public']['Tables']['referees']['Insert'];

// Helper types for UI
export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  declinedApplications: number;
  totalAmountApplied: number;
}

export const LOAN_AMOUNT_RANGES: Record<LoanAmountRange, { min: number; max: number; label: string }> = {
  '100k_300k': { min: 100000, max: 300000, label: '₦100,000 - ₦300,000' },
  '300k_600k': { min: 300000, max: 600000, label: '₦300,000 - ₦600,000' },
  '600k_1m': { min: 600000, max: 1000000, label: '₦600,000 - ₦1,000,000' },
  'above_1m': { min: 1000000, max: 10000000, label: 'Above ₦1,000,000' },
};

export const LOAN_PERIODS = [
  { value: 3, label: '3 Months (Short term)' },
  { value: 6, label: '6 Months (Short term)' },
  { value: 9, label: '9 Months (Medium term)' },
  { value: 12, label: '12 Months (Medium term)' },
];

export const STATUS_LABELS: Record<LoanStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  further_review: 'Further Review',
  approved: 'Approved',
  declined: 'Declined',
};

export const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  declined: 'Declined',
  further_review: 'Further Review',
};
