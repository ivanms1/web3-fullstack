import {
  MutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { approvalAPI } from "@/api/approval";
import type { Approval } from "@/types/approval";
import { ApprovalStatus } from "@/types/approval";
import { approvalQueryKeys } from "./request";
import { ContractTransactionResponse } from "ethers/contract";

export function useProcessApproval(
  options?: MutationOptions<ContractTransactionResponse, Error, Approval>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (approval: Approval) =>
      approvalAPI.processApproval(
        approval.id,
        approval.status === ApprovalStatus.Approved,
        approval.reason
      ),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(approvalQueryKeys.getAllApprovals());
      options?.onSuccess?.(data, variables, context);
    },
  });
}

export function useRequestApproval() {
  return useMutation({
    mutationFn: (approval: Approval) =>
      approvalAPI.requestApproval(approval.transactionId, approval.reason),
  });
}
