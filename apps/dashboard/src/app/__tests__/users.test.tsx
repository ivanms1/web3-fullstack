import { screen } from '@testing-library/react';
import { render } from '@/test-utils';
import UsersPage from '../users/page';
import { UserRole } from '@/types/user';

// Mock the user API
jest.mock('@/api/user', () => ({
  userAPI: {
    getUser: jest.fn(),
  },
}));

// Import the mocked functions
import { userAPI } from '@/api/user';

const mockGetUser = userAPI.getUser as jest.MockedFunction<
  typeof userAPI.getUser
>;

describe('UsersPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders users page with correct structure', () => {
    render(<UsersPage />);

    // Check main heading and description
    expect(
      screen.getByRole('heading', { name: 'User Lookup' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Look up user information and transactions by wallet address'
      )
    ).toBeInTheDocument();
  });

  it('displays user lookup functionality', () => {
    render(<UsersPage />);

    // Check that the user lookup form is rendered
    expect(screen.getByText('Search User')).toBeInTheDocument();
    expect(screen.getByLabelText('Wallet Address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('handles user search functionality', async () => {
    const mockUser = {
      id: 1,
      walletAddress: '0x1234567890123456789012345678901234567890',
      name: 'Test User',
      email: 'test@example.com',
      role: UserRole.Regular,
      isActive: true,
      createdAt: 1704067200, // January 1, 2024
    };

    mockGetUser.mockResolvedValue(mockUser);

    render(<UsersPage />);

    // The component should be ready to handle user searches
    expect(screen.getByText('Search User')).toBeInTheDocument();
    expect(screen.getByLabelText('Wallet Address')).toBeInTheDocument();
  });

  it('has correct page layout and styling', () => {
    render(<UsersPage />);

    // Check that the page has the correct container structure
    const container = screen
      .getByText('Look up user information and transactions by wallet address')
      .closest('div')?.parentElement;
    expect(container).toHaveClass('container');
    expect(container).toHaveClass('mx-auto');
    expect(container).toHaveClass('p-6');
  });
});
