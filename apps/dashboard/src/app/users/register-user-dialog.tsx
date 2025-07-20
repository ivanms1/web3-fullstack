"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

import { UserRole } from "@/types/user";
import { useRegisterUser } from "@/services/user";

const registerUserSchema = z.object({
  walletAddress: z
    .string()
    .min(1, "Wallet address is required")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address format"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  role: z.nativeEnum(UserRole),
});

type RegisterUserFormData = z.infer<typeof registerUserSchema>;

interface RegisterUserDialogProps {
  onSuccess?: () => void;
}

export function RegisterUserDialog({ onSuccess }: RegisterUserDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: registerUser, isPending, isSuccess } = useRegisterUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<RegisterUserFormData>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      walletAddress: "",
      name: "",
      email: "",
      role: UserRole.Regular,
    },
  });

  const onSubmit = (data: RegisterUserFormData) => {
    registerUser(
      {
        walletAddress: data.walletAddress,
        name: data.name,
        email: data.email,
        role: data.role,
      },
      {
        onSuccess: () => {
          toast.success("User registered successfully");
          reset();
          setOpen(false);
          onSuccess?.();
        },
        onError: () => {
          toast.error("Failed to register user");
        },
      }
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isPending) {
      reset();
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register New User</DialogTitle>
          <DialogDescription>
            Add a new user to the platform with their wallet address and
            details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="walletAddress">Wallet Address</Label>
            <Input
              id="walletAddress"
              placeholder="0x..."
              {...register("walletAddress")}
            />
            {errors.walletAddress && (
              <p className="text-sm text-destructive">
                {errors.walletAddress.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter user's full name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              onValueChange={(value) =>
                setValue("role", Number(value) as UserRole)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.Regular.toString()}>
                  Regular User
                </SelectItem>
                <SelectItem value={UserRole.Manager.toString()}>
                  Manager
                </SelectItem>
                <SelectItem value={UserRole.Admin.toString()}>Admin</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || isSuccess}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2" />
                  Registering...
                </>
              ) : (
                "Register User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
