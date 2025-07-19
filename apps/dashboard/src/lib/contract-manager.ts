import { ethers } from "ethers";
import {
  CONTRACT_ADDRESSES,
  FINANCIAL_PLATFORM_ABI,
  MOCK_TOKEN_ABI,
} from "./contracts";
import { User, UserRole } from "../types/user";
import { Transaction, TransactionStatus } from "../types/transaction";
import { Approval, ApprovalStatus, ApprovalType } from "../types/approval";

export type Provider = ethers.BrowserProvider | null;
export type Signer = ethers.JsonRpcSigner | null;

export class ContractManager {
  private static instance: ContractManager;
  private provider: Provider = null;
  private signer: Signer = null;
  private contracts: {
    financialPlatform: ethers.Contract | null;
    mockToken: ethers.Contract | null;
  } = {
    financialPlatform: null,
    mockToken: null,
  };

  private constructor() {}

  // Singleton pattern
  public static getInstance(): ContractManager {
    if (!ContractManager.instance) {
      ContractManager.instance = new ContractManager();
    }
    return ContractManager.instance;
  }

  // Initialize provider and signer
  public async initialize(): Promise<void> {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();
    this.createContracts();
  }

  // Create contract instances
  private createContracts(): void {
    if (!this.provider) {
      throw new Error("Provider not initialized");
    }

    this.contracts.financialPlatform = new ethers.Contract(
      CONTRACT_ADDRESSES.FINANCIAL_PLATFORM,
      FINANCIAL_PLATFORM_ABI,
      this.signer || this.provider
    );

    this.contracts.mockToken = new ethers.Contract(
      CONTRACT_ADDRESSES.MOCK_TOKEN,
      MOCK_TOKEN_ABI,
      this.signer || this.provider
    );
  }

  // Get provider
  public getProvider(): Provider {
    return this.provider;
  }

  // Get signer
  public getSigner(): Signer {
    return this.signer;
  }

  // Get all contracts
  public getContracts() {
    return this.contracts;
  }

  // Get specific contract
  public getFinancialPlatform(): ethers.Contract | null {
    return this.contracts.financialPlatform;
  }

  public getMockToken(): ethers.Contract | null {
    return this.contracts.mockToken;
  }

  // Check if initialized
  public isInitialized(): boolean {
    return this.provider !== null && this.signer !== null;
  }

  // Update signer (useful when account changes)
  public async updateSigner(): Promise<void> {
    if (!this.provider) {
      throw new Error("Provider not initialized");
    }

    this.signer = await this.provider.getSigner();
    this.createContracts();
  }

  // Connect wallet
  public async connectWallet(): Promise<string> {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    const accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found");
    }

