import { ethers } from "ethers";
import { contractManager } from "./contract-manager";
import { User, UserRole } from "@/types/user";

export class UserAPI {
  public async getUser(userAddress: string): Promise<User> {
    const financialPlatform = contractManager.getFinancialPlatform();
    if (!financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }

    const result = await financialPlatform.getUser?.(userAddress);

    // Convert contract result to User interface
    return {
      id: Number(result.id),
      walletAddress: result.walletAddress,
      name: result.name,
      email: result.email,
      role: Number(result.role) as UserRole,
      isActive: result.isActive,
      createdAt: Number(result.createdAt),
    };
  }

  public async getCurrentUser(): Promise<User> {
    const currentAccount = await contractManager.getCurrentAccount();
    if (!currentAccount) {
      throw new Error("No wallet connected");
    }
    return await this.getUser(currentAccount);
  }

  public async isUserRegistered(userAddress: string): Promise<boolean> {
    const financialPlatform = contractManager.getFinancialPlatform();
    if (!financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }

    try {
      const result = await financialPlatform.getUser?.(userAddress);
      return Number(result.id) !== 0;
    } catch {
      return false;
    }
  }

  public async getUserCount(): Promise<number> {
    const financialPlatform = contractManager.getFinancialPlatform();
    if (!financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    return await financialPlatform.getUserCount?.();
  }

  public async registerUser(
    walletAddress: string,
    name: string,
    email: string,
    role: UserRole
  ): Promise<ethers.ContractTransactionResponse> {
    const financialPlatform = contractManager.getFinancialPlatform();
    if (!financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    return await financialPlatform.registerUser?.(
      walletAddress,
      name,
      email,
      role
    );
  }

  public async updateUserRole(
    userAddress: string,
    newRole: UserRole
  ): Promise<ethers.ContractTransactionResponse> {
    const financialPlatform = contractManager.getFinancialPlatform();
    if (!financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    return await financialPlatform.updateUserRole?.(userAddress, newRole);
  }
}

export const userAPI = new UserAPI();
