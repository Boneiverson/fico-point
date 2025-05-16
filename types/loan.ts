export type LoanStatus = "pending" | "approved" | "rejected" | "active" | "completed";

export interface Guarantor {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  relationship: string;
}

export interface AccountDetails {
  id?: string;
  mobileMoneyNumber: string;
  accountName: string;
  provider: string;
}

export interface LoanRequest {
  id: string;
  userId: string;
  amount: number;
  purpose: string;
  duration: number;
  guarantors: Guarantor[];
  accountDetails: AccountDetails;
  status: LoanStatus;
  createdAt: string;
  approvedAt?: string;
  dueDate?: string;
}

export interface LoanPayment {
  id: string;
  loanId: string;
  amount: number;
  date: string;
  provider: string;
  transactionId: string;
}