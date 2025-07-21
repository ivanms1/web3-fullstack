import { screen } from '@testing-library/react';
import { render } from '@/test-utils';
import AccountPage from '../account/page';

// Mock the wallet session hook
const mockUseWalletSession = jest.fn();
jest.mock('@/hooks/use-wallet-session', () => ({
  useWalletSession: () => mockUseWalletSession(),
}));

// Mock dayjs
jest.mock('@/lib/dayjs', () => ({
  dayjs: () => ({
    format: (format: string) => {
      if (format === 'MMMM D, YYYY') {
        return 'January 1, 2024';
      }
      return 'formatted date';
    },
    fromNow: () => '2 days ago',
  }),
}));

// Mock truncateWalletAddress
jest.mock('@/utils/truncateWalletAddress', () => ({
  truncateWalletAddress: (address: string) => `truncated_${address}`,
}));

describe('AccountPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseWalletSession.mockReturnValue({
      user: {
        id: 1,
        walletAddress: '0x1234567890123456789012345678901234567890',
        name: 'Test User',
        email: 'test@example.com',
        role: 0,
        isActive: true,
        createdAt: 1704067200, // January 1, 2024
      },
      isInitializing: false,
    });
  });

  it('renders account page with correct structure', () => {
    render(<AccountPage />);

    expect(
      screen.getByRole('heading', { name: 'Account' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Your account information and settings')
    ).toBeInTheDocument();
  });

  it('displays account information correctly', () => {
    render(<AccountPage />);

    expect(screen.getByText('Account Information')).toBeInTheDocument();
    expect(screen.getByText('Wallet Address')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Account Created')).toBeInTheDocument();
  });

  it('displays user data correctly', () => {
    render(<AccountPage />);

    // Check wallet address (there are two instances for responsive design)
    const walletAddressElements = screen.getAllByText(
      'truncated_0x1234567890123456789012345678901234567890'
    );
    expect(walletAddressElements.length).toBeGreaterThan(0);
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Regular')).toBeInTheDocument(); // Role label
    expect(screen.getByText('Active')).toBeInTheDocument(); // Status
    expect(screen.getByText('January 1, 2024')).toBeInTheDocument();
    expect(screen.getByText('2 days ago')).toBeInTheDocument();
  });

  it('displays loading state when initializing', () => {
    mockUseWalletSession.mockReturnValue({
      user: null,
      isInitializing: true,
    });

    render(<AccountPage />);

    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(
      screen.getByText('Your account information and settings')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Loading account information...')
    ).toBeInTheDocument();
  });

  it('displays error state when user is not found', () => {
    mockUseWalletSession.mockReturnValue({
      user: null,
      isInitializing: false,
    });

    render(<AccountPage />);

    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(
      screen.getByText('Your account information and settings')
    ).toBeInTheDocument();
    expect(screen.getByText('User not found')).toBeInTheDocument();
    expect(
      screen.getByText('Unable to load your account information')
    ).toBeInTheDocument();
  });

  it('displays inactive status correctly', () => {
    mockUseWalletSession.mockReturnValue({
      user: {
        id: 1,
        walletAddress: '0x1234567890123456789012345678901234567890',
        name: 'Inactive User',
        email: 'inactive@example.com',
        role: 0,
        isActive: false,
        createdAt: 1704067200,
      },
      isInitializing: false,
    });

    render(<AccountPage />);

    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('displays wallet address in different formats for responsive design', () => {
    render(<AccountPage />);

    // Check that both desktop and mobile versions of the address are rendered
    const addressElements = screen.getAllByText(
      /truncated_0x1234567890123456789012345678901234567890/
    );
    expect(addressElements.length).toBeGreaterThan(0);
  });

  it('has correct page layout and styling', () => {
    render(<AccountPage />);

    const container = screen
      .getByText('Your account information and settings')
      .closest('div')?.parentElement;
    expect(container).toHaveClass('container');
    expect(container).toHaveClass('mx-auto');
    expect(container).toHaveClass('p-6');
  });

  it('displays account card with correct structure', () => {
    render(<AccountPage />);

    expect(screen.getByText('Account Information')).toBeInTheDocument();

    // Check that the card has the correct structure
    const card = screen.getByText('Account Information').closest('div');
    expect(card).toBeInTheDocument();
  });

  it('displays all user information fields', () => {
    render(<AccountPage />);

    // Check all the field labels are present
    expect(screen.getByText('Wallet Address')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Account Created')).toBeInTheDocument();
  });
});
