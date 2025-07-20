/**
 * Truncates a wallet address to a shorter format for display purposes.
 *
 * Takes a full wallet address (e.g., "0x1234567890abcdef1234567890abcdef12345678")
 * and returns a truncated version showing only the first 6 and last 4 characters
 * separated by "..." (e.g., "0x1234...5678").
 *
 * @param address - The full wallet address to truncate
 * @returns The truncated wallet address string
 *
 * @example
 * ```typescript
 * truncateWalletAddress("0x1234567890abcdef1234567890abcdef12345678")
 * // Returns: "0x1234...5678"
 * ```
 */
export const truncateWalletAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
