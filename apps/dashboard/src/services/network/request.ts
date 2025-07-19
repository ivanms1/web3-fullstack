import { createQueryKeys } from "@lukemorales/query-key-factory";

import { QUERY_KEYS } from "@/services/queryKeys";
import { contractManager } from "@/lib/contract-manager";

export const networkQueryKeys = createQueryKeys(QUERY_KEYS.NETWORK, {
  getCurrentNetwork: () => ({
    queryKey: ["current-network"],
    queryFn: () => contractManager.getCurrentNetwork(),
  }),
});
