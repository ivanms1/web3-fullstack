"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { walletQueryKeys } from "@/services/wallet/request";
import { useConnectWallet } from "@/services/wallet";
import { userQueryKeys } from "@/services/user/request";

export function useWalletSession() {
  const { data: currentAccount, isLoading: isLoadingCurrentAccount } = useQuery(
    {
      ...walletQueryKeys.getCurrentAccount(),
    }
  );
  const { data: user } = useQuery({ ...userQueryKeys.getCurrentUser() });

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
    user,
  };
}
