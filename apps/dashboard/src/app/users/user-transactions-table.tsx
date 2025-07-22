'use client';
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { DataTable } from '@repo/ui/components/data-table';

import { TableToolbar } from '@/components/table-toolbar';
import { useTableState } from '@/hooks/use-table-state';

import { Transaction } from '@/types/transaction';

import { TRANSACTION_STATUS_CONFIG } from '@/const';
import { getUserTransactionsColumns } from './columns';
import { useMemo } from 'react';

interface UserTransactionsTableProps {
  transactions: Transaction[];
  userAddress: string;
  isLoading?: boolean;
}

export function UserTransactionsTable({
  transactions,
  userAddress,
}: UserTransactionsTableProps) {
  const tableState = useTableState();

  const columns = useMemo(
    () => getUserTransactionsColumns(userAddress),
    [userAddress]
  );

  const table = useReactTable<Transaction>({
    data: transactions,
    columns,
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

  // Create status filter options
  const statusFilterOptions = Object.entries(TRANSACTION_STATUS_CONFIG).map(
    ([status, config]) => ({
      value: status,
      label: config.label,
    })
  );

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold'>Transaction History</h3>
          <p className='text-sm text-muted-foreground'>
            {table.getFilteredRowModel().rows.length} of {transactions.length}{' '}
            transaction
            {transactions.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

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
        totalCount={transactions.length}
      />

      <DataTable columns={columns} data={transactions} table={table} />
    </div>
  );
}
