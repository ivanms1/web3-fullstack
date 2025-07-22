'use client';

import { dayjs } from '@/lib/dayjs';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@repo/ui/components/badge';
import { CopyButton } from '@repo/ui/components/copy-button';

import { truncateWalletAddress } from '@/utils/truncateWalletAddress';

import { Approval, ApprovalStatus, ApprovalType } from '@/types/approval';
import { APPROVAL_STATUS_CONFIG } from '@/const';

export const COLUMNS: ColumnDef<Approval>[] = [
  {
    accessorKey: 'transactionId',
    header: 'Transaction ID',
    cell: ({ row }) => (
      <div className='font-mono'>#{row.getValue('transactionId')}</div>
    ),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'requester',
    header: 'Requester',
    cell: ({ row }) => (
      <CopyButton text={row.getValue('requester') as string}>
        {truncateWalletAddress(row.getValue('requester') as string)}
      </CopyButton>
    ),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'approver',
    header: 'Approver',
    cell: ({ row }) => (
      <CopyButton text={row.getValue('approver') as string}>
        {truncateWalletAddress(row.getValue('approver') as string)}
      </CopyButton>
    ),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'approvalType',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('approvalType') as ApprovalType;
      const typeLabels = {
        [ApprovalType.Transaction]: 'Transaction',
        [ApprovalType.UserRole]: 'User Role',
        [ApprovalType.SystemConfig]: 'System Config',
      };
      return <Badge variant='secondary'>{typeLabels[type] || 'Unknown'}</Badge>;
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as ApprovalStatus;
      const config = APPROVAL_STATUS_CONFIG[status] || {
        label: 'Unknown',
        variant: 'secondary' as const,
      };
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
    enableColumnFilter: true,
    filterFn: (row, id, filterValue) => {
      const status = row.getValue(id);
      return status === +filterValue;
    },
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
    cell: ({ row }) => (
      <div className='max-w-[400px] truncate' title={row.getValue('reason')}>
        {row.getValue('reason')}
      </div>
    ),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'timestamp',
    header: 'Created',
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
