'use client';

import { dayjs } from '@/lib/dayjs';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@repo/ui/components/badge';

import { User, UserRole } from '@/types/user';
import { truncateWalletAddress } from '@/utils/truncateWalletAddress';
import { ROLE_CONFIG } from '@/const';

export const COLUMNS: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <div className='font-mono'>#{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className='font-medium'>{row.getValue('name')}</div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <div className='text-sm'>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'walletAddress',
    header: 'Wallet Address',
    cell: ({ row }) => (
      <div className='font-mono text-sm'>
        {truncateWalletAddress(row.getValue('walletAddress'))}
      </div>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as UserRole;
      const config = ROLE_CONFIG[role] || {
        label: 'Unknown',
        variant: 'secondary' as const,
      };
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean;
      return (
        <Badge variant={isActive ? 'default' : 'destructive'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const timestamp = row.getValue('createdAt') as number;
      const date = dayjs(timestamp * 1000);
      return (
        <div className='text-sm text-muted-foreground'>{date.fromNow()}</div>
      );
    },
  },
];
