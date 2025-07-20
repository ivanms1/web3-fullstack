"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { walletQueryKeys } from "@/services/wallet/request";
import { useConnectWallet } from "@/services/wallet";

export function useWalletSession() {
  const { data: currentAccount, isLoading: isLoadingCurrentAccount } = useQuery(
    {
      ...walletQueryKeys.getCurrentAccount(),
    }
  );

  const { mutate: connectWallet, isPending: isConnecting } = useConnectWallet();

  useEffect(() => {
    if (currentAccount) {
      connectWallet();
    }
  }, [connectWallet, currentAccount]);

  return {
    isInitializing: isLoadingCurrentAccount || isConnecting,
    currentAccount,
    connectWallet,
  };
}