    await this.initialize();
    return accounts[0] || "";
  }

  // Get current account
  public async getCurrentAccount(): Promise<string | null> {
    if (typeof window === "undefined" || !window.ethereum) {
      return null;
    }

    try {
      const accounts = (await window.ethereum.request({
        method: "eth_accounts",
      })) as string[];

      return accounts && accounts.length > 0 ? accounts[0] || null : null;
    } catch {
      return null;
    }
  }

  // Utility functions
  public formatEther(value: bigint | string): string {
    return ethers.formatEther(value);
  }

  public parseEther(value: string): bigint {
    return ethers.parseEther(value);
  }

  public formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Financial Platform contract methods
  public async getTransaction(transactionId: number): Promise<Transaction> {
    if (!this.contracts.financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    const result =
      await this.contracts.financialPlatform!.getTransaction?.(transactionId);

    // Convert contract result to Transaction interface
    return {
      id: Number(result.id),
      from: result.from,
      to: result.to,
      amount: this.formatEther(result.amount),
      description: result.description,
      status: Number(result.status) as TransactionStatus,
      timestamp: Number(result.timestamp),
      approvalId: Number(result.approvalId),
    };
  }

  public async getApproval(approvalId: number): Promise<Approval> {
    if (!this.contracts.financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    const result =
      await this.contracts.financialPlatform!.getApproval?.(approvalId);

    // Convert contract result to Approval interface
    return {
      id: Number(result.id),
      transactionId: Number(result.transactionId),
      requester: result.requester,
      approver: result.approver,
      approvalType: Number(result.approvalType) as ApprovalType,
      status: Number(result.status) as ApprovalStatus,
      reason: result.reason,
      timestamp: Number(result.timestamp),
    };
  }

  public async getUser(userAddress: string): Promise<User> {
    if (!this.contracts.financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    const result =
      await this.contracts.financialPlatform!.getUser?.(userAddress);

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

  public async getUserTransactions(userAddress: string): Promise<number[]> {
    if (!this.contracts.financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    return await this.contracts.financialPlatform!.getUserTransactions?.(
      userAddress
    );
  }

  public async getPendingApprovals(): Promise<number[]> {
    if (!this.contracts.financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    return await this.contracts.financialPlatform!.getPendingApprovals?.();
  }

  public async getTransactionCount(): Promise<number> {
    if (!this.contracts.financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    return await this.contracts.financialPlatform!.getTransactionCount?.();
  }

  public async getApprovalCount(): Promise<number> {
    if (!this.contracts.financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    return await this.contracts.financialPlatform!.getApprovalCount?.();
  }

  public async getUserCount(): Promise<number> {
    if (!this.contracts.financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    return await this.contracts.financialPlatform!.getUserCount?.();
  }

  public async registerUser(
    walletAddress: string,
    name: string,
    email: string,
    role: UserRole
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.contracts.financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    return await this.contracts.financialPlatform!.registerUser?.(
      walletAddress,
      name,
      email,
      role
    );
  }

  public async createTransaction(
    to: string,
    amount: string,
    description: string
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.contracts.financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    const value = this.parseEther(amount);
    return await this.contracts.financialPlatform!.createTransaction?.(
      to,
      value,
      description
    );
  }

  public async requestApproval(
    transactionId: number,
    reason: string
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.contracts.financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    return await this.contracts.financialPlatform!.requestApproval?.(
      transactionId,
      reason
    );
  }

  public async processApproval(
    approvalId: number,
    approved: boolean,
    reason: string
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.contracts.financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    return await this.contracts.financialPlatform!.processApproval?.(
      approvalId,
      approved,
      reason
    );
  }

  public async completeTransaction(
    transactionId: number
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.contracts.financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    return await this.contracts.financialPlatform!.completeTransaction?.(
      transactionId
    );
  }

  public async updateUserRole(
    userAddress: string,
    newRole: UserRole
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.contracts.financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    return await this.contracts.financialPlatform!.updateUserRole?.(
      userAddress,
      newRole
    );
  }

  // Mock Token contract methods
  public async getTokenBalance(userAddress: string): Promise<string> {
    if (!this.contracts.mockToken) {
      throw new Error("Mock Token contract not initialized");
    }
    const balance = await this.contracts.mockToken!.balanceOf?.(userAddress);
    return this.formatEther(balance);
  }

  public async transferToken(
    to: string,
    amount: string
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.contracts.mockToken) {
      throw new Error("Mock Token contract not initialized");
    }
    const value = this.parseEther(amount);
    return await this.contracts.mockToken!.transfer?.(to, value);
  }

  public async mintToken(
    to: string,
    amount: string
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.contracts.mockToken) {
      throw new Error("Mock Token contract not initialized");
    }
    return await this.contracts.mockToken!.mint?.(to, this.parseEther(amount));
  }

  public async burnToken(
    amount: string
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.contracts.mockToken) {
      throw new Error("Mock Token contract not initialized");
    }
    return await this.contracts.mockToken!.burn?.(this.parseEther(amount));
  }
}

// Export singleton instance
export const contractManager = ContractManager.getInstance();
