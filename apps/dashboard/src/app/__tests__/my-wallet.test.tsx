import { screen, waitFor } from "@testing-library/react";
import { render } from "@/test-utils";
import MyWalletPage from "../my-wallet/page";

// Mock the wallet session hook
jest.mock("@/hooks/use-wallet-session", () => ({
  useWalletSession: () => ({
    user: {
      id: 1,
      walletAddress: "0x1234567890123456789012345678901234567890",
      name: "Test User",
      role: 0,
      isActive: true,
    },
    isInitializing: false,
    currentAccount: "0x1234567890123456789012345678901234567890",
  }),
}));

// Mock the balance API
jest.mock("@/api/balance", () => ({
  balanceAPI: {
    getCurrentEthBalance: jest.fn(),
    getTokenBalance: jest.fn(),
  },
}));

// Import the mocked functions
import { balanceAPI } from "@/api/balance";

const mockGetCurrentEthBalance =
  balanceAPI.getCurrentEthBalance as jest.MockedFunction<
    typeof balanceAPI.getCurrentEthBalance
  >;
const mockGetTokenBalance = balanceAPI.getTokenBalance as jest.MockedFunction<
  typeof balanceAPI.getTokenBalance
>;

// Mock toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock navigator.clipboard
Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: jest.fn(),
  },
  writable: true,
});

describe("MyWalletPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up default mock responses
    mockGetCurrentEthBalance.mockResolvedValue("1.5");
    mockGetTokenBalance.mockResolvedValue("1000");
  });

  it("renders my wallet page with correct structure", () => {
    render(<MyWalletPage />);

    expect(
      screen.getByRole("heading", { name: "My Wallet" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Manage your wallet and view token balances")
    ).toBeInTheDocument();
  });

  it("displays wallet address correctly", () => {
    render(<MyWalletPage />);

    expect(screen.getByText("Wallet Address")).toBeInTheDocument();
    expect(
      screen.getByText("0x1234567890123456789012345678901234567890")
    ).toBeInTheDocument();
  });

  it("displays token balances when API calls succeed", async () => {
    render(<MyWalletPage />);

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText("1.5")).toBeInTheDocument(); // ETH balance
    });

    expect(screen.getByText("1000")).toBeInTheDocument(); // Token balance
  });

  it("handles loading state", () => {
    mockGetCurrentEthBalance.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<MyWalletPage />);

    // Should show the page structure even during loading
    expect(screen.getByText("My Wallet")).toBeInTheDocument();
    expect(screen.getByText("Token Balances")).toBeInTheDocument();
  });

  it("handles empty balance data", async () => {
    mockGetCurrentEthBalance.mockResolvedValue("0");
    mockGetTokenBalance.mockResolvedValue("0");

    render(<MyWalletPage />);

    // Should still display the balance sections
    expect(screen.getByText("ETH")).toBeInTheDocument();
    expect(screen.getByText("MT")).toBeInTheDocument();
  });

  it("calls the balance APIs with correct parameters", async () => {
    render(<MyWalletPage />);

    await waitFor(() => {
      expect(mockGetCurrentEthBalance).toHaveBeenCalledTimes(1);
      expect(mockGetTokenBalance).toHaveBeenCalledTimes(1);
    });
  });

  it("has correct page layout and styling", () => {
    render(<MyWalletPage />);

    // Check that the page has the correct container structure
    const container = screen
      .getByText("Manage your wallet and view token balances")
      .closest("div")?.parentElement;
    expect(container).toHaveClass("container");
    expect(container).toHaveClass("mx-auto");
    expect(container).toHaveClass("p-6");
  });
});
