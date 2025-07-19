import { useMutation } from "@tanstack/react-query";

import { contractManager } from "@/lib/contract-manager";

import type { Transaction } from "@/types/transaction";

export function useCreateTransaction() {
  return useMutation({
    mutationFn: (transaction: Transaction) =>
      contractManager.createTransaction(
        transaction.to,
        transaction.amount,
        transaction.description
      ),
  });
}

export function useCompleteTransaction() {
  return useMutation({
    mutationFn: (transaction: Transaction) =>
      contractManager.completeTransaction(transaction.id),
  });
}
