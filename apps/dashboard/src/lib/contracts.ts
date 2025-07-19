// Contract ABIs and addresses
export const CONTRACT_ADDRESSES = {
  FINANCIAL_PLATFORM: "",
  MOCK_TOKEN: "",
} as const;

// Financial Platform ABI
export const FINANCIAL_PLATFORM_ABI = [] as const;

// Mock Token ABI
export const MOCK_TOKEN_ABI = [] as const;

export type ContractAddresses = typeof CONTRACT_ADDRESSES;
export type FinancialPlatformABI = typeof FINANCIAL_PLATFORM_ABI;
export type MockTokenABI = typeof MOCK_TOKEN_ABI;
