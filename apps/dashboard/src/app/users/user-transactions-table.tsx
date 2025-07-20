"use client";

import { useState } from "react";

import { dayjs } from "@/lib/dayjs";
import { ArrowUpRight, ArrowDownLeft, ArrowRight } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@repo/ui/components/badge";
import { Input } from "@repo/ui/components/input";
import { DataTable } from "@repo/ui/components/data-table";

import { Transaction, TransactionStatus } from "@/types/transaction";
import { truncateWalletAddress } from "@/utils/truncateWalletAddress";

import { TRANSACTION_STATUS_CONFIG } from "@/const";

const getStatusConfig = (status: TransactionStatus) => {
  return (
    TRANSACTION_STATUS_CONFIG[status] || {
      label: "Unknown",
      variant: "secondary" as const,
    }
  );
};

interface UserTransactionsTableProps {
  transactions: Transaction[];
  userAddress: string;
  isLoading?: boolean;
}

export function UserTransactionsTable({
  transactions,
  userAddress,
}: UserTransactionsTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  const getTransactionType = (transaction: Transaction) => {
    const isSender =
      transaction.from.toLowerCase() === userAddress.toLowerCase();
    const isReceiver =
      transaction.to.toLowerCase() === userAddress.toLowerCase();

    if (isSender && isReceiver) {
      return {
        type: "Self",
        icon: <ArrowRight className="w-4 h-4 text-muted-foreground" />,
        variant: "secondary" as const,
      };
    } else if (isSender) {
      return {
        type: "Sent",
        icon: <ArrowUpRight className="w-4 h-4 text-red-500" />,
        variant: "destructive" as const,
      };
    } else if (isReceiver) {
      return {
        type: "Received",
        icon: <ArrowDownLeft className="w-4 h-4 text-green-500" />,
        variant: "default" as const,
      };
    } else {
      return {
        type: "Unknown",
        icon: <ArrowRight className="w-4 h-4 text-muted-foreground" />,
        variant: "secondary" as const,
      };
    }
  };

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="font-mono text-sm">#{row.getValue("id")}</span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const transaction = row.original;
        const typeInfo = getTransactionType(transaction);
        return (
          <div className="flex items-center gap-2">
            {typeInfo.icon}
            <Badge variant={typeInfo.variant}>{typeInfo.type}</Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const typeInfo = getTransactionType(row.original);
        const isOutgoing = typeInfo.type === "Sent";

        return (
          <span
            className={`font-medium ${isOutgoing ? "text-red-600" : "text-green-600"}`}
          >
            {isOutgoing ? "-" : "+"}
            {amount.toLocaleString()} MT
          </span>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div
          className="max-w-[200px] truncate"
          title={row.getValue("description")}
        >
          {row.getValue("description")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as TransactionStatus;
        const config = getStatusConfig(status);
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      accessorKey: "from",
      header: "From",
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {truncateWalletAddress(row.getValue("from"))}
        </span>
      ),
    },
    {
      accessorKey: "to",
      header: "To",
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {truncateWalletAddress(row.getValue("to"))}
        </span>
      ),
    },
    {
      accessorKey: "timestamp",
      header: "Date",
      cell: ({ row }) => {
        const timestamp = row.getValue("timestamp") as number;
        return (
          <div className="text-sm">
            <div>{dayjs(timestamp * 1000).format("MMM D, YYYY")}</div>
            <div className="text-xs text-muted-foreground">
              {dayjs(timestamp * 1000).fromNow()}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Transaction History</h3>
          <p className="text-sm text-muted-foreground">
            {transactions.length} transaction
            {transactions.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search transactions..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      <DataTable columns={columns} data={transactions} />
    </div>
  );
}
