import { ethers, formatEther, parseEther } from "ethers";
import { contractManager } from "./contract-manager";
import { Transaction, TransactionStatus } from "@/types/transaction";

export class TransactionAPI {
  public async getTransaction(transactionId: number): Promise<Transaction> {
    const financialPlatform = contractManager.getFinancialPlatform();
    if (!financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    const result = await financialPlatform.getTransaction?.(transactionId);

    // Convert contract result to Transaction interface
    return {
      id: Number(result.id),
      from: result.from,
      to: result.to,
      amount: formatEther(result.amount),
      description: result.description,
      status: Number(result.status) as TransactionStatus,
      timestamp: Number(result.timestamp),
      approvalId: Number(result.approvalId),
    };
  }

  public async getAllTransactions(): Promise<Transaction[]> {
    const financialPlatform = contractManager.getFinancialPlatform();
    if (!financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }

    const transactionCount = await this.getTransactionCount();
    const transactions: Transaction[] = [];

    // Fetch all transactions (IDs start from 1)
    for (let i = 1; i <= transactionCount; i++) {
      try {
        const transaction = await this.getTransaction(i);
        transactions.push(transaction);
      } catch (error) {
        console.warn(`Failed to fetch transaction ${i}:`, error);
        // Continue with other transactions
      }
    }

    return transactions;
  }

  public async getUserTransactions(userAddress: string): Promise<number[]> {
    const financialPlatform = contractManager.getFinancialPlatform();
    if (!financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    return await financialPlatform.getUserTransactions?.(userAddress);
  }

  public async getTransactionCount(): Promise<number> {
    const financialPlatform = contractManager.getFinancialPlatform();
    if (!financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    return await financialPlatform.getTransactionCount?.();
  }

  public async createTransaction(
    to: string,
    amount: string,
    description: string
  ): Promise<ethers.ContractTransactionResponse> {
    const financialPlatform = contractManager.getFinancialPlatform();
    if (!financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    const value = parseEther(amount);
    return await financialPlatform.createTransaction?.(to, value, description);
  }

  public async completeTransaction(
    transactionId: number
  ): Promise<ethers.ContractTransactionResponse> {
    const financialPlatform = contractManager.getFinancialPlatform();
    if (!financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    return await financialPlatform.completeTransaction?.(transactionId);
  }
}

export const transactionAPI = new TransactionAPI();
