'use client';

import { useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { DataTable } from '@repo/ui/components/data-table';
import { useQuery } from '@tanstack/react-query';

import { Approval } from '@/types/approval';
import { COLUMNS } from '@/app/approvals/columns';
import { approvalQueryKeys } from '@/services/approval/request';
import { ApprovalDetailsDrawer } from './approval-details-drawer';
import { TableToolbar } from '@/components/table-toolbar';
import { useTableState } from '@/hooks/use-table-state';

import { APPROVAL_STATUS_CONFIG } from '@/const';

export function ApprovalsTable() {
  const tableState = useTableState();
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch all approvals
  const { data: allApprovals, isLoading: isLoadingAll } = useQuery({
    ...approvalQueryKeys.getAllApprovals(),
  });

  const table = useReactTable({
    data: allApprovals || [],
    columns: COLUMNS,
    onColumnFiltersChange: tableState.setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: tableState.setColumnVisibility,
    onRowSelectionChange: tableState.setRowSelection,
    state: {
      columnFilters: tableState.columnFilters,
      columnVisibility: tableState.columnVisibility,
      rowSelection: tableState.rowSelection,
    },
  });

  const handleRowClick = (approval: Approval) => {
    setSelectedApproval(approval);
    setDrawerOpen(true);
  };

  // Create status filter options
  const statusFilterOptions = Object.entries(APPROVAL_STATUS_CONFIG).map(
    ([status, config]) => ({
      value: status,
      label: config.label,
    })
  );

  if (isLoadingAll) {
    return (
      <div className='space-y-3'>
        <div className='h-4 bg-muted rounded animate-pulse' />
        <div className='h-4 bg-muted rounded animate-pulse' />
        <div className='h-4 bg-muted rounded animate-pulse' />
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <TableToolbar
        table={table}
        filters={{
          textFilter: [
            {
              column: 'reason',
              placeholder: 'Search by reason',
            },
            {
              column: 'requester',
              placeholder: 'Search by requester',
            },
            {
              column: 'approver',
              placeholder: 'Search by approver',
            },
          ],
          selectFilter: [
            {
              column: 'status',
              placeholder: 'Filter by status',
              options: statusFilterOptions,
            },
          ],
        }}
        totalCount={allApprovals?.length}
      />

      <DataTable
        columns={COLUMNS}
        data={allApprovals || []}
        onRowClick={handleRowClick}
        table={table}
      />

      <ApprovalDetailsDrawer
        approval={selectedApproval}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
