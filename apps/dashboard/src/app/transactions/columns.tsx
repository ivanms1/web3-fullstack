"use client";

import { dayjs } from "@/lib/dayjs";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@repo/ui/components/badge";

import { Transaction, TransactionStatus } from "@/types/transaction";
import { truncateWalletAddress } from "@/utils/truncateWalletAddress";
import { TRANSACTION_STATUS_CONFIG } from "@/const";

export const COLUMNS: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-mono">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "from",
    header: "From",
    cell: ({ row }) => (
      <div className="font-mono">
        {truncateWalletAddress(row.getValue("from"))}
      </div>
    ),
  },
  {
    accessorKey: "to",
    header: "To",
    cell: ({ row }) => (
      <div className="font-mono">
        {truncateWalletAddress(row.getValue("to"))}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as string;
      const formattedAmount = `${parseFloat(amount).toLocaleString()} MT`;
      return <div className="font-medium">{formattedAmount}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div
        className="max-w-[300px] truncate"
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

      const config = TRANSACTION_STATUS_CONFIG[status] || {
        label: "Unknown",
        variant: "secondary" as const,
      };
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: "timestamp",
    header: "Created",
    cell: ({ row }) => {
      const timestamp = row.getValue("timestamp") as number;
      const date = dayjs(timestamp * 1000);
      return (
        <div className="text-sm text-muted-foreground">{date.fromNow()}</div>
      );
    },
  },
];
