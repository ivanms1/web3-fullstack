import { ethers } from "ethers";
import { contractManager } from "@/api/contract-manager";
import type { QueryClient } from "@tanstack/react-query";
import { getDefaultStore } from "jotai";

import { QUERY_KEYS } from "@/services/queryKeys";
import { addEventAtom } from "@/store/events";
import {
  APPROVAL_STATUS_CONFIG,
  ROLE_CONFIG,
  TRANSACTION_STATUS_CONFIG,
} from "@/const";
import { EVENT_TYPES } from "@/types/event";

export class EventListener {
  private financialPlatform: ethers.Contract | null = null;
  private listeners: Array<() => void> = [];
  private queryClient: QueryClient | null = null;
  private store = getDefaultStore();

  constructor(queryClient?: QueryClient) {
    this.queryClient = queryClient || null;
    this.initialize();
  }

  private initialize() {
    this.financialPlatform = contractManager.getFinancialPlatform();
    if (this.financialPlatform) {
      this.setupEventListeners();
    } else {
      // Wait for contract to be initialized
      setTimeout(() => {
        this.financialPlatform = contractManager.getFinancialPlatform();
        if (this.financialPlatform) {
          this.setupEventListeners();
        }
      }, 1000);
    }
  }

  private setupEventListeners() {
    if (!this.financialPlatform) return;

    // Transaction Events
    this.financialPlatform.on(
      "TransactionCreated",
      (
        transactionId: ethers.BigNumberish,
        from: string,
        to: string,
        amount: ethers.BigNumberish
      ) => {
        const formattedAmount = ethers.formatEther(amount);
        this.store.set(addEventAtom, {
          type: EVENT_TYPES.TRANSACTION_CREATED,
          title: `Transaction #${transactionId} created`,
          description: `${formattedAmount} MT from ${from.slice(0, 6)}...${from.slice(-4)} to ${to.slice(0, 6)}...${to.slice(-4)}`,
          status: "success",
          data: { transactionId, from, to, amount: formattedAmount },
        });

        // Invalidate related queries
        if (this.queryClient) {
          this.queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.TRANSACTION],
          });
        }
      }
    );

    this.financialPlatform.on(
      "TransactionStatusUpdated",
      (transactionId: ethers.BigNumberish, status: number) => {
        const serializedStatus = +status.toString();
        const statusName =
          TRANSACTION_STATUS_CONFIG[
            serializedStatus as keyof typeof TRANSACTION_STATUS_CONFIG
          ]?.label || "Unknown";

        if (status === 2) {
          // Completed
          this.store.set(addEventAtom, {
            type: EVENT_TYPES.TRANSACTION_COMPLETED,
            title: `Transaction #${transactionId} completed`,
            description: "Transaction has been successfully processed",
            status: "success",
            data: { transactionId, status: statusName },
          });
        } else if (status === 3) {
          // Rejected
          this.store.set(addEventAtom, {
            type: EVENT_TYPES.TRANSACTION_REJECTED,
            title: `Transaction #${transactionId} rejected`,
            description: "Transaction was rejected",
            status: "error",
            data: { transactionId, status: statusName },
          });
        } else {
          this.store.set(addEventAtom, {
            type: EVENT_TYPES.TRANSACTION_STATUS_UPDATED,
            title: `Transaction #${transactionId} status updated`,
            description: `Status changed to ${statusName}`,
            status: "info",
            data: { transactionId, status: statusName },
          });
        }

        // Invalidate related queries
        if (this.queryClient) {
          this.queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.TRANSACTION],
          });
          this.queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.APPROVAL],
          });
        }
      }
    );

    // Approval Events
    this.financialPlatform.on(
      "ApprovalRequested",
      (
        approvalId: ethers.BigNumberish,
        transactionId: ethers.BigNumberish,
        requester: string
      ) => {
        this.store.set(addEventAtom, {
          type: EVENT_TYPES.APPROVAL_REQUESTED,
          title: `Approval #${approvalId} requested`,
          description: `Transaction #${transactionId} needs approval from ${requester.slice(0, 6)}...${requester.slice(-4)}`,
          status: "info",
          data: { approvalId, transactionId, requester },
        });

        // Invalidate related queries
        if (this.queryClient) {
          this.queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.APPROVAL],
          });
          this.queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.TRANSACTION],
          });
        }
      }
    );

    this.financialPlatform.on(
      "ApprovalProcessed",
      (approvalId: ethers.BigNumberish, status: number, approver: string) => {
        const serializedStatus = +status.toString();
        const statusName =
          APPROVAL_STATUS_CONFIG[
            serializedStatus as keyof typeof APPROVAL_STATUS_CONFIG
          ]?.label || "Unknown";

        const isApproved = serializedStatus === 1;

        this.store.set(addEventAtom, {
          type: EVENT_TYPES.APPROVAL_PROCESSED,
          title: `Approval #${approvalId} ${statusName.toLowerCase()}`,
          description: `Approval was ${statusName.toLowerCase()} by ${approver.slice(0, 6)}...${approver.slice(-4)}`,
          status: isApproved ? "success" : "error",
          data: { approvalId, status: statusName, approver },
        });

        // Invalidate related queries
        if (this.queryClient) {
          this.queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.APPROVAL],
          });
          this.queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.TRANSACTION],
          });
        }
      }
    );

    // User Events
    this.financialPlatform.on(
      "UserRegistered",
      (userId: ethers.BigNumberish, walletAddress: string, name: string) => {
        this.store.set(addEventAtom, {
          type: EVENT_TYPES.USER_REGISTERED,
          title: `User registered`,
          description: `${name} - ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
          status: "success",
          data: { userId, walletAddress, name },
        });

        // Invalidate related queries
        if (this.queryClient) {
          this.queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.USER],
          });
        }
      }
    );

    this.financialPlatform.on(
      "UserRoleUpdated",
      (userAddress: string, newRole: number) => {
        const serializedRole = +newRole.toString();
        const roleName =
          ROLE_CONFIG[serializedRole as keyof typeof ROLE_CONFIG]?.label ||
          "Unknown";

        this.store.set(addEventAtom, {
          type: EVENT_TYPES.USER_ROLE_UPDATED,
          title: `User role updated`,
          description: `${userAddress.slice(0, 6)}...${userAddress.slice(-4)} is now ${roleName}`,
          status: "info",
          data: { userAddress, newRole, roleName },
        });

        // Invalidate related queries
        if (this.queryClient) {
          this.queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.USER],
          });
        }
      }
    );
  }

  public cleanup() {
    if (this.financialPlatform) {
      this.financialPlatform.removeAllListeners();
    }
    this.listeners.forEach((cleanup) => cleanup());
    this.listeners = [];
  }

  public addCleanupListener(cleanup: () => void) {
    this.listeners.push(cleanup);
  }
}

// Create a singleton instance
export const eventListener = new EventListener();
