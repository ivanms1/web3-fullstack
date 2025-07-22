# Web3 Fullstack Platform

A comprehensive decentralized financial platform built with Next.js, Solidity smart contracts, and modern web3 technologies. This monorepo includes a financial transaction management system with role-based access control, approval workflows, and a modern React dashboard.

## 🏗️ Architecture

This is a [Turborepo](https://turborepo.com/) monorepo containing:

### Apps

- **`apps/dashboard`**: Next.js web application with React dashboard
- **`apps/contracts`**: Solidity smart contracts with Hardhat development environment

### Packages

- **`packages/ui`**: Shared React component library
- **`packages/eslint-config`**: ESLint configurations
- **`packages/typescript-config`**: TypeScript configurations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Yarn package manager
- **MetaMask wallet extension** (required for frontend app)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd web3-fullstack

# Install dependencies
yarn install
```

### Local Development Setup

**⚠️ Important**: MetaMask is required to run the frontend application. Follow these steps for local development:

#### 1. Start Local Hardhat Node

```bash
cd apps/contracts
yarn dev
```

This starts a local Hardhat node at `http://localhost:8545`

#### 2. Deploy Contracts Locally

In a new terminal:

```bash
cd apps/contracts
yarn deploy:localhost
```

This deploys the smart contracts to your local network and creates test data.

#### 3. Set Up Frontend Environment Variables

After deployment, you need to manually move the deployment file and convert it to environment variables:

```bash
# Copy the deployment file to the dashboard scripts folder
cp apps/contracts/deployment-info-local.json apps/dashboard/scripts/

# Convert deployment JSON to environment variables
cd apps/dashboard
yarn convert-deployment
```

This creates a `.env.local` file with the contract addresses and ABIs that the frontend needs.

#### 4. Configure MetaMask for Local Development

**Add Local Network to MetaMask:**

- Open MetaMask
- Go to Settings → Networks → Add Network
- Add network manually with these settings:
  - **Network Name**: Hardhat Local
  - **RPC URL**: `http://localhost:8545`
  - **Chain ID**: `31337`
  - **Currency Symbol**: ETH

**Import Admin Account:**

- Copy the admin private key from the deployment output (starts with `0x`)
- In MetaMask, go to Account → Import Account
- Paste the private key to import the admin account

#### 5. Connect MetaMask to Local Network

- Switch to the "Hardhat Local" network in MetaMask
- Ensure you're using the imported admin account

#### 6. Start the Frontend Application

```bash
cd apps/dashboard
yarn dev
```

This starts the dashboard at `http://localhost:3000`

#### 7. Connect MetaMask to the App

- Open `http://localhost:3000` in your browser
- Click "Connect Wallet" in the app
- Approve the MetaMask connection request

**🎉 You're now ready to develop locally!**

### Production/Testnet Setup

For production or testnet development, you can skip steps 1-3 and use existing deployed contracts:

```bash
# Start only the frontend
cd apps/dashboard
yarn dev
```

This will start:

- Dashboard app at `http://localhost:3000`

## 📋 Project Structure

```
web3-fullstack/
├── apps/
│   ├── contracts/          # Solidity smart contracts
│   │   ├── contracts/      # Smart contract source files
│   │   ├── scripts/        # Deployment and setup scripts
│   │   ├── test/           # Contract tests
│   │   └── hardhat.config.js
│   └── dashboard/          # Next.js web application
│       ├── src/
│       │   ├── app/        # Next.js app router pages
│       │   ├── components/ # React components
│       │   ├── lib/        # Utilities and configurations
│       │   ├── services/   # API services
│       │   └── utils/      # Helper functions
│       └── scripts/        # Dashboard utility scripts
├── packages/
│   ├── ui/                 # Shared UI components
│   ├── eslint-config/      # ESLint configurations
│   └── typescript-config/  # TypeScript configurations
└── README.md
```

## 🔧 Smart Contracts

### Overview

The platform consists of two main smart contracts:

- **`FinancialPlatform.sol`**: Main contract managing users, transactions, and approvals
- **`MockToken.sol`**: ERC20 token for testing financial transactions

### Features

- **Role-based Access Control**: Regular users, Managers, and Admins
- **Transaction Workflow**: Create → Request Approval → Process → Complete
- **User Management**: Registration and role assignment
- **Approval System**: Multi-level approval with reason tracking
- **Event Logging**: Comprehensive event system for audit trails

### Contract Functions

#### User Management

```solidity
registerUser(address walletAddress, string name, string email, UserRole role)
updateUserRole(address userAddress, UserRole newRole)
getUser(address userAddress)
```

#### Transaction Management

```solidity
createTransaction(address to, uint256 amount, string description)
requestApproval(uint256 transactionId, string reason)
completeTransaction(uint256 transactionId)
getTransaction(uint256 transactionId)
```

#### Approval System

```solidity
processApproval(uint256 approvalId, bool approved, string reason)
getApproval(uint256 approvalId)
getPendingApprovals()
```

## 🛠️ Development Scripts

### Contract Development

```bash
# Navigate to contracts directory
cd apps/contracts

# Compile contracts
yarn compile

# Run tests
yarn test

# Start local Hardhat node
yarn dev

# Deploy contracts locally
yarn deploy:localhost

# Deploy to Sepolia testnet
yarn deploy:sepolia

# Deploy to Holesky testnet
yarn deploy:holesky
```

### Dashboard Development

```bash
# Navigate to dashboard directory
cd apps/dashboard

# Start development server
yarn dev

# Run tests
yarn test

# Build for production
yarn build

# Start production server
yarn start
```

### Environment Configuration

The dashboard uses environment variables for contract configuration. To set up:

1. **Place deployment JSON file** in `apps/dashboard/scripts/` directory
2. **Run conversion script**:
   ```bash
   cd apps/dashboard
   yarn convert-deployment
   ```
3. **Restart development server**

The script will:

- Find `deployment-info*.json` files in the scripts directory
- Convert them to environment variables in `.env.local`
- Make contract addresses and ABIs available to the frontend

### Available Scripts

#### Contract Scripts (`apps/contracts/`)

- `yarn compile` - Compile smart contracts
- `yarn test` - Run contract tests
- `yarn dev` - Start local Hardhat node
- `yarn deploy:localhost` - Deploy to local network
- `yarn deploy:sepolia` - Deploy to Sepolia testnet
- `yarn deploy:holesky` - Deploy to Holesky testnet

#### Dashboard Scripts (`apps/dashboard/`)

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn test` - Run tests
- `yarn test:watch` - Run tests in watch mode
- `yarn test:coverage` - Run tests with coverage
- `yarn convert-deployment` - Convert deployment JSON to environment variables

## 🔐 Security Features

### Smart Contract Security

- **Access Control**: OpenZeppelin's AccessControl for role management
- **Reentrancy Protection**: ReentrancyGuard to prevent reentrancy attacks
- **Input Validation**: Comprehensive require statements and modifiers
- **Event Logging**: All state changes are logged for audit trails

### Frontend Security

- **Environment Variables**: Contract addresses and ABIs stored in environment variables
- **Runtime Parsing**: JSON parsed at runtime with error handling
- **Type Safety**: Full TypeScript support with strict type checking
- **Error Boundaries**: Comprehensive error handling throughout the app

## 🌐 Network Configuration

### Supported Networks

- **Localhost**: Development and testing (Chain ID: 31337)
- **Sepolia**: Ethereum testnet (Chain ID: 11155111)
- **Holesky**: Ethereum testnet (Chain ID: 17000)

### Environment Variables

Create a `.env` file in `apps/contracts/` with:

```env
PRIVATE_KEY=your_wallet_private_key
SEPOLIA_RPC_URL=your_sepolia_rpc_endpoint
HOLESKY_RPC_URL=your_holesky_rpc_endpoint
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## 🧪 Testing

### Contract Testing

```bash
cd apps/contracts
yarn test
```

Tests cover:

- User registration and role assignment
- Transaction creation and approval workflow
- Access control validation
- Error handling for invalid operations
- Event emission verification

### Frontend Testing

```bash
cd apps/dashboard
yarn test
```

Tests cover:

- Component rendering
- User interactions
- API integrations
- Error handling

## 🚀 Deployment

### Smart Contracts

1. **Set environment variables** in `apps/contracts/.env`
2. **Deploy to target network**:
   ```bash
   cd apps/contracts
   yarn deploy:sepolia  # or deploy:holesky
   ```
3. **Verify contracts** on Etherscan (automatic with deployment)

### Dashboard

1. **Convert deployment info** to environment variables
2. **Build the application**:
   ```bash
   cd apps/dashboard
   yarn build
   ```
3. **Deploy to your hosting platform** (Vercel, Netlify, etc.)

## 📚 API Reference

### Contract Manager

The dashboard uses a `ContractManager` class to interact with smart contracts:

```typescript
import { contractManager } from '@/api/contract-manager';

// Get contract instances
const financialPlatform = contractManager.getFinancialPlatform();
const mockToken = contractManager.getMockToken();

// Interact with contracts
await financialPlatform.createTransaction(to, amount, description);
```

### Environment Variables

The app uses this environment variable:

- `NEXT_PUBLIC_DEPLOYMENT_INFO`: JSON string with contract addresses, ABIs, and network information

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Use conventional commit messages
- Update documentation for new features

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/ivanms1/web3-fullstack/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## 🔗 Useful Links

- [Turborepo Documentation](https://turborepo.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Ethers.js Documentation](https://docs.ethers.org/)
