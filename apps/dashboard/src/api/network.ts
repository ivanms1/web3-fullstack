import { contractManager } from './contract-manager';

export class NetworkAPI {
  public async getCurrentNetwork(): Promise<{
    name: string;
    chainId: number;
    blockNumber: number;
  }> {
    const provider = contractManager.getProvider();
    if (!provider) {
      throw new Error('Provider not initialized');
    }

    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();

    // Map chain IDs to network names
    const networkNames: { [key: number]: string } = {
      1: 'Ethereum Mainnet',
      5: 'Goerli Testnet',
      11155111: 'Sepolia Testnet',
      17000: 'Holesky Testnet',
      31337: 'Hardhat Localhost',
      137: 'Polygon Mainnet',
      80001: 'Mumbai Testnet',
    };

    const networkName =
      networkNames[Number(network.chainId)] || `Chain ID ${network.chainId}`;

    return {
      name: networkName,
      chainId: Number(network.chainId),
      blockNumber: blockNumber,
    };
  }
}

export const networkAPI = new NetworkAPI();
