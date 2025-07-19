import { useMutation } from "@tanstack/react-query";

import { contractManager } from "@/lib/contract-manager";

import type { User } from "@/types/user";

export function useRegisterUser() {
  return useMutation({
    mutationFn: (user: User) =>
      contractManager.registerUser(
        user.walletAddress,
        user.name,
        user.email,
        user.role
      ),
  });
}

export function useUpdateUserRole() {
  return useMutation({
    mutationFn: (user: User) =>
      contractManager.updateUserRole(user.walletAddress, user.role),
  });
}
