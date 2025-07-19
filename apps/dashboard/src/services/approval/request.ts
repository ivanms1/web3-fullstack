import { createQueryKeys } from "@lukemorales/query-key-factory";
import { QUERY_KEYS } from "@/services/queryKeys";
import { approvalAPI } from "@/api/approval";

export const approvalQueryKeys = createQueryKeys(QUERY_KEYS.APPROVAL, {
  getApproval: (approvalId: number) => ({
    queryKey: [approvalId],
    queryFn: () => approvalAPI.getApproval(approvalId),
  }),
  getPendingApprovals: () => ({
    queryKey: ["pending"],
    queryFn: () => approvalAPI.getPendingApprovals(),
  }),
  getApprovalCount: () => ({
    queryKey: ["approval-count"],
    queryFn: () => approvalAPI.getApprovalCount(),
  }),
  getAllApprovals: () => ({
    queryKey: ["all"],
    queryFn: () => approvalAPI.getAllApprovals(),
  }),
});
