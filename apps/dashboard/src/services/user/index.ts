import { useMutation } from "@tanstack/react-query";

import { userAPI } from "@/api/user";
import type { User } from "@/types/user";

export function useRegisterUser() {
  return useMutation({
    mutationFn: (user: User) =>
      userAPI.registerUser(
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
      userAPI.updateUserRole(user.walletAddress, user.role),
  });
}
