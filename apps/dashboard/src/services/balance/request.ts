import { createQueryKeys } from "@lukemorales/query-key-factory";

import { QUERY_KEYS } from "@/services/queryKeys";
import { contractManager } from "@/lib/contract-manager";

export const balanceQueryKeys = createQueryKeys(QUERY_KEYS.BALANCE, {
  getCurrentEthBalance: () => ({
    queryKey: ["eth-balance"],
    queryFn: () => contractManager.getCurrentEthBalance(),
  }),
  getTokenBalance: (userAddress: string) => ({
    queryKey: ["token-balance", userAddress],
    queryFn: () => contractManager.getTokenBalance(userAddress),
  }),
  getUserBalance: (userAddress: string) => ({
    queryKey: ["user-balance", userAddress],
    queryFn: () => contractManager.getEthBalance(userAddress),
  }),
});
