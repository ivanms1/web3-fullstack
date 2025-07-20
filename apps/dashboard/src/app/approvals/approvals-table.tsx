"use client";

import { useState } from "react";
import { Input } from "@repo/ui/components/input";
import { DataTable } from "@repo/ui/components/data-table";
import { useQuery } from "@tanstack/react-query";

import { Approval } from "@/types/approval";
import { COLUMNS } from "@/app/approvals/columns";
import { approvalQueryKeys } from "@/services/approval/request";
import { ApprovalDetailsDrawer } from "./approval-details-drawer";

export function ApprovalsTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch all approvals
  const { data: allApprovals, isLoading: isLoadingAll } = useQuery({
    ...approvalQueryKeys.getAllApprovals(),
  });

  // Fetch pending approvals
  const { data: pendingApprovals, isLoading: isLoadingPending } = useQuery({
    ...approvalQueryKeys.getPendingApprovals(),
  });

  // Filter data based on global filter
  const filteredData = allApprovals?.filter((approval: Approval) => {
    if (!globalFilter) return true;

    const searchTerm = globalFilter.toLowerCase();
    return (
      approval.id.toString().includes(searchTerm) ||
      approval.transactionId.toString().includes(searchTerm) ||
      approval.requester.toLowerCase().includes(searchTerm) ||
      approval.approver.toLowerCase().includes(searchTerm) ||
      approval.reason.toLowerCase().includes(searchTerm)
    );
  });

  const handleRowClick = (approval: Approval) => {
    setSelectedApproval(approval);
    setDrawerOpen(true);
  };

  if (isLoadingAll || isLoadingPending) {
    return (
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {allApprovals?.length} total approvals / {pendingApprovals?.length}{" "}
            pending
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search approvals..."
            value={globalFilter}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setGlobalFilter(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      </div>

      <DataTable
        columns={COLUMNS}
        data={filteredData || []}
        onRowClick={handleRowClick}
      />

      <ApprovalDetailsDrawer
        approval={selectedApproval}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
