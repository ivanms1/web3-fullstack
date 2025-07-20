"use client";

import { useState } from "react";
import { Input } from "@repo/ui/components/input";
import { DataTable } from "@repo/ui/components/data-table";

import { Transaction } from "@/types/transaction";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { COLUMNS } from "@/app/transactions/columns";
import { useQuery } from "@tanstack/react-query";
import { transactionQueryKeys } from "@/services/transaction/request";
import { contractManager } from "@/api/contract-manager";
import { TransactionDetailsDrawer } from "./transaction-details-drawer";

dayjs.extend(relativeTime);

export function TransactionsTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch all transactions
  const { data: allTransactions, isLoading: isLoadingAll } = useQuery({
    ...transactionQueryKeys.getAllTransactions(),
    enabled: contractManager.isInitialized(),
  });

  // Filter data based on global filter
  const filteredData = allTransactions?.filter((transaction: Transaction) => {
    if (!globalFilter) return true;

    const searchTerm = globalFilter.toLowerCase();
    return (
      transaction.id.toString().includes(searchTerm) ||
      transaction.from.toLowerCase().includes(searchTerm) ||
      transaction.to.toLowerCase().includes(searchTerm) ||
      transaction.description.toLowerCase().includes(searchTerm) ||
      transaction.amount.includes(searchTerm)
    );
  });

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDrawerOpen(true);
  };

  if (isLoadingAll) {
    return (
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {allTransactions?.length} total transactions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search transactions..."
            value={globalFilter}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setGlobalFilter(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      </div>

      <DataTable
        columns={COLUMNS}
        data={filteredData || []}
        onRowClick={handleRowClick}
      />

      <TransactionDetailsDrawer
        transaction={selectedTransaction}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
