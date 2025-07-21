'use client';

import { useQuery } from '@tanstack/react-query';
import { networkQueryKeys } from '@/services/network/request';
import { contractManager } from '@/api/contract-manager';
import { getDeploymentInfo } from '@/utils/getDeploymentInfo';

const deploymentInfo = getDeploymentInfo();
const expectedNetworkName = deploymentInfo.network;

const EXPECTED_NETWORKS: { [key: string]: { name: string; chainId: number } } =
  {
    sepolia: {
      name: 'Sepolia',
      chainId: 11155111,
    },
    localhost: {
      name: 'Hardhat Local',
      chainId: 31337,
    },
    holesky: {
      name: 'Holesky',
      chainId: 17000,
    },
  };
export function useNetworkStatus() {
  const {
    data: network,
    isLoading,
    error,
  } = useQuery({
    ...networkQueryKeys.getCurrentNetwork(),
    enabled: contractManager.isInitialized(),
    refetchInterval: 15000, // Refetch every 15 seconds
  });

  const expectedNetwork = EXPECTED_NETWORKS[expectedNetworkName];

  // Check if current network matches expected network
  const isValidNetwork = network
    ? network.chainId === expectedNetwork?.chainId
    : false;

  return {
    network,
    expectedNetwork,
    isLoading,
    error,
    isValidNetwork,
    isConnected: !!network,
  };
}
