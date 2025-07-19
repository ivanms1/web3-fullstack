import { useMutation } from "@tanstack/react-query";

import { contractManager } from "@/lib/contract-manager";

export function useConnectWallet() {
  return useMutation({
    mutationFn: () => contractManager.connectWallet(),
  });
}
