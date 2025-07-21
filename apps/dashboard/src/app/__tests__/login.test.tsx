import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/test-utils";
import LoginPage from "../login/page";

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the wallet session hook
const mockUseWalletSession = jest.fn();
jest.mock("@/hooks/use-wallet-session", () => ({
  useWalletSession: () => mockUseWalletSession(),
}));

// Mock the wallet service
const mockConnectWallet = jest.fn();
jest.mock("@/services/wallet", () => ({
  useConnectWallet: () => ({
    mutate: mockConnectWallet,
    error: null,
    isPending: false,
  }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseWalletSession.mockReturnValue({
      currentAccount: null,
      user: null,
      isInitializing: false,
    });
  });

  it("renders login page with correct content", () => {
    render(<LoginPage />);

    expect(
      screen.getByText("Welcome to the Web3 Dashboard")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Connect your wallet to access your dashboard")
    ).toBeInTheDocument();
    expect(screen.getByText("Connect with MetaMask")).toBeInTheDocument();
    expect(
      screen.getByText(
        "By connecting your wallet, you agree to our Terms of Service and Privacy Policy"
      )
    ).toBeInTheDocument();
  });

  it("shows loading state when wallet is initializing", () => {
    mockUseWalletSession.mockReturnValue({
      currentAccount: null,
      user: null,
      isInitializing: true,
    });

    render(<LoginPage />);

    expect(screen.getByText("Checking wallet...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows warning when user is not registered", () => {
    mockUseWalletSession.mockReturnValue({
      currentAccount: "0x1234567890123456789012345678901234567890",
      user: {
        id: 0,
        walletAddress: "0x1234567890123456789012345678901234567890",
      },
      isInitializing: false,
    });

    render(<LoginPage />);

    expect(
      screen.getByText("Please contact an admin to register your account")
    ).toBeInTheDocument();
  });

  it("redirects to dashboard when user is already connected and registered", () => {
    mockUseWalletSession.mockReturnValue({
      currentAccount: "0x1234567890123456789012345678901234567890",
      user: {
        id: 1,
        walletAddress: "0x1234567890123456789012345678901234567890",
        name: "Test User",
        role: 0,
        isActive: true,
      },
      isInitializing: false,
    });

    render(<LoginPage />);

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("handles wallet connection when connect button is clicked", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const connectButton = screen.getByRole("button");
    await user.click(connectButton);

    expect(mockConnectWallet).toHaveBeenCalledWith(undefined, {
      onSuccess: expect.any(Function),
    });
  });

  it("redirects to dashboard on successful wallet connection", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const connectButton = screen.getByRole("button");
    await user.click(connectButton);

    // Simulate successful connection
    const onSuccessCallback = mockConnectWallet.mock.calls[0][1].onSuccess;
    onSuccessCallback();

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("disables connect button when user is not registered", () => {
    mockUseWalletSession.mockReturnValue({
      currentAccount: "0x1234567890123456789012345678901234567890",
      user: {
        id: 0,
        walletAddress: "0x1234567890123456789012345678901234567890",
      },
      isInitializing: false,
    });

    render(<LoginPage />);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("disables connect button when wallet is initializing", () => {
    mockUseWalletSession.mockReturnValue({
      currentAccount: null,
      user: null,
      isInitializing: true,
    });

    render(<LoginPage />);

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
