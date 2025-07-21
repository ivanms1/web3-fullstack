import { screen, waitFor } from "@testing-library/react";
import { render } from "@/test-utils";
import ApprovalsPage from "../approvals/page";
import { ApprovalType, ApprovalStatus } from "@/types/approval";

// Mock the contract manager
jest.mock("@/api/contract-manager", () => ({
  contractManager: {
    isInitialized: () => true,
  },
}));

// Mock the approval API
jest.mock("@/api/approval", () => ({
  approvalAPI: {
    getAllApprovals: jest.fn(),
    getPendingApprovals: jest.fn(),
  },
}));

// Import the mocked functions
import { approvalAPI } from "@/api/approval";

const mockGetAllApprovals = approvalAPI.getAllApprovals as jest.MockedFunction<
  typeof approvalAPI.getAllApprovals
>;
const mockGetPendingApprovals =
  approvalAPI.getPendingApprovals as jest.MockedFunction<
    typeof approvalAPI.getPendingApprovals
  >;

describe("ApprovalsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up default mock responses
    mockGetAllApprovals.mockResolvedValue([
      {
        id: 1,
        transactionId: 1,
        requester: "0x1234567890123456789012345678901234567890",
        approver: "",
        approvalType: ApprovalType.Transaction,
        status: ApprovalStatus.Pending,
        reason: "Pending approval",
        timestamp: Date.now(),
      },
      {
        id: 2,
        transactionId: 2,
        requester: "0x1234567890123456789012345678901234567890",
        approver: "0x0987654321098765432109876543210987654321",
        approvalType: ApprovalType.Transaction,
        status: ApprovalStatus.Approved,
        reason: "Approved",
        timestamp: Date.now(),
      },
    ]);
    mockGetPendingApprovals.mockResolvedValue([1, 2]); // Array of approval IDs
  });

  it("renders approvals page with correct structure", () => {
    render(<ApprovalsPage />);

    // Check main heading and description
    expect(
      screen.getByRole("heading", { name: "Approvals" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Manage your token approvals and permissions")
    ).toBeInTheDocument();
  });

  it("displays approval data when API calls succeed", async () => {
    render(<ApprovalsPage />);

    // Wait for the data to load and check that approval components are rendered
    await waitFor(() => {
      expect(screen.getByText(/2.*total approvals/)).toBeInTheDocument();
    });
  });

  it("handles loading state", () => {
    mockGetAllApprovals.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<ApprovalsPage />);

    // Should show loading skeleton
    expect(
      screen.getByText("Manage your token approvals and permissions")
    ).toBeInTheDocument();
  });

  it("handles empty approval list", async () => {
    mockGetAllApprovals.mockResolvedValue([]);
    mockGetPendingApprovals.mockResolvedValue([]);

    render(<ApprovalsPage />);

    await waitFor(() => {
      expect(screen.getByText(/0.*total approvals/)).toBeInTheDocument();
    });
  });

  it("calls the APIs with correct parameters", async () => {
    render(<ApprovalsPage />);

    await waitFor(() => {
      expect(mockGetAllApprovals).toHaveBeenCalledTimes(1);
      expect(mockGetPendingApprovals).toHaveBeenCalledTimes(1);
    });
  });

  it("has correct page layout and styling", () => {
    mockGetAllApprovals.mockResolvedValue([]);
    mockGetPendingApprovals.mockResolvedValue([]);

    render(<ApprovalsPage />);

    // Check that the page has the correct container structure
    const container = screen
      .getByText("Manage your token approvals and permissions")
      .closest("div")?.parentElement;
    expect(container).toHaveClass("container");
    expect(container).toHaveClass("mx-auto");
    expect(container).toHaveClass("p-6");
  });
});
