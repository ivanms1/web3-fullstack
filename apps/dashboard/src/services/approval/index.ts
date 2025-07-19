import { useMutation } from "@tanstack/react-query";

import { approvalAPI } from "@/api/approval";
import { type Approval, ApprovalStatus } from "@/types/approval";

export function useProcessApproval() {
  return useMutation({
    mutationFn: (approval: Approval) =>
      approvalAPI.processApproval(
        approval.id,
        approval.status === ApprovalStatus.Approved,
        approval.reason
      ),
  });
}

export function useRequestApproval() {
  return useMutation({
    mutationFn: (approval: Approval) =>
      approvalAPI.requestApproval(approval.transactionId, approval.reason),
  });
}
