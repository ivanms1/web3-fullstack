"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";

import { useCreateTransaction } from "@/services/transaction";
import { Loader2, SendHorizontalIcon } from "lucide-react";
import { toast } from "sonner";

const transactionSchema = z.object({
  to: z
    .string()
    .min(1, "Recipient address is required")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Amount must be a positive number"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(3, "Description must be at least 3 characters")
    .max(200, "Description must be less than 200 characters"),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function TransactionDialog({ open, setOpen }: TransactionDialogProps) {
  const {
    mutate: createTransaction,
    isPending,
    error,
    reset: resetCreateTransaction,
  } = useCreateTransaction();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    mode: "onChange",
  });

  const watchedValues = watch();

  const onSubmit = async (data: TransactionFormData) => {
    createTransaction(
      {
        to: data.to.trim(),
        amount: data.amount.trim(),
        description: data.description.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Transaction created successfully");
          reset();
          setOpen(false);
        },
        onError: () => {
          toast.error("Failed to create transaction");
        },
      }
    );
  };

  const handleCancel = () => {
    reset();
    setOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      resetCreateTransaction();
    }
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <SendHorizontalIcon />
          Send Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Transaction</DialogTitle>
          <DialogDescription>
            Create a new transaction to send funds to another user.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Recipient Address */}
          <div className="space-y-2">
            <Label htmlFor="to">Recipient Address</Label>
            <Input
              id="to"
              placeholder="0x..."
              {...register("to")}
              className={errors.to ? "border-red-500" : ""}
            />
            {errors.to && (
              <p className="text-sm text-red-500">{errors.to.message}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (MT)</Label>
            <Input
              id="amount"
              type="number"
              step="0.001"
              placeholder="0.0"
              {...register("amount")}
              className={errors.amount ? "border-red-500" : ""}
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What is this transaction for?"
              {...register("description")}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Transaction Preview */}
          {watchedValues.to &&
            watchedValues.amount &&
            watchedValues.description && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                <h4 className="font-medium text-sm">Transaction Preview</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">To:</span> {watchedValues.to}
                  </p>
                  <p>
                    <span className="font-medium">Amount:</span>{" "}
                    {watchedValues.amount} ETH
                  </p>
                  <p>
                    <span className="font-medium">Description:</span>{" "}
                    {watchedValues.description}
                  </p>
                </div>
              </div>
            )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !isValid}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Transaction...
                </>
              ) : (
                "Send Transaction"
              )}
            </Button>
          </DialogFooter>
        </form>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-sm">
            <p className="text-sm text-red-600 dark:text-red-400 break-words">
              Error: {error.message}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
