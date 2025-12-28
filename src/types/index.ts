export type UserRole = 'applicant' | 'credit' | 'audit';

export type ApplicationType = 'internal' | 'external';

export type AccountType = 'current' | 'savings' | 'cooperate';

export type LoanPurpose = 'medical' | 'consumption' | 'investment' | 'education' | 'others';

export type ApplicationStatus = 
  | 'draft' 
  | 'submitted' 
  | 'pending_payment' 
  | 'paid' 
  | 'under_review' 
  | 'pre_approved' 
  | 'approved' 
  | 'declined' 
  | 'further_review';

export type PaymentStatus = 'unpaid' | 'processing' | 'paid' | 'error';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: Date;
}

export interface LoanApplication {
  id: string;
  applicationNumber: string;
  userId: string;
  applicationType: ApplicationType;
  status: ApplicationStatus;
  paymentStatus: PaymentStatus;
  
  // Personal Information
  passportPhoto?: string;
  name: string;
  ministry: string;
  employeeId: string;
  bvn: string;
  nin: string;
  ninPhoto?: string;
  phone: string;
  address: string;
  signature?: string;
  
  // Loan Details
  amount: number;
  period: number; // months
  monthsToDeduct: string; // e.g., "January to June"
  paymentSlip?: string;
  
  // Bank Details
  ymfbAccountNumber?: string;
  otherBankAccount?: string;
  accountType: AccountType;
  accountBalance?: number;
  dateOpened?: Date;
  
  // Purpose
  purpose: LoanPurpose;
  
  // Guarantor
  guarantor?: Guarantor;
  
  // Terms
  acceptedTerms: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  
  // Review
  declineReason?: string;
  reviewNotes?: string;
  reviewedBy?: string;
  approvedAmount?: number;
}

export interface Guarantor {
  name: string;
  knownFor: string; // e.g., "5 years"
  basicSalary: number;
  allowances: number;
  otherIncome: number;
  employeeId: string;
  bvn: string;
  phone: string;
  address: string;
  organization: string;
  position: string;
  signature?: string;
  acceptedTerms: boolean;
}

export interface AccountApplication {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'declined';
  
  // Personal Information
  passportPhoto?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  bvn: string;
  nin: string;
  ninPhoto?: string;
  
  // Referee
  referee: Referee;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Referee {
  name: string;
  phone: string;
  address: string;
  relationship: string;
}

export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  declinedApplications: number;
  totalAmountApproved: number;
  totalAmountDisbursed: number;
}
