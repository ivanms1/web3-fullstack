import { createQueryKeys } from "@lukemorales/query-key-factory";

import { QUERY_KEYS } from "@/services/queryKeys";
import { networkAPI } from "@/api/network";

export const networkQueryKeys = createQueryKeys(QUERY_KEYS.NETWORK, {
  getCurrentNetwork: () => ({
    queryKey: ["current-network"],
    queryFn: () => networkAPI.getCurrentNetwork(),
  }),
});
