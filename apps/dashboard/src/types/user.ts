export interface User {
  id: number;
  walletAddress: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: number; // timestamp
}

// Enum values for UserRole from the contract
export const UserRole = {
  Regular: 0,
  Manager: 1,
  Admin: 2,
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
