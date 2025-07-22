import { Badge } from '@repo/ui/components/badge';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { ArrowDownLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { CopyButton } from '@repo/ui/components/copy-button';

import { TRANSACTION_STATUS_CONFIG } from '@/const';
import { Transaction, TransactionStatus } from '@/types/transaction';
import { truncateWalletAddress } from '@/utils/truncateWalletAddress';

const getStatusConfig = (status: TransactionStatus) => {
  return (
    TRANSACTION_STATUS_CONFIG[status] || {
      label: 'Unknown',
      variant: 'secondary' as const,
    }
  );
};

const getTransactionType = (transaction: Transaction, userAddress: string) => {
  const isSender =
    transaction?.from?.toLowerCase() === userAddress.toLowerCase();
  const isReceiver =
    transaction?.to?.toLowerCase() === userAddress.toLowerCase();

  if (isSender && isReceiver) {
    return {
      type: 'Self',
      icon: <ArrowRight className='w-4 h-4 text-muted-foreground' />,
      variant: 'secondary' as const,
    };
  } else if (isSender) {
    return {
      type: 'Sent',
      icon: <ArrowUpRight className='w-4 h-4 text-red-500' />,
      variant: 'destructive' as const,
    };
  } else if (isReceiver) {
    return {
      type: 'Received',
      icon: <ArrowDownLeft className='w-4 h-4 text-green-500' />,
      variant: 'default' as const,
    };
  } else {
    return {
      type: 'Unknown',
      icon: <ArrowRight className='w-4 h-4 text-muted-foreground' />,
      variant: 'secondary' as const,
    };
  }
};

export const getUserTransactionsColumns = (
  userAddress: string
): ColumnDef<Transaction>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <span className='font-mono text-sm'>#{row.getValue('id')}</span>
    ),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const transaction = row.original;
      const typeInfo = getTransactionType(transaction, userAddress);
      return (
        <div className='flex items-center gap-2'>
          {typeInfo.icon}
          <Badge variant={typeInfo.variant}>{typeInfo.type}</Badge>
        </div>
      );
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const typeInfo = getTransactionType(row.original, userAddress);
      const isOutgoing = typeInfo.type === 'Sent';

      return (
        <span
          className={`font-medium ${isOutgoing ? 'text-red-600' : 'text-green-600'}`}
        >
          {isOutgoing ? '-' : '+'}
          {amount.toLocaleString()} MT
        </span>
      );
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <div
        className='max-w-[200px] truncate'
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
      const config = getStatusConfig(status);
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
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
      <CopyButton text={row.getValue('to') as string}>
        {truncateWalletAddress(row.getValue('to') as string)}
      </CopyButton>
    ),
    enableColumnFilter: true,
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
