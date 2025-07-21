import { createQueryKeys } from '@lukemorales/query-key-factory';

import { QUERY_KEYS } from '@/services/queryKeys';
import { userAPI } from '@/api/user';

export const userQueryKeys = createQueryKeys(QUERY_KEYS.USER, {
  getUser: (userAddress: string) => ({
    queryKey: [userAddress],
    queryFn: () => userAPI.getUser(userAddress),
  }),
  getCurrentUser: () => ({
    queryKey: ['current-user'],
    queryFn: () => userAPI.getCurrentUser(),
  }),
  getUserCount: () => ({
    queryKey: ['user-count'],
    queryFn: () => userAPI.getUserCount(),
  }),
});
