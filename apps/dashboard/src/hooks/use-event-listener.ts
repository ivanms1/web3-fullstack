import { useEffect } from 'react';
import { EventListener } from '@/lib/event-listener';
import { useWalletSession } from './use-wallet-session';
import { queryClient } from '@/lib/query-client';

export function useEventListener() {
  const { currentAccount } = useWalletSession();

  useEffect(() => {
    if (currentAccount) {
      // Re-initialize event listeners when wallet connects
      // This ensures we have the latest contract instance
      const eventListenerInstance = new EventListener(queryClient);

      // Small delay to ensure contract is ready
      const timer = setTimeout(() => {
        // The event listener will automatically re-initialize
      }, 500);

      return () => {
        clearTimeout(timer);
        eventListenerInstance.cleanup();
      };
    }
  }, [currentAccount]);

  return {
    // Expose cleanup method if needed
    cleanup: () => {
      // Cleanup handled in useEffect
    },
  };
}
