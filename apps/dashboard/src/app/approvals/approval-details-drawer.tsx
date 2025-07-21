"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@repo/ui/components/drawer";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";

import { Approval, ApprovalStatus, ApprovalType } from "@/types/approval";
import { ProcessApprovalForm } from "./process-approval-form";
import { dayjs } from "@/lib/dayjs";

const TYPE_LABELS = {
  [ApprovalType.Transaction]: "Transaction",
  [ApprovalType.UserRole]: "User Role",
  [ApprovalType.SystemConfig]: "System Config",
};

const STATUS_CONFIG = {
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

interface ApprovalDetailsDrawerProps {
  approval: Approval | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApprovalDetailsDrawer({
  approval,
  open,
  onOpenChange,
}: ApprovalDetailsDrawerProps) {
  if (!approval) {
    return null;
  }

  const config = STATUS_CONFIG[approval.status] || {
    label: "Unknown",
    variant: "secondary" as const,
  };

  const date = dayjs(approval.timestamp * 1000);

  const handleFormSuccess = () => {
    onOpenChange(false);
  };

  const handleFormCancel = () => {
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="sm:min-w-[500px] min-w-full">
        <DrawerHeader>
          <DrawerTitle>Approval Details</DrawerTitle>
          <DrawerDescription>
            Transaction #{approval.transactionId}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 space-y-6">
          {/* Status and Type */}
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <Badge variant={config.variant} className="mt-1">
                {config.label}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <Badge variant="outline" className="mt-1">
                {TYPE_LABELS[approval.approvalType] || "Unknown"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Requester and Approver */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Requester
              </p>
              <p className="font-mono text-sm mt-1">{approval.requester}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Approver
              </p>
              <p className="font-mono text-sm mt-1">{approval.approver}</p>
            </div>
          </div>

          <Separator />

          {/* Reason */}
          <div>
            <p className="text-sm font-medium text-muted-foreground">Reason</p>
            <p className="text-sm mt-1 whitespace-pre-wrap">
              {approval.reason}
            </p>
          </div>

          <Separator />

          {/* Timestamp */}
          <div>
            <p className="text-sm font-medium text-muted-foreground">Created</p>
            <p className="text-sm mt-1">
              {date.format("MMMM D, YYYY [at] h:mm A")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {date.fromNow()}
            </p>
          </div>
        </div>

        <DrawerFooter>
          {approval.status === ApprovalStatus.Pending ? (
            <ProcessApprovalForm
              approval={approval}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          ) : (
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </DrawerClose>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
