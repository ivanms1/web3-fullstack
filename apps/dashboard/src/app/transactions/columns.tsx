'use client';

import { dayjs } from '@/lib/dayjs';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@repo/ui/components/badge';

import { Transaction, TransactionStatus } from '@/types/transaction';
import { truncateWalletAddress } from '@/utils/truncateWalletAddress';
import { TRANSACTION_STATUS_CONFIG } from '@/const';
import { CopyButton } from '@repo/ui/components/copy-button';

export const COLUMNS: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <div className='font-mono'>#{row.getValue('id')}</div>,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'from',
    header: 'From',
    cell: ({ row }) => (
      <CopyButton text={row.getValue('from') as string}>
        {truncateWalletAddress(row.getValue('from') as string)}
      </CopyButton>
    ),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'to',
    header: 'To',
    cell: ({ row }) => (
      <div className='font-mono'>
        <CopyButton text={row.getValue('to') as string}>
          {truncateWalletAddress(row.getValue('to') as string)}
        </CopyButton>
      </div>
    ),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as string;
      const formattedAmount = `${parseFloat(amount).toLocaleString()} MT`;
      return <div className='font-medium'>{formattedAmount}</div>;
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <div
        className='max-w-[300px] truncate'
        title={row.getValue('description')}
      >
        {row.getValue('description')}
      </div>
    ),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as TransactionStatus;

      const config = TRANSACTION_STATUS_CONFIG[status] || {
        label: 'Unknown',
        variant: 'secondary' as const,
      };
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
    enableColumnFilter: true,
    filterFn: (row, id, filterValue) => {
      const status = row.getValue(id) as TransactionStatus;
      return status === +filterValue;
    },
  },
  {
    accessorKey: 'timestamp',
    header: 'Date',
    cell: ({ row }) => {
      const timestamp = row.getValue('timestamp') as number;
      return (
        <div className='text-sm'>
          <div>{dayjs(timestamp * 1000).format('MMM D, YYYY')}</div>
          <div className='text-xs text-muted-foreground'>
            {dayjs(timestamp * 1000).fromNow()}
          </div>
        </div>
      );
    },
    enableColumnFilter: true,
  },
];
