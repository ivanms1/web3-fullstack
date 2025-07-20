// Transaction status enum
export const TransactionStatus = {
  Pending: 0,
  Active: 1,
  Completed: 2,
  Rejected: 3,
} as const;

export type TransactionStatus =
  (typeof TransactionStatus)[keyof typeof TransactionStatus];

// Transaction interface
export interface Transaction {
  id: number;
  from: string;
  to: string;
  amount: string; // formatted as ether
  description: string;
  status: TransactionStatus;
  timestamp: number;
  approvalId: number;
}
