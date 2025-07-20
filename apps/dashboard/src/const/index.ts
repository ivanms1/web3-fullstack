import { ApprovalStatus } from "@/types/approval";
import { TransactionStatus } from "@/types/transaction";

export const TRANSACTION_STATUS_CONFIG = {
  [TransactionStatus.Pending]: {
    label: "Pending",
    variant: "secondary",
  },
  [TransactionStatus.Active]: {
    label: "Active",
    variant: "default",
  },
  [TransactionStatus.Completed]: {
    label: "Completed",
    variant: "default",
  },
  [TransactionStatus.Rejected]: {
    label: "Rejected",
    variant: "destructive",
  },
} as const;

export const APPROVAL_STATUS_CONFIG = {
  [ApprovalStatus.Pending]: {
    label: "Pending",
    variant: "secondary",
  },
  [ApprovalStatus.Approved]: {
    label: "Approved",
    variant: "default",
  },
  [ApprovalStatus.Rejected]: {
    label: "Rejected",
    variant: "destructive",
  },
} as const;
