"use client";

import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { dayjs } from "@/lib/dayjs";
import { Badge } from "@repo/ui/components/badge";
import { Separator } from "@repo/ui/components/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Search, User, Wallet, Mail, Calendar, Activity } from "lucide-react";
import { toast } from "sonner";

import { UserRole } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { userQueryKeys } from "@/services/user/request";
import { transactionQueryKeys } from "@/services/transaction/request";
import { contractManager } from "@/api/contract-manager";
import { useUpdateUserRole } from "@/services/user";
import { truncateWalletAddress } from "@/utils/truncateWalletAddress";
import { UserTransactionsTable } from "./user-transactions-table";
import { RegisterUserDialog } from "./register-user-dialog";

import { useWalletSession } from "@/hooks/use-wallet-session";

const getRoleConfig = (role: UserRole) => {
  const roleConfig = {
    [UserRole.Regular]: {
      label: "Regular",
      variant: "secondary" as const,
    },
    [UserRole.Manager]: {
      label: "Manager",
      variant: "default" as const,
    },
    [UserRole.Admin]: {
      label: "Admin",
      variant: "default" as const,
    },
  };
  return (
    roleConfig[role] || { label: "Unknown", variant: "secondary" as const }
  );
};

const lookupSchema = z.object({
  walletAddress: z
    .string()
    .min(1, "Wallet address is required")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address format"),
});

type LookupFormData = z.infer<typeof lookupSchema>;

export function UserLookup() {
  const [searchedAddress, setSearchedAddress] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const { user: currentUser } = useWalletSession();
  const { mutate: updateUserRole, isPending: isUpdatingRole } =
    useUpdateUserRole();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LookupFormData>({
    resolver: zodResolver(lookupSchema),
    defaultValues: {
      walletAddress: "",
    },
  });

  // Query for user data
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    ...userQueryKeys.getUser(searchedAddress),
    enabled: !!searchedAddress && contractManager.isInitialized(),
  });

  // Initialize selectedRole when user data loads
  React.useEffect(() => {
    if (user && selectedRole === null) {
      setSelectedRole(user.role);
    }
  }, [user, selectedRole]);

  // Query for user transaction IDs
  const {
    data: userTransactionIds,
    isLoading: isLoadingTransactions,
    error: transactionsError,
  } = useQuery({
    ...transactionQueryKeys.getUserTransactions(searchedAddress),
    enabled: !!searchedAddress && contractManager.isInitialized(),
  });

  // userTransactionIds are big ints, so we need to convert them to string and then to number
  const selectedUserTransactionIds = useMemo(() => {
    if (!userTransactionIds) return [];
    return userTransactionIds.map((id) => +id.toString());
  }, [userTransactionIds]);

  // Fetch actual transaction data for each ID
  const { data: userTransactions, isLoading: isLoadingTransactionDetails } =
    useQuery({
      ...transactionQueryKeys.getTransactionsByIds(selectedUserTransactionIds),
      enabled:
        !!selectedUserTransactionIds && selectedUserTransactionIds.length > 0,
    });

  const onSubmit = (data: LookupFormData) => {
    setSearchedAddress(data.walletAddress);
  };

  const handleRoleUpdate = (newRole: UserRole) => {
    if (!user) return;

    // Update the selected role immediately for UI feedback
    setSelectedRole(newRole);

    updateUserRole(
      {
        userAddress: user.walletAddress,
        newRole,
      },
      {
        onSuccess: () => {
          toast.success("User role updated successfully");
        },
        onError: () => {
          toast.error("Failed to update user role");
          // Reset to the original user role on error
          setSelectedRole(user.role);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-card rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search User
          </h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="walletAddress">Wallet Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="walletAddress"
                    placeholder="0x..."
                    {...register("walletAddress")}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isLoadingUser || isLoadingTransactions}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
                {errors.walletAddress && (
                  <p className="text-sm text-destructive">
                    {errors.walletAddress.message}
                  </p>
                )}
              </div>
            </form>
            <RegisterUserDialog />
          </div>
        </div>
      </div>

      {/* User Information */}
      {searchedAddress && (
        <>
          {isLoadingUser ? (
            <div className="bg-card rounded-lg border">
              <div className="p-6">
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">
                      Loading user information...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : userError ? (
            <div className="bg-card rounded-lg border">
              <div className="p-6">
                <div className="text-center py-8">
                  <p className="text-destructive mb-2">User not found</p>
                  <p className="text-sm text-muted-foreground">
                    No user registered with this wallet address
                  </p>
                </div>
              </div>
            </div>
          ) : user ? (
            <div className="bg-card rounded-lg border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  User Information
                </h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Wallet className="w-4 h-4" />
                      Wallet Address
                    </div>
                    <p className="font-mono text-sm">{user.walletAddress}</p>
                    <p className="text-xs text-muted-foreground">
                      {truncateWalletAddress(user.walletAddress)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      Name
                    </div>
                    <p className="font-medium">{user.name}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                    <p className="text-sm">{user.email}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Activity className="w-4 h-4" />
                      Role
                    </div>
                    {currentUser?.role === UserRole.Admin ? (
                      <Select
                        value={(selectedRole ?? user.role).toString()}
                        onValueChange={(value) =>
                          handleRoleUpdate(Number(value) as UserRole)
                        }
                        disabled={isUpdatingRole}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={UserRole.Regular.toString()}>
                            Regular User
                          </SelectItem>
                          <SelectItem value={UserRole.Manager.toString()}>
                            Manager
                          </SelectItem>
                          <SelectItem value={UserRole.Admin.toString()}>
                            Admin
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={getRoleConfig(user.role).variant}>
                        {getRoleConfig(user.role).label}
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Status and Created */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Status</div>
                    <Badge variant={user.isActive ? "default" : "destructive"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      Created
                    </div>
                    <p className="text-sm">
                      {dayjs(user.createdAt * 1000).format("MMMM D, YYYY")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dayjs(user.createdAt * 1000).fromNow()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* User Transactions */}
          {user && (
            <div className="bg-card rounded-lg border">
              <div className="p-6">
                {isLoadingTransactions || isLoadingTransactionDetails ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-muted-foreground">
                        Loading transactions...
                      </p>
                    </div>
                  </div>
                ) : transactionsError ? (
                  <div className="text-center py-8">
                    <p className="text-destructive mb-2">
                      Failed to load transactions
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Unable to fetch user transactions
                    </p>
                  </div>
                ) : userTransactions ? (
                  <UserTransactionsTable
                    transactions={userTransactions}
                    userAddress={searchedAddress}
                    isLoading={
                      isLoadingTransactions || isLoadingTransactionDetails
                    }
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-2">
                      No transactions found
                    </p>
                    <p className="text-sm text-muted-foreground">
                      This user has no transactions yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
