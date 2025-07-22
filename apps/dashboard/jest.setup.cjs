/* eslint-env jest, browser */

require('@testing-library/jest-dom');

// Mock environment variables
process.env.NEXT_PUBLIC_DEPLOYMENT_INFO = JSON.stringify({
  network: 'localhost',
  contracts: {
    FinancialPlatform: '0x1234567890123456789012345678901234567890',
    MockToken: '0x0987654321098765432109876543210987654321',
  },
  abis: {
    FinancialPlatform: [],
    MockToken: [],
  },
});

// Mock window.matchMedia for next-themes
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock window.ethereum for wallet testing
Object.defineProperty(window, 'ethereum', {
  value: {
    isMetaMask: true,
    request: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
  },
  writable: true,
});

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    info: jest.fn(),
    error: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
  },
}));

// Mock ethers
jest.mock('ethers', () => ({
  ethers: {
    parseEther: jest.fn((value) => value),
    formatEther: jest.fn((value) => value.toString()),
  },
}));
