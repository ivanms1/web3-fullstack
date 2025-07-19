import { createQueryKeys } from "@lukemorales/query-key-factory";

import { QUERY_KEYS } from "@/services/queryKeys";
import { contractManager } from "@/lib/contract-manager";

export const transactionQueryKeys = createQueryKeys(QUERY_KEYS.TRANSACTION, {
  getTransaction: (transactionId: number) => ({
    queryKey: [transactionId],
    queryFn: () => contractManager.getTransaction(transactionId),
  }),
  getUserTransactions: (userAddress: string) => ({
    queryKey: [userAddress],
    queryFn: () => contractManager.getUserTransactions(userAddress),
  }),
  getAllTransactions: () => ({
    queryKey: ["all-transactions"],
    queryFn: () => contractManager.getAllTransactions(),
  }),

  getTransactionCount: () => ({
    queryKey: ["transaction-count"],
    queryFn: () => contractManager.getTransactionCount(),
  }),
});
