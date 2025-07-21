"use client";

import { useQuery } from "@tanstack/react-query";

import { DashboardCharts } from "@/components/dashboard-charts";

import { userQueryKeys } from "@/services/user/request";
import { transactionQueryKeys } from "@/services/transaction/request";
import { approvalQueryKeys } from "@/services/approval/request";
import { useWalletSession } from "@/hooks/use-wallet-session";

export default function DashboardPage() {
  const { user } = useWalletSession();

  const { data: approvalCount } = useQuery({
    ...approvalQueryKeys.getApprovalCount(),
    enabled: !!user?.walletAddress,
  });

  const { data: transactionCount } = useQuery({
    ...transactionQueryKeys.getTransactionCount(),
    enabled: !!user?.walletAddress,
  });

  const { data: userCount } = useQuery({
    ...userQueryKeys.getUserCount(),
    enabled: !!user?.walletAddress,
  });

  // Fetch all transactions and approvals for charts
  const { data: allTransactions } = useQuery({
    ...transactionQueryKeys.getAllTransactions(),
    enabled: !!user?.walletAddress,
  });

  const { data: allApprovals } = useQuery({
    ...approvalQueryKeys.getAllApprovals(),
    enabled: !!user?.walletAddress,
  });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome {user?.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Approvals</h3>
          <p className="text-2xl font-bold text-orange-600">{approvalCount}</p>
        </div>
        <div className="p-6 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Total Transactions</h3>
          <p className="text-2xl font-bold text-green-600">
            {transactionCount}
          </p>
        </div>
        <div className="p-6 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Users</h3>
          <p className="text-2xl font-bold text-green-600">{userCount}</p>
        </div>
      </div>
      <DashboardCharts
        allTransactions={allTransactions}
        allApprovals={allApprovals}
      />
    </div>
  );
}
