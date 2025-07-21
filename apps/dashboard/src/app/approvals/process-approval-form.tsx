"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Approval, ApprovalStatus } from "@/types/approval";
import { useProcessApproval } from "@/services/approval";

const processApprovalSchema = z.object({
  reason: z
    .string()
    .min(1, "Reason is required")
    .max(500, "Reason must be less than 500 characters"),
});

type ProcessApprovalFormData = z.infer<typeof processApprovalSchema>;

interface ProcessApprovalFormProps {
  approval: Approval;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProcessApprovalForm({
  approval,
  onSuccess,
  onCancel,
}: ProcessApprovalFormProps) {
  const {
    mutate: processApproval,
    isPending,
    isSuccess,
  } = useProcessApproval();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProcessApprovalFormData>({
    resolver: zodResolver(processApprovalSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = (data: ProcessApprovalFormData) => {
    processApproval(
      {
        ...approval,
        status: ApprovalStatus.Approved,
        reason: data.reason,
      },
      {
        onSuccess: () => {
          toast.success("Approval process started");
          reset();
          onSuccess();
        },
        onError: () => {
          toast.error("Failed to process approval");
        },
      }
    );
  };

  const onReject = (data: ProcessApprovalFormData) => {
    processApproval(
      {
        ...approval,
        status: ApprovalStatus.Rejected,
        reason: data.reason,
      },
      {
        onSuccess: () => {
          toast.success("Approval rejected successfully");
          reset();
          onSuccess();
        },
        onError: () => {
          toast.error("Failed to reject approval");
        },
      }
    );
  };

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reason">Reason for decision</Label>
        <Textarea
          id="reason"
          placeholder="Enter your reason for approving or rejecting this request..."
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
          type="button"
          variant="destructive"
          onClick={handleSubmit(onReject)}
          disabled={isPending || isSuccess}
          className="flex-1"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2" />
              Processing...
            </>
          ) : (
            "Reject"
          )}
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
              Processing...
            </>
          ) : (
            "Approve"
          )}
        </Button>
      </div>
    </form>
  );
}
