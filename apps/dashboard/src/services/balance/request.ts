import { createQueryKeys } from "@lukemorales/query-key-factory";

import { QUERY_KEYS } from "@/services/queryKeys";
import { balanceAPI } from "@/api/balance";

export const balanceQueryKeys = createQueryKeys(QUERY_KEYS.BALANCE, {
  getCurrentEthBalance: () => ({
    queryKey: ["eth-balance"],
    queryFn: () => balanceAPI.getCurrentEthBalance(),
  }),
  getTokenBalance: (userAddress: string) => ({
    queryKey: ["token-balance", userAddress],
    queryFn: () => balanceAPI.getTokenBalance(userAddress),
  }),
  getUserBalance: (userAddress: string) => ({
    queryKey: ["user-balance", userAddress],
    queryFn: () => balanceAPI.getEthBalance(userAddress),
  }),
});
