"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { walletQueryKeys } from "@/services/wallet/request";
import { useConnectWallet } from "@/services/wallet";
import { userQueryKeys } from "@/services/user/request";

export function useWalletSession() {
  const queryClient = useQueryClient();

  const { data: currentAccount, isLoading: isLoadingCurrentAccount } = useQuery(
    {
      ...walletQueryKeys.getCurrentAccount(),
    }
  );
  const { data: user, isLoading: isLoadingUser } = useQuery({
    ...userQueryKeys.getCurrentUser(),
    enabled: !!currentAccount,
  });

  const { mutate: connectWallet } = useConnectWallet();

  const router = useRouter();

  const userIsRegistered = user?.id !== 0;

  useEffect(() => {
    if (isLoadingCurrentAccount) {
      return;
    }
    if (currentAccount) {
      connectWallet();
    }

    if (!userIsRegistered) {
      router.push("/login");
    }

    if (!currentAccount) {
      router.push("/login");
    }
  }, [
    isLoadingCurrentAccount,
    currentAccount,
    connectWallet,
    router,
    userIsRegistered,
  ]);

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
    isInitializing: isLoadingUser || isLoadingCurrentAccount,
    currentAccount,
    connectWallet,
    user,
  };
}
