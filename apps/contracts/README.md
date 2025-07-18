# Financial Platform Smart Contracts

A decentralized financial platform built on Ethereum that manages transactions, approvals, and user roles with a comprehensive workflow system.

## Business Logic Overview

### Core Features

**User Management System:**
- **Role-based Access Control**: Three user roles (Regular, Manager, Admin)
- **User Registration**: Admin-only user registration with email and role assignment
- **Role Updates**: Dynamic role management with automatic permission updates

**Transaction Workflow:**
1. **Transaction Creation**: Registered users can create transactions with recipient, amount, and description
2. **Approval Process**: Transactions require approval from Managers/Admins before execution
3. **Status Tracking**: Transactions progress through states: Pending → Active → Completed/Rejected
4. **Completion**: Only approved transactions can be marked as completed

**Approval System:**
- **Multi-level Approval**: Managers and Admins can approve/reject transactions
- **Reason Tracking**: All approvals include reasons for audit trails
- **Status Management**: Approvals can be Pending, Approved, or Rejected

### Smart Contracts

**FinancialPlatform.sol:**
- Main contract managing users, transactions, and approvals
- Uses OpenZeppelin's AccessControl for role management
- Implements ReentrancyGuard for security
- Comprehensive event system for tracking all activities

**MockToken.sol:**
- ERC20 token for testing financial transactions
- Includes mint/burn functionality for testing purposes
- Ownable pattern for administrative functions

## Testing

### Prerequisites
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Test Coverage
The test suite covers:
- **User Management**: Registration, role updates, access control
- **Transaction Workflow**: Creation, approval requests, processing, completion
- **Security**: Unauthorized access prevention, input validation
- **Edge Cases**: Duplicate registrations, invalid transactions, role permissions

### Key Test Scenarios
- User registration and role assignment
- Transaction creation and approval workflow
- Access control validation
- Error handling for invalid operations
- Event emission verification

## Deployment

### Local Development
```bash
# Start local Hardhat node
npx hardhat node

# Deploy contracts locally
npx hardhat run scripts/deploy.js --network localhost
```

### Testnet Deployment (Holesky)
```bash
# Set environment variables
export PRIVATE_KEY="your_private_key"
export HOLESKY_RPC_URL="your_rpc_url"
export ETHERSCAN_API_KEY="your_etherscan_api_key"

# Deploy to Holesky testnet
npm run deploy:holesky
```

### Environment Variables
Create a `.env` file with:
```env
PRIVATE_KEY=your_wallet_private_key
HOLESKY_RPC_URL=your_holesky_rpc_endpoint
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Deployment Script Features
The deployment script automatically:
- Deploys both FinancialPlatform and MockToken contracts
- Registers test users with different roles
- Mints test tokens to users
- Creates sample transactions and approvals
- Saves deployment information to `deployment-info.json`

## Contract Functions

### User Management
- `registerUser(address, string, string, UserRole)` - Register new user (Admin only)
- `updateUserRole(address, UserRole)` - Update user role (Admin only)
- `getUser(address)` - Get user information

### Transaction Management
- `createTransaction(address, uint256, string)` - Create new transaction
- `requestApproval(uint256, string)` - Request approval for transaction
- `completeTransaction(uint256)` - Complete approved transaction
- `getTransaction(uint256)` - Get transaction details

### Approval System
- `processApproval(uint256, bool, string)` - Process approval (Manager/Admin only)
- `getApproval(uint256)` - Get approval details
- `getPendingApprovals()` - Get all pending approvals

### Utility Functions
- `getUserTransactions(address)` - Get all transactions for a user
- `getTransactionCount()` - Get total transaction count
- `getApprovalCount()` - Get total approval count
- `getUserCount()` - Get total user count

## Network Configuration

The project supports:
- **Localhost**: For development and testing
- **Holesky Testnet**: For testnet deployment and verification