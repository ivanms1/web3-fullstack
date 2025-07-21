import { getDeploymentInfo } from "@/utils/getDeploymentInfo";

const deploymentInfo = getDeploymentInfo();

// Contract ABIs and addresses
export const CONTRACT_ADDRESSES = deploymentInfo.contracts;

// Financial Platform ABI
export const FINANCIAL_PLATFORM_ABI = deploymentInfo.abis.FinancialPlatform;

// Mock Token ABI
export const MOCK_TOKEN_ABI = deploymentInfo.abis.MockToken;

export type ContractAddresses = typeof CONTRACT_ADDRESSES;
export type FinancialPlatformABI = typeof FINANCIAL_PLATFORM_ABI;
export type MockTokenABI = typeof MOCK_TOKEN_ABI;
