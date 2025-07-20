import {
  MutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ContractTransactionResponse } from "ethers/contract";

import { approvalAPI } from "@/api/approval";
import type { Approval } from "@/types/approval";
import { ApprovalStatus } from "@/types/approval";
import { approvalQueryKeys } from "@/services/approval/request";

import { transactionQueryKeys } from "@/services/transaction/request";

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
      queryClient.invalidateQueries(approvalQueryKeys.getPendingApprovals());
      queryClient.invalidateQueries(transactionQueryKeys.getAllTransactions());
      queryClient.invalidateQueries(transactionQueryKeys.getTransactionCount());
      options?.onSuccess?.(data, variables, context);
    },
  });
}

export function useRequestApproval(
  options?: MutationOptions<
    ContractTransactionResponse,
    Error,
    {
      transactionId: number;
      reason: string;
    }
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      transactionId,
      reason,
    }: {
      transactionId: number;
      reason: string;
    }) => approvalAPI.requestApproval(transactionId, reason),
    onSuccess: (data, variables, context) => {
      console.log("onSuccess", data, variables, context);
      queryClient.invalidateQueries(approvalQueryKeys.getAllApprovals());
      queryClient.invalidateQueries(approvalQueryKeys.getPendingApprovals());
      queryClient.invalidateQueries(transactionQueryKeys.getAllTransactions());
      queryClient.invalidateQueries(transactionQueryKeys.getTransactionCount());
      options?.onSuccess?.(data, variables, context);
    },
  });
}
