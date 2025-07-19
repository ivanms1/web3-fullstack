import { useMutation, useQueryClient } from "@tanstack/react-query";

import { contractManager } from "@/lib/contract-manager";

import { transactionQueryKeys } from "./request";

import type { Transaction } from "@/types/transaction";

interface CreateTransactionParams {
  to: string;
  amount: string;
  description: string;
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: CreateTransactionParams) =>
      contractManager.createTransaction(
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
  return useMutation({
    mutationFn: (transaction: Transaction) =>
      contractManager.completeTransaction(transaction.id),
  });
}
