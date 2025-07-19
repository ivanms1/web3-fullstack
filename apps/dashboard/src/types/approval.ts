// Approval status enum
export enum ApprovalStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

// Approval type enum
export enum ApprovalType {
  Transaction = 0,
  UserRole = 1,
  SystemConfig = 2,
}

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
