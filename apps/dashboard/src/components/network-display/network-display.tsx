"use client";

import { useQuery } from "@tanstack/react-query";
import { Network, Loader2Icon } from "lucide-react";

import { networkQueryKeys } from "@/services/network/request";
import { contractManager } from "@/api/contract-manager";
import { useWalletSession } from "@/hooks/use-wallet-session";
import { truncateWalletAddress } from "@/utils/truncateWalletAddress";

export function NetworkDisplay() {
  const {
    data: network,
    isLoading,
    error,
  } = useQuery({
    ...networkQueryKeys.getCurrentNetwork(),
    enabled: contractManager.isInitialized(),
    refetchInterval: 15000, // Refetch every 15 seconds to get updated block number
  });

  const { currentAccount } = useWalletSession();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Network className="w-4 h-4" />
        <Loader2Icon className="animate-spin" />
        <span>Loading network...</span>
      </div>
    );
  }

  if (error || !network) {
    return (
      <div className="flex items-center space-x-2 text-sm text-red-500">
        <Network className="w-4 h-4" />
        <span>Network error</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      <Network className="w-4 h-4 text-blue-500" />
      <div className="flex flex-col">
        <span className="font-medium text-gray-900 dark:text-white">
          {network.name}
        </span>
        <span className="text-xs text-gray-500">
          Block #{network.blockNumber}
        </span>
        <span className="text-xs text-gray-500 truncate hidden sm:block">
          {currentAccount}
        </span>
        <span className="text-xs text-gray-500 truncate sm:hidden block">
          {truncateWalletAddress(currentAccount ?? "")}
        </span>
      </div>
    </div>
  );
}
