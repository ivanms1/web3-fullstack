"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";

import { transactionQueryKeys } from "@/services/transaction";
import { TransactionStatus, Transaction } from "@/types/transaction";
import { contractManager } from "@/lib/contract-manager";

interface TransactionFilters {
  status?: TransactionStatus;
  fromAddress?: string;
  toAddress?: string;
  minAmount?: string;
  maxAmount?: string;
  searchTerm?: string;
}

export function TransactionList() {
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const {
    data: allTransactions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    ...transactionQueryKeys.getAllTransactions(),
    enabled: contractManager.isInitialized(),
  });

  // Client-side filtering with useMemo for performance
  const filteredTransactions = useMemo(() => {
    return (
      allTransactions?.filter((transaction) => {
        // Filter by status
        if (
          filters.status !== undefined &&
          transaction.status !== Number(filters.status)
        ) {
          return false;
        }

        // Filter by from address
        if (
          filters.fromAddress &&
          transaction.from.toLowerCase() !== filters.fromAddress.toLowerCase()
        ) {
          return false;
        }

        // Filter by to address
        if (
          filters.toAddress &&
          transaction.to.toLowerCase() !== filters.toAddress.toLowerCase()
        ) {
          return false;
        }

        // Filter by amount range
        if (filters.minAmount) {
          const minAmount = parseFloat(filters.minAmount);
          const transactionAmount = parseFloat(transaction.amount);
          if (transactionAmount < minAmount) {
            return false;
          }
        }

        if (filters.maxAmount) {
          const maxAmount = parseFloat(filters.maxAmount);
          const transactionAmount = parseFloat(transaction.amount);
          if (transactionAmount > maxAmount) {
            return false;
          }
        }

        // Filter by search term (description)
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          const descriptionLower = transaction.description.toLowerCase();
          if (!descriptionLower.includes(searchLower)) {
            return false;
          }
        }

        return true;
      }) || []
    );
  }, [allTransactions, filters]);

  console.log("allTransactions", allTransactions);
  console.log("filteredTransactions", filteredTransactions);

  const handleFilterChange = (key: keyof TransactionFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getStatusText = (status: TransactionStatus) => {
    const statusMap = {
      [TransactionStatus.Pending]: "Pending",
      [TransactionStatus.Active]: "Active",
      [TransactionStatus.Completed]: "Completed",
      [TransactionStatus.Rejected]: "Rejected",
    };
    return statusMap[status];
  };

  const formatAmount = (amount: string) => {
    return `${parseFloat(amount).toLocaleString()} MT`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return (
      date.toLocaleDateString() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes()
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load transactions</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Transactions</h2>
          <p className="text-gray-600">
            {filteredTransactions?.length || 0} transactions found
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-medium">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Description</label>
              <Input
                placeholder="Search transactions..."
                value={filters.searchTerm || ""}
                onChange={(e) =>
                  handleFilterChange("searchTerm", e.target.value)
                }
              />
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                value={filters.status?.toString() || ""}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All statuses</option>
                <option value={TransactionStatus.Pending.toString()}>
                  Pending
                </option>
                <option value={TransactionStatus.Active.toString()}>
                  Active
                </option>
                <option value={TransactionStatus.Completed.toString()}>
                  Completed
                </option>
                <option value={TransactionStatus.Rejected.toString()}>
                  Rejected
                </option>
              </select>
            </div>

            {/* From Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium">From Address</label>
              <Input
                placeholder="0x..."
                value={filters.fromAddress || ""}
                onChange={(e) =>
                  handleFilterChange("fromAddress", e.target.value)
                }
              />
            </div>

            {/* To Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium">To Address</label>
              <Input
                placeholder="0x..."
                value={filters.toAddress || ""}
                onChange={(e) =>
                  handleFilterChange("toAddress", e.target.value)
                }
              />
            </div>

            {/* Amount Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Min Amount (ETH)</label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minAmount || ""}
                onChange={(e) =>
                  handleFilterChange("minAmount", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Amount (ETH)</label>
              <Input
                type="number"
                placeholder="∞"
                value={filters.maxAmount || ""}
                onChange={(e) =>
                  handleFilterChange("maxAmount", e.target.value)
                }
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Transaction List */}
      <div className="space-y-4">
        {filteredTransactions?.map((transaction: Transaction) => (
          <div key={transaction.id} className="border rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">#{transaction.id}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      transaction.status === TransactionStatus.Pending
                        ? "bg-yellow-100 text-yellow-800"
                        : transaction.status === TransactionStatus.Active
                          ? "bg-blue-100 text-blue-800"
                          : transaction.status === TransactionStatus.Completed
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {getStatusText(transaction.status)}
                  </span>
                </div>
                <p className="text-gray-600">{transaction.description}</p>
                <div className="flex space-x-4 text-sm text-gray-500 flex-col">
                  <span>From: {transaction.from}</span>
                  <span>To: {transaction.to}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {formatAmount(transaction.amount)}
                </div>
                <div className="flex space-x-4 text-sm text-gray-500 flex-col">
                  <span>{formatDate(transaction.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredTransactions?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
