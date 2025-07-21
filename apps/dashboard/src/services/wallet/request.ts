import { createQueryKeys } from '@lukemorales/query-key-factory';

import { QUERY_KEYS } from '@/services/queryKeys';
import { contractManager } from '@/api/contract-manager';

export const walletQueryKeys = createQueryKeys(QUERY_KEYS.WALLET, {
  getCurrentAccount: () => ({
    queryKey: ['current-account'],
    queryFn: () => contractManager.getCurrentAccount(),
  }),
});
