import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userAPI } from "@/api/user";
import { UserRole } from "@/types/user";
import { userQueryKeys } from "./request";

export function useRegisterUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      walletAddress,
      name,
      email,
      role,
    }: {
      walletAddress: string;
      name: string;
      email: string;
      role: UserRole;
    }) => userAPI.registerUser(walletAddress, name, email, role),
    onSuccess: () => {
      queryClient.invalidateQueries(userQueryKeys.getUserCount());
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userAddress,
      newRole,
    }: {
      userAddress: string;
      newRole: UserRole;
    }) => userAPI.updateUserRole(userAddress, newRole),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(
        userQueryKeys.getUser(variables.userAddress)
      );
    },
  });
}
