import { useMutation } from '@tanstack/react-query';

import { contractManager } from '@/api/contract-manager';

export const useConnectWallet = () => {
  return useMutation({
    mutationFn: () => contractManager.connectWallet(),
  });
};

export const useUpdateSigner = () => {
  return useMutation({
    mutationFn: () => contractManager.updateSigner(),
  });
};
