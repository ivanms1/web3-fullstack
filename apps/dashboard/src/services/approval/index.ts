import { useMutation, useQueryClient } from '@tanstack/react-query';

import { approvalAPI } from '@/api/approval';
import type { Approval } from '@/types/approval';
import { ApprovalStatus } from '@/types/approval';
import { approvalQueryKeys } from '@/services/approval/request';

import { transactionQueryKeys } from '@/services/transaction/request';

export function useProcessApproval() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (approval: Approval) =>
      approvalAPI.processApproval(
        approval.id,
        approval.status === ApprovalStatus.Approved,
        approval.reason
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(approvalQueryKeys.getAllApprovals());
      queryClient.invalidateQueries(approvalQueryKeys.getPendingApprovals());
      queryClient.invalidateQueries(transactionQueryKeys.getAllTransactions());
      queryClient.invalidateQueries(transactionQueryKeys.getTransactionCount());
    },
  });
}

export function useRequestApproval() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      transactionId,
      reason,
    }: {
      transactionId: number;
      reason: string;
    }) => approvalAPI.requestApproval(transactionId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(approvalQueryKeys.getAllApprovals());
      queryClient.invalidateQueries(approvalQueryKeys.getPendingApprovals());
      queryClient.invalidateQueries(transactionQueryKeys.getAllTransactions());
      queryClient.invalidateQueries(transactionQueryKeys.getTransactionCount());
    },
  });
}
