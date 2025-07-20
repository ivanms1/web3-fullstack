// Approval status enum
export const ApprovalStatus = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
} as const;

export type ApprovalStatus =
  (typeof ApprovalStatus)[keyof typeof ApprovalStatus];

// Approval type enum
export const ApprovalType = {
  Transaction: 0,
  UserRole: 1,
  SystemConfig: 2,
} as const;

export type ApprovalType = (typeof ApprovalType)[keyof typeof ApprovalType];

// Approval interface
export interface Approval {
  id: number;
  transactionId: number;
  requester: string;
  approver: string;
  approvalType: ApprovalType;
  status: ApprovalStatus;
  reason: string;
  timestamp: number;
}
