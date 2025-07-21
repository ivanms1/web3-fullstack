import { ethers } from 'ethers';
import {
  CONTRACT_ADDRESSES,
  FINANCIAL_PLATFORM_ABI,
  MOCK_TOKEN_ABI,
} from '@/lib/contracts';

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

  public static getInstance(): ContractManager {
    if (!ContractManager.instance) {
      ContractManager.instance = new ContractManager();
    }
    return ContractManager.instance;
  }

  // Initialize provider and signer
  public async initialize(): Promise<void> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();
    this.createContracts();
  }

  // Create contract instances
  private createContracts(): void {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    this.contracts.financialPlatform = new ethers.Contract(
      CONTRACT_ADDRESSES.FinancialPlatform,
      FINANCIAL_PLATFORM_ABI,
      this.signer || this.provider
    );

    this.contracts.mockToken = new ethers.Contract(
      CONTRACT_ADDRESSES.MockToken,
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
      throw new Error('Provider not initialized');
    }

    this.signer = await this.provider.getSigner();
    this.createContracts();
  }

  // Connect wallet
  public async connectWallet(): Promise<string> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    const accounts = (await window.ethereum.request({
      method: 'eth_requestAccounts',
    })) as string[];

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }

    await this.initialize();
    return accounts[0] || '';
  }

  // Get current account
  public async getCurrentAccount(): Promise<string | null> {
    if (typeof window === 'undefined' || !window.ethereum) {
      return null;
    }

    const accounts = (await window.ethereum.request({
      method: 'eth_accounts',
    })) as string[];

    return accounts && accounts.length > 0 ? accounts[0] || null : null;
  }
}

// Export singleton instance
export const contractManager = ContractManager.getInstance();
