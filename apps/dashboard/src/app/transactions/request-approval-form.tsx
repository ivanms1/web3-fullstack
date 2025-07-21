"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Transaction } from "@/types/transaction";
import { useRequestApproval } from "@/services/approval";

const requestApprovalSchema = z.object({
  reason: z
    .string()
    .min(1, "Reason is required")
    .max(500, "Reason must be less than 500 characters"),
});

type RequestApprovalFormData = z.infer<typeof requestApprovalSchema>;

interface RequestApprovalFormProps {
  transaction: Transaction;
  onSuccess: () => void;
  onCancel: () => void;
}

export function RequestApprovalForm({
  transaction,
  onSuccess,
  onCancel,
}: RequestApprovalFormProps) {
  const {
    mutate: requestApproval,
    isPending,
    isSuccess,
  } = useRequestApproval();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RequestApprovalFormData>({
    resolver: zodResolver(requestApprovalSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = (data: RequestApprovalFormData) => {
    requestApproval(
      {
        transactionId: transaction.id,
        reason: data.reason,
      },
      {
        onSuccess: () => {
          toast.success("Approval request has started processing");
          reset();
          onSuccess();
        },
        onError: () => {
          toast.error("Failed to request approval");
        },
      }
    );
  };

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reason">Reason for approval request</Label>
        <Textarea
          id="reason"
          placeholder="Enter your reason for requesting approval for this transaction..."
          {...register("reason")}
          className="min-h-[100px] resize-none"
        />
        {errors.reason && (
          <p className="text-sm text-destructive">{errors.reason.message}</p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          disabled={isPending || isSuccess}
          className="flex-1"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2" />
              Requesting...
            </>
          ) : (
            "Request Approval"
          )}
        </Button>
      </div>
    </form>
  );
}
