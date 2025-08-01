import { useMutation, useQueryClient } from '@tanstack/react-query';

import { transactionAPI } from '@/api/transaction';
import { transactionQueryKeys } from './request';
import type { Transaction } from '@/types/transaction';

interface CreateTransactionParams {
  to: string;
  amount: string;
  description: string;
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: CreateTransactionParams) =>
      transactionAPI.createTransaction(
        params.to,
        params.amount,
        params.description
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(transactionQueryKeys.getAllTransactions());
      queryClient.invalidateQueries(transactionQueryKeys.getTransactionCount());
    },
  });
}

export function useCompleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transaction: Transaction) =>
      transactionAPI.completeTransaction(transaction.id),
    onSuccess: () => {
      queryClient.invalidateQueries(transactionQueryKeys.getAllTransactions());
      queryClient.invalidateQueries(transactionQueryKeys.getTransactionCount());
    },
  });
}
