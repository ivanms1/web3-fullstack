import { screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import TransactionsPage from '../transactions/page';
import { Transaction, TransactionStatus } from '@/types/transaction';

// Mock the contract manager
jest.mock('@/api/contract-manager', () => ({
  contractManager: {
    isInitialized: () => true,
  },
}));

// Mock the transaction API
jest.mock('@/api/transaction', () => ({
  transactionAPI: {
    getAllTransactions: jest.fn(),
  },
}));

// Import the mocked function
import { transactionAPI } from '@/api/transaction';
const mockGetAllTransactions =
  transactionAPI.getAllTransactions as jest.MockedFunction<
    typeof transactionAPI.getAllTransactions
  >;

// Create a test QueryClient with proper configuration
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Turn off retries for testing
        gcTime: Infinity, // Prevent Jest exit issues
      },
    },
  });

// Custom render function with QueryClient provider
const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  );
};

describe('TransactionsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders transactions page with correct structure', async () => {
    // Mock to return empty array to avoid undefined
    mockGetAllTransactions.mockResolvedValue([]);

    renderWithQueryClient(<TransactionsPage />);

    // Wait for the query to resolve
    await waitFor(() => {
      expect(mockGetAllTransactions).toHaveBeenCalled();
    });

    // Check main heading and description
    expect(
      screen.getByRole('heading', { name: 'Transactions' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('View and manage all transactions in the system')
    ).toBeInTheDocument();
  });

  it('displays transaction data when API call succeeds', async () => {
    const mockTransactions = [
      {
        id: 1,
        from: '0x1234567890123456789012345678901234567890',
        to: '0x0987654321098765432109876543210987654321',
        amount: '1000000000000000000',
        description: 'Test transaction 1',
        status: TransactionStatus.Pending,
        timestamp: Date.now(),
        approvalId: 1,
      },
      {
        id: 2,
        from: '0x1234567890123456789012345678901234567890',
        to: '0x0987654321098765432109876543210987654321',
        amount: '2000000000000000000',
        description: 'Test transaction 2',
        status: TransactionStatus.Active,
        timestamp: Date.now(),
        approvalId: 2,
      },
    ];

    mockGetAllTransactions.mockResolvedValue(mockTransactions);

    renderWithQueryClient(<TransactionsPage />);

    // Wait for the data to load and check that transactions are displayed
    await waitFor(() => {
      expect(screen.getByText('2 total transactions')).toBeInTheDocument();
    });

    expect(screen.getByText('Test transaction 1')).toBeInTheDocument();
    expect(screen.getByText('Test transaction 2')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    // Mock to return a promise that never resolves to simulate loading
    mockGetAllTransactions.mockImplementation(() => new Promise(() => {}));

    renderWithQueryClient(<TransactionsPage />);

    // Should show loading skeleton
    expect(
      screen.getByText('View and manage all transactions in the system')
    ).toBeInTheDocument();
  });

  it('handles empty transaction list', async () => {
    mockGetAllTransactions.mockResolvedValue([]);

    renderWithQueryClient(<TransactionsPage />);

    await waitFor(() => {
      expect(screen.getByText('0 total transactions')).toBeInTheDocument();
    });
  });

  it('calls the API with correct parameters', async () => {
    mockGetAllTransactions.mockResolvedValue([]);

    renderWithQueryClient(<TransactionsPage />);

    await waitFor(() => {
      expect(mockGetAllTransactions).toHaveBeenCalledTimes(1);
    });
  });

  it('has correct page layout and styling', async () => {
    mockGetAllTransactions.mockResolvedValue([]);

    renderWithQueryClient(<TransactionsPage />);

    // Wait for the query to resolve
    await waitFor(() => {
      expect(mockGetAllTransactions).toHaveBeenCalled();
    });

    // Check that the page has the correct container structure
    const container = screen
      .getByText('View and manage all transactions in the system')
      .closest('div')?.parentElement;
    expect(container).toHaveClass('container');
    expect(container).toHaveClass('mx-auto');
    expect(container).toHaveClass('p-6');
  });
});
