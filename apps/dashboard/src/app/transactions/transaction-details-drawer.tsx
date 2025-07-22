'use client';

import { dayjs } from '@/lib/dayjs';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@repo/ui/components/drawer';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Separator } from '@repo/ui/components/separator';
import { CopyButton } from '@repo/ui/components/copy-button';

import { Transaction, TransactionStatus } from '@/types/transaction';
import { RequestApprovalForm } from './request-approval-form';

import { TRANSACTION_STATUS_CONFIG } from '@/const';

interface TransactionDetailsDrawerProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailsDrawer({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailsDrawerProps) {
  if (!transaction) {
    return null;
  }

  const config = TRANSACTION_STATUS_CONFIG[transaction.status] || {
    label: 'Unknown',
    variant: 'secondary' as const,
  };

  const date = dayjs(transaction.timestamp * 1000);
  const formattedAmount = `${parseFloat(transaction.amount).toLocaleString()} MT`;

  const handleFormSuccess = () => {
    onOpenChange(false);
  };

  const handleFormCancel = () => {
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction='right'>
      <DrawerContent className='sm:min-w-[500px] min-w-full'>
        <DrawerHeader>
          <DrawerTitle>Transaction Details</DrawerTitle>
          <DrawerDescription>Transaction #{transaction.id}</DrawerDescription>
        </DrawerHeader>

        <div className='px-4 space-y-6'>
          {/* Status and Amount */}
          <div className='flex items-center gap-4'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Status
              </p>
              <Badge variant={config.variant} className='mt-1'>
                {config.label}
              </Badge>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Amount
              </p>
              <p className='text-lg font-bold text-green-600 mt-1'>
                {formattedAmount}
              </p>
            </div>
          </div>

          <Separator />

          {/* From and To Addresses */}
          <div className='space-y-4'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                From Address
              </p>
              <CopyButton text={transaction.from}>
                {transaction.from}
              </CopyButton>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                To Address
              </p>
              <CopyButton text={transaction.to}>{transaction.to}</CopyButton>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <p className='text-sm font-medium text-muted-foreground'>
              Description
            </p>
            <p className='text-sm mt-1 whitespace-pre-wrap'>
              {transaction.description}
            </p>
          </div>

          <Separator />

          {/* Timestamp */}
          <div>
            <p className='text-sm font-medium text-muted-foreground'>Created</p>
            <p className='text-sm mt-1'>
              {date.format('MMMM D, YYYY [at] h:mm A')}
            </p>
            <p className='text-xs text-muted-foreground mt-1'>
              {date.fromNow()}
            </p>
          </div>

          {/* Approval ID if exists */}
          {!!transaction.approvalId && (
            <>
              <Separator />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Approval ID
                </p>
                <p className='font-mono text-sm mt-1'>
                  #{transaction.approvalId}
                </p>
              </div>
            </>
          )}
        </div>

        <DrawerFooter>
          {transaction.status === TransactionStatus.Pending &&
          !transaction.approvalId ? (
            <RequestApprovalForm
              transaction={transaction}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          ) : (
            <DrawerClose asChild>
              <Button variant='outline' className='w-full'>
                Close
              </Button>
            </DrawerClose>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
