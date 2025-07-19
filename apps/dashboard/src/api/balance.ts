import { formatEther } from "ethers/utils";
import { contractManager } from "./contract-manager";

export class BalanceAPI {
  public async getTokenBalance(userAddress: string): Promise<string> {
    const mockToken = contractManager.getMockToken();
    if (!mockToken) {
      throw new Error("Mock Token contract not initialized");
    }

    const balance = await mockToken.balanceOf?.(userAddress);
    return formatEther(balance);
  }

  public async getEthBalance(userAddress: string): Promise<string> {
    const provider = contractManager.getProvider();
    if (!provider) {
      throw new Error("Provider not initialized");
    }
    const balance = await provider.getBalance(userAddress);
    return formatEther(balance);
  }

  public async getCurrentEthBalance(): Promise<string> {
    const currentAccount = await contractManager.getCurrentAccount();
    if (!currentAccount) {
      throw new Error("No wallet connected");
    }
    return await this.getEthBalance(currentAccount);
  }

  public async getCurrentTokenBalance(): Promise<string> {
    const currentAccount = await contractManager.getCurrentAccount();
    if (!currentAccount) {
      throw new Error("No wallet connected");
    }
    return await this.getTokenBalance(currentAccount);
  }
}

export const balanceAPI = new BalanceAPI();
