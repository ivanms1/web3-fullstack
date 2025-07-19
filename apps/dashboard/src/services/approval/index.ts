import { useMutation } from "@tanstack/react-query";

import { contractManager } from "@/lib/contract-manager";

import type { Approval } from "@/types/approval";
import { ApprovalStatus } from "@/types/approval";

export function useProcessApproval() {
  return useMutation({
    mutationFn: (approval: Approval) =>
      contractManager.processApproval(
        approval.id,
        approval.status === ApprovalStatus.Approved,
        approval.reason
      ),
  });
}

export function useRequestApproval() {
  return useMutation({
    mutationFn: (approval: Approval) =>
      contractManager.requestApproval(approval.transactionId, approval.reason),
  });
}
