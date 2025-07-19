import { ethers } from "ethers";
import { contractManager } from "./contract-manager";
import { Approval, ApprovalStatus, ApprovalType } from "@/types/approval";

export class ApprovalAPI {
  public async getApproval(approvalId: number): Promise<Approval> {
    const financialPlatform = contractManager.getFinancialPlatform();
    if (!financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    const result = await financialPlatform.getApproval?.(approvalId);

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

  public async getPendingApprovals(): Promise<number[]> {
    const financialPlatform = contractManager.getFinancialPlatform();
    if (!financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    return await financialPlatform.getPendingApprovals?.();
  }

  public async getApprovalCount(): Promise<number> {
    const financialPlatform = contractManager.getFinancialPlatform();
    if (!financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    return await financialPlatform.getApprovalCount?.();
  }

  public async requestApproval(
    transactionId: number,
    reason: string
  ): Promise<ethers.ContractTransactionResponse> {
    const financialPlatform = contractManager.getFinancialPlatform();
    if (!financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    return await financialPlatform.requestApproval?.(transactionId, reason);
  }

  public async processApproval(
    approvalId: number,
    approved: boolean,
    reason: string
  ): Promise<ethers.ContractTransactionResponse> {
    const financialPlatform = contractManager.getFinancialPlatform();
    if (!financialPlatform) {
      throw new Error("Financial Platform contract not initialized");
    }
    return await financialPlatform.processApproval?.(
      approvalId,
      approved,
      reason
    );
  }
}

export const approvalAPI = new ApprovalAPI();
