"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@repo/ui/components/badge";

import { truncateWalletAddress } from "@/utils/truncateWalletAddress";

import { Approval, ApprovalStatus, ApprovalType } from "@/types/approval";

dayjs.extend(relativeTime);

export const COLUMNS: ColumnDef<Approval>[] = [
  {
    accessorKey: "transactionId",
    header: "Transaction ID",
    cell: ({ row }) => (
      <div className="font-mono">#{row.getValue("transactionId")}</div>
    ),
  },
  {
    accessorKey: "requester",
    header: "Requester",
    cell: ({ row }) => (
      <div className="font-mono">
        {truncateWalletAddress(row.getValue("requester"))}
      </div>
    ),
  },
  {
    accessorKey: "approver",
    header: "Approver",
    cell: ({ row }) => (
      <div className="font-mono">
        {truncateWalletAddress(row.getValue("approver"))}
      </div>
    ),
  },
  {
    accessorKey: "approvalType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("approvalType") as ApprovalType;
      const typeLabels = {
        [ApprovalType.Transaction]: "Transaction",
        [ApprovalType.UserRole]: "User Role",
        [ApprovalType.SystemConfig]: "System Config",
      };
      return <Badge variant="secondary">{typeLabels[type] || "Unknown"}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as ApprovalStatus;
      const statusConfig = {
        [ApprovalStatus.Pending]: {
          label: "Pending",
          variant: "secondary" as const,
        },
        [ApprovalStatus.Approved]: {
          label: "Approved",
          variant: "default" as const,
        },
        [ApprovalStatus.Rejected]: {
          label: "Rejected",
          variant: "destructive" as const,
        },
      };
      const config = statusConfig[status] || {
        label: "Unknown",
        variant: "secondary" as const,
      };
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <div className="max-w-[400px] truncate" title={row.getValue("reason")}>
        {row.getValue("reason")}
      </div>
    ),
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
