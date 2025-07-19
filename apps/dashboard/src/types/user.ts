export interface User {
  id: number;
  walletAddress: string;
  name: string;
  email: string;
  role: number; // 0 = Regular, 1 = Manager, 2 = Admin
  isActive: boolean;
  createdAt: number; // timestamp
}

// Enum values for UserRole from the contract
export enum UserRole {
  Regular = 0,
  Manager = 1,
  Admin = 2,
}
