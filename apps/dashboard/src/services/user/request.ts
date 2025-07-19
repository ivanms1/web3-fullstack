import { createQueryKeys } from "@lukemorales/query-key-factory";

import { QUERY_KEYS } from "@/services/queryKeys";
import { contractManager } from "@/lib/contract-manager";

export const userQueryKeys = createQueryKeys(QUERY_KEYS.USER, {
  getUser: (userAddress: string) => ({
    queryKey: [userAddress],
    queryFn: () => contractManager.getUser(userAddress),
  }),
  getCurrentUser: () => ({
    queryKey: ["current-user"],
    queryFn: () => contractManager.getCurrentUser(),
  }),
  getUserCount: () => ({
    queryKey: ["user-count"],
    queryFn: () => contractManager.getUserCount(),
  }),
});
