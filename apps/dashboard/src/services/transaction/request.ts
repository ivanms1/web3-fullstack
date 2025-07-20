import { createQueryKeys } from "@lukemorales/query-key-factory";

import { QUERY_KEYS } from "@/services/queryKeys";
import { transactionAPI } from "@/api/transaction";

export const transactionQueryKeys = createQueryKeys(QUERY_KEYS.TRANSACTION, {
  getTransaction: (transactionId: number) => ({
    queryKey: [transactionId],
    queryFn: () => transactionAPI.getTransaction(transactionId),
  }),
  getUserTransactions: (userAddress: string) => ({
    queryKey: [userAddress],
    queryFn: () => transactionAPI.getUserTransactions(userAddress),
  }),
  getTransactionsByIds: (transactionIds: number[]) => ({
    queryKey: [transactionIds],
    queryFn: () => transactionAPI.getTransactionsByIds(transactionIds),
  }),
  getAllTransactions: () => ({
    queryKey: ["all-transactions"],
    queryFn: () => transactionAPI.getAllTransactions(),
  }),

  getTransactionCount: () => ({
    queryKey: ["transaction-count"],
    queryFn: () => transactionAPI.getTransactionCount(),
  }),
});
