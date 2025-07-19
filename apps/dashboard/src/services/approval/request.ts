import { createQueryKeys } from "@lukemorales/query-key-factory";

import { QUERY_KEYS } from "@/services/queryKeys";
import { contractManager } from "@/lib/contract-manager";

export const approvalQueryKeys = createQueryKeys(QUERY_KEYS.APPROVAL, {
  getApproval: (approvalId: number) => ({
    queryKey: [approvalId],
    queryFn: () => contractManager.getApproval(approvalId),
  }),
  getPendingApprovals: () => ({
    queryKey: ["pending"],
    queryFn: () => contractManager.getPendingApprovals(),
  }),
  getApprovalCount: () => ({
    queryKey: ["approval-count"],
    queryFn: () => contractManager.getApprovalCount(),
  }),
});
