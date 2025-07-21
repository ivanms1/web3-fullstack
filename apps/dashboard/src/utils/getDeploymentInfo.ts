/**
 * Parses deployment information from environment variables at runtime.
 *
 * This function reads the `NEXT_PUBLIC_DEPLOYMENT_INFO` environment variable,
 * which contains a JSON string with contract addresses, ABIs, and network information.
 * The JSON is parsed at runtime using `JSON.parse()`.
 *
 * @returns {Object} The parsed deployment information object containing:
 *   - `network`: The blockchain network name (e.g., "sepolia", "localhost")
 *   - `contracts`: Object with contract addresses
 *     - `FinancialPlatform`: Address of the FinancialPlatform contract
 *     - `MockToken`: Address of the MockToken contract
 *   - `abis`: Object with contract ABIs
 *     - `FinancialPlatform`: ABI array for the FinancialPlatform contract
 *     - `MockToken`: ABI array for the MockToken contract
 *   - `deployer`: Address of the contract deployer (optional)
 *   - `testAccounts`: Object with test account addresses (optional, localhost only)
 *
 * @throws {Error} When `NEXT_PUBLIC_DEPLOYMENT_INFO` environment variable is not set
 * @throws {Error} When the environment variable contains invalid JSON
 *
 * @example
 * ```typescript
 * const deploymentInfo = getDeploymentInfo();
 * console.log(deploymentInfo.contracts.FinancialPlatform);
 * // Output: "0xBDeba51a3497745075c45AACeDc7af2c55ea2A79"
 *
 * console.log(deploymentInfo.abis.FinancialPlatform);
 * // Output: [{"type":"constructor",...}, ...]
 * ```
 *
 * @example
 * ```typescript
 * try {
 *   const info = getDeploymentInfo();
 *   // Use deployment info
 * } catch (error) {
 *   console.error('Failed to load deployment info:', error.message);
 * }
 * ```
 */
export const getDeploymentInfo = () => {
  // For client-side, use NEXT_PUBLIC_ prefix
  const deploymentInfoString = process.env.NEXT_PUBLIC_DEPLOYMENT_INFO;

  if (!deploymentInfoString) {
    throw new Error(
      "NEXT_PUBLIC_DEPLOYMENT_INFO environment variable is required"
    );
  }

  try {
    return JSON.parse(deploymentInfoString);
  } catch {
    throw new Error(
      "Invalid JSON in NEXT_PUBLIC_DEPLOYMENT_INFO environment variable"
    );
  }
};
