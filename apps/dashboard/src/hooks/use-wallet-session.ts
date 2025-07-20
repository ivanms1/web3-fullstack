"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { walletQueryKeys } from "@/services/wallet/request";
import { useConnectWallet } from "@/services/wallet";
import { userQueryKeys } from "@/services/user/request";
import { toast } from "sonner";

export function useWalletSession() {
  const queryClient = useQueryClient();

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

  // Listen for MetaMask account changes
  useEffect(() => {
    const handleAccountsChanged = () => {
      // Invalidate and refetch current user data when account changes
      queryClient.invalidateQueries();
      toast.success("Wallet account changed", {
        id: "wallet-account-changed",
      });
    };

    // Check if MetaMask is available
    if (typeof window !== "undefined" && window.ethereum) {
      // Listen for account changes
      window.ethereum.on("accountsChanged", handleAccountsChanged);

      // Cleanup listener on unmount
      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
        }
      };
    }
  }, [queryClient]);

  return {
    isInitializing: isLoadingCurrentAccount || isConnecting,
    currentAccount,
    connectWallet,
    user,
  };
}
