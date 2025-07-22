'use client';

import { usePathname } from 'next/navigation';
import { SidebarProvider } from '@repo/ui/components/sidebar';
import { Alert, AlertDescription } from '@repo/ui/components/alert';
import { Button } from '@repo/ui/components/button';

import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SiteHeader } from '@/components/header/site-header';

import { useWalletSession } from '@/hooks/use-wallet-session';
import { useEventListener } from '@/hooks/use-event-listener';
import { useNetworkStatus } from '@/hooks/use-network-status';

import { AlertCircleIcon, Loader2Icon } from 'lucide-react';

interface LayoutWrapperProps {
  children: React.ReactNode;
  defaultOpen: boolean;
}

export function LayoutWrapper({ children, defaultOpen }: LayoutWrapperProps) {
  const { isInitializing } = useWalletSession();
  const { isValidNetwork, expectedNetwork } = useNetworkStatus();

  const pathname = usePathname();

  useEventListener();

  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isValidNetwork && !isInitializing) {
    return (
      <div className='flex flex-col gap-2 items-center justify-center h-screen'>
        <Alert className='w-fit'>
          <AlertCircleIcon className='h-4 w-4' />
          <AlertDescription>
            Please connect to {expectedNetwork?.name} network
          </AlertDescription>
        </Alert>
        <Button
          size='lg'
          onClick={() => {
            window.location.reload();
          }}
        >
          Reload
        </Button>
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div className='flex flex-col items-center justify-center h-screen space-y-4'>
        <Loader2Icon className='w-8 h-8 animate-spin' />
      </div>
    );
  }

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant='inset' />
      <div className='flex flex-1 flex-col'>
        <SiteHeader />
        {children}
      </div>
    </SidebarProvider>
  );
}
