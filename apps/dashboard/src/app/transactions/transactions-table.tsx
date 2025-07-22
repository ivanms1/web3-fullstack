'use client';

import { useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { DataTable } from '@repo/ui/components/data-table';
import { useQuery } from '@tanstack/react-query';

import { TransactionDetailsDrawer } from './transaction-details-drawer';
import { TableToolbar } from '@/components/table-toolbar';
import { useTableState } from '@/hooks/use-table-state';

import { COLUMNS } from '@/app/transactions/columns';
import { transactionQueryKeys } from '@/services/transaction/request';
import { contractManager } from '@/api/contract-manager';

import { Transaction } from '@/types/transaction';
import { TRANSACTION_STATUS_CONFIG } from '@/const';

export function TransactionsTable() {
  const tableState = useTableState();
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch all transactions
  const { data: allTransactions, isLoading: isLoadingAll } = useQuery({
    ...transactionQueryKeys.getAllTransactions(),
    enabled: contractManager.isInitialized(),
  });

  const table = useReactTable({
    data: allTransactions || [],
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

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDrawerOpen(true);
  };

  // Create status filter options from the status config
  const statusFilterOptions = Object.entries(TRANSACTION_STATUS_CONFIG).map(
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
              column: 'description',
              placeholder: 'Search by description',
            },
            {
              column: 'from',
              placeholder: 'Search by from',
            },
            {
              column: 'to',
              placeholder: 'Search by to',
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
        totalCount={allTransactions?.length}
      />

      <DataTable
        columns={COLUMNS}
        data={allTransactions || []}
        onRowClick={handleRowClick}
        table={table}
      />

      <TransactionDetailsDrawer
        transaction={selectedTransaction}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
