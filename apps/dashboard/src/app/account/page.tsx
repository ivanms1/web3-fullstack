'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Badge } from '@repo/ui/components/badge';
import { Separator } from '@repo/ui/components/separator';
import {
  User as UserIcon,
  Wallet,
  Mail,
  Calendar,
  Activity,
  Shield,
} from 'lucide-react';
import { dayjs } from '@/lib/dayjs';
import { truncateWalletAddress } from '@/utils/truncateWalletAddress';
import { useWalletSession } from '@/hooks/use-wallet-session';
import { ROLE_CONFIG } from '@/const';
import { UserRole } from '@/types/user';

const getRoleConfig = (role: UserRole) => {
  return (
    ROLE_CONFIG[role] || { label: 'Unknown', variant: 'secondary' as const }
  );
};

export default function AccountPage() {
  const { user, isInitializing } = useWalletSession();

  if (isInitializing) {
    return (
      <div className='container mx-auto p-6'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold'>Account</h1>
          <p className='text-muted-foreground'>
            Your account information and settings
          </p>
        </div>
        <div className='flex items-center justify-center py-8'>
          <div className='text-center'>
            <div className='w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
            <p className='text-muted-foreground'>
              Loading account information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='container mx-auto p-6'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold'>Account</h1>
          <p className='text-muted-foreground'>
            Your account information and settings
          </p>
        </div>
        <div className='text-center py-8'>
          <p className='text-destructive mb-2'>User not found</p>
          <p className='text-sm text-muted-foreground'>
            Unable to load your account information
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Account</h1>
        <p className='text-muted-foreground'>
          Your account information and settings
        </p>
      </div>

      <div className='max-w-2xl'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <UserIcon className='w-5 h-5' />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Basic Info */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Wallet className='w-4 h-4' />
                  Wallet Address
                </div>
                <p className='font-mono text-sm max-sm:hidden'>
                  {truncateWalletAddress(user.walletAddress)}
                </p>
                <p className='font-mono text-sm max-sm:block hidden'>
                  {truncateWalletAddress(user.walletAddress)}
                </p>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <UserIcon className='w-4 h-4' />
                  Name
                </div>
                <p className='font-medium'>{user.name}</p>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Mail className='w-4 h-4' />
                  Email
                </div>
                <p className='text-sm'>{user.email}</p>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Activity className='w-4 h-4' />
                  Role
                </div>
                <Badge variant={getRoleConfig(user.role).variant}>
                  {getRoleConfig(user.role).label}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Status and Created */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Shield className='w-4 h-4' />
                  Status
                </div>
                <Badge variant={user.isActive ? 'default' : 'destructive'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Calendar className='w-4 h-4' />
                  Account Created
                </div>
                <p className='text-sm'>
                  {dayjs(user.createdAt * 1000).format('MMMM D, YYYY')}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {dayjs(user.createdAt * 1000).fromNow()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
