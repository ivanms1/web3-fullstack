// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title FinancialPlatform
 * @dev Main contract for managing financial transactions, approvals, and users
 */
contract FinancialPlatform is AccessControl, ReentrancyGuard {
    // Role definitions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant APPROVER_ROLE = keccak256("APPROVER_ROLE");
    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");

    // Counters for unique IDs (replaced Counters library with simple uint256)
    uint256 private _transactionIds;
    uint256 private _approvalIds;
    uint256 private _userId;

    // Structs
    struct Transaction {
        uint256 id;
        address from;
        address to;
        uint256 amount;
        string description;
        TransactionStatus status;
        uint256 timestamp;
        uint256 approvalId;
    }

    struct Approval {
        uint256 id;
        uint256 transactionId;
        address requester;
        address approver;
        ApprovalType approvalType;
        ApprovalStatus status;
        string reason;
        uint256 timestamp;
    }

    struct User {
        uint256 id;
        address walletAddress;
        string name;
        string email;
        UserRole role;
        bool isActive;
        uint256 createdAt;
    }

    // Enums
    enum TransactionStatus {
        Pending,
        Active,
        Completed,
        Rejected
    }

    enum ApprovalStatus {
        Pending,
        Approved,
        Rejected
    }

    enum ApprovalType {
        Transaction,
        UserRole,
        SystemConfig
    }

    enum UserRole {
        Regular,
        Manager,
        Admin
    }

    // State variables
    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => Approval) public approvals;
    mapping(address => User) public users;
    mapping(address => bool) public registeredUsers;

    // Events
    event TransactionCreated(uint256 indexed transactionId, address indexed from, address indexed to, uint256 amount);
    event TransactionStatusUpdated(uint256 indexed transactionId, TransactionStatus status);
    event ApprovalRequested(uint256 indexed approvalId, uint256 indexed transactionId, address indexed requester);
    event ApprovalProcessed(uint256 indexed approvalId, ApprovalStatus status, address indexed approver);
    event UserRegistered(uint256 indexed userId, address indexed walletAddress, string name);
    event UserRoleUpdated(address indexed userAddress, UserRole newRole);

    // Modifiers
    modifier onlyRegisteredUser() {
        require(registeredUsers[msg.sender], "User not registered");
        _;
    }

    modifier onlyApprover() {
        require(hasRole(APPROVER_ROLE, msg.sender) || hasRole(ADMIN_ROLE, msg.sender), "Not authorized");
        _;
    }

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Admin role required");
        _;
    }

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(APPROVER_ROLE, msg.sender);
        
        // Register the deployer as the first user
        _registerUser(msg.sender, "Platform Admin", "admin@platform.com", UserRole.Admin);
    }

    /**
     * @dev Register a new user
     */
    function registerUser(
        address walletAddress,
        string memory name,
        string memory email,
        UserRole role
    ) external onlyAdmin {
        require(!registeredUsers[walletAddress], "User already registered");
        require(walletAddress != address(0), "Invalid wallet address");
        
        _registerUser(walletAddress, name, email, role);
    }

    /**
     * @dev Create a new transaction
     */
    function createTransaction(
        address to,
        uint256 amount,
        string memory description
    ) external onlyRegisteredUser nonReentrant {
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than 0");

        _transactionIds++;
        uint256 transactionId = _transactionIds;

        transactions[transactionId] = Transaction({
            id: transactionId,
            from: msg.sender,
            to: to,
            amount: amount,
            description: description,
            status: TransactionStatus.Pending,
            timestamp: block.timestamp,
            approvalId: 0
        });

        emit TransactionCreated(transactionId, msg.sender, to, amount);
    }

    /**
     * @dev Request approval for a transaction
     */
    function requestApproval(
        uint256 transactionId,
        string memory reason
    ) external onlyRegisteredUser {
        require(transactions[transactionId].id != 0, "Transaction does not exist");
        require(transactions[transactionId].from == msg.sender, "Not transaction owner");
        require(transactions[transactionId].status == TransactionStatus.Pending, "Transaction not pending");

        _approvalIds++;
        uint256 approvalId = _approvalIds;

        approvals[approvalId] = Approval({
            id: approvalId,
            transactionId: transactionId,
            requester: msg.sender,
            approver: address(0),
            approvalType: ApprovalType.Transaction,
            status: ApprovalStatus.Pending,
            reason: reason,
            timestamp: block.timestamp
        });

        // Update transaction with approval ID
        transactions[transactionId].approvalId = approvalId;

        emit ApprovalRequested(approvalId, transactionId, msg.sender);
    }

    /**
     * @dev Process an approval (approve or reject)
     */
    function processApproval(
        uint256 approvalId,
        bool approved,
        string memory reason
    ) external onlyApprover {
        require(approvals[approvalId].id != 0, "Approval does not exist");
        require(approvals[approvalId].status == ApprovalStatus.Pending, "Approval already processed");

        ApprovalStatus status = approved ? ApprovalStatus.Approved : ApprovalStatus.Rejected;
        approvals[approvalId].status = status;
        approvals[approvalId].approver = msg.sender;
        approvals[approvalId].reason = reason;

        // Update transaction status based on approval
        uint256 transactionId = approvals[approvalId].transactionId;
        if (approved) {
            transactions[transactionId].status = TransactionStatus.Active;
        } else {
            transactions[transactionId].status = TransactionStatus.Rejected;
        }

        emit ApprovalProcessed(approvalId, status, msg.sender);
        emit TransactionStatusUpdated(transactionId, transactions[transactionId].status);
    }

    /**
     * @dev Complete a transaction (only after approval)
     */
    function completeTransaction(uint256 transactionId) external onlyRegisteredUser {
        require(transactions[transactionId].id != 0, "Transaction does not exist");
        require(transactions[transactionId].from == msg.sender, "Not transaction owner");
        require(transactions[transactionId].status == TransactionStatus.Active, "Transaction not active");

        transactions[transactionId].status = TransactionStatus.Completed;
        emit TransactionStatusUpdated(transactionId, TransactionStatus.Completed);
    }

    /**
     * @dev Update user role (admin only)
     */
    function updateUserRole(address userAddress, UserRole newRole) external onlyAdmin {
        require(registeredUsers[userAddress], "User not registered");
        users[userAddress].role = newRole;
        
        // Update access control roles
        if (newRole == UserRole.Admin) {
            _grantRole(ADMIN_ROLE, userAddress);
            _grantRole(APPROVER_ROLE, userAddress);
        } else if (newRole == UserRole.Manager) {
            _grantRole(APPROVER_ROLE, userAddress);
            _revokeRole(ADMIN_ROLE, userAddress);
        } else {
            _revokeRole(ADMIN_ROLE, userAddress);
            _revokeRole(APPROVER_ROLE, userAddress);
        }

        emit UserRoleUpdated(userAddress, newRole);
    }

    /**
     * @dev Get transaction by ID
     */
    function getTransaction(uint256 transactionId) external view returns (Transaction memory) {
        return transactions[transactionId];
    }

    /**
     * @dev Get approval by ID
     */
    function getApproval(uint256 approvalId) external view returns (Approval memory) {
        return approvals[approvalId];
    }

    /**
     * @dev Get user by address
     */
    function getUser(address userAddress) external view returns (User memory) {
        return users[userAddress];
    }

    /**
     * @dev Get all transactions for a user
     */
    function getUserTransactions(address userAddress) external view returns (uint256[] memory) {
        uint256[] memory userTransactions = new uint256[](_transactionIds);
        uint256 count = 0;

        for (uint256 i = 1; i <= _transactionIds; i++) {
            if (transactions[i].from == userAddress || transactions[i].to == userAddress) {
                userTransactions[count] = i;
                count++;
            }
        }

        // Resize array to actual count
        assembly {
            mstore(userTransactions, count)
        }

        return userTransactions;
    }

    /**
     * @dev Get pending approvals
     */
    function getPendingApprovals() external view returns (uint256[] memory) {
        uint256[] memory pendingApprovals = new uint256[](_approvalIds);
        uint256 count = 0;

        for (uint256 i = 1; i <= _approvalIds; i++) {
            if (approvals[i].status == ApprovalStatus.Pending) {
                pendingApprovals[count] = i;
                count++;
            }
        }

        // Resize array to actual count
        assembly {
            mstore(pendingApprovals, count)
        }

        return pendingApprovals;
    }

    /**
     * @dev Get transaction count
     */
    function getTransactionCount() external view returns (uint256) {
        return _transactionIds;
    }

    /**
     * @dev Get approval count
     */
    function getApprovalCount() external view returns (uint256) {
        return _approvalIds;
    }

    /**
     * @dev Get user count
     */
    function getUserCount() external view returns (uint256) {
        return _userId;
    }

    // Internal functions
    function _registerUser(
        address walletAddress,
        string memory name,
        string memory email,
        UserRole role
    ) internal {
        _userId++;
        uint256 newUserId = _userId;

        users[walletAddress] = User({
            id: newUserId,
            walletAddress: walletAddress,
            name: name,
            email: email,
            role: role,
            isActive: true,
            createdAt: block.timestamp
        });

        registeredUsers[walletAddress] = true;

        // Grant appropriate roles
        if (role == UserRole.Admin) {
            _grantRole(ADMIN_ROLE, walletAddress);
            _grantRole(APPROVER_ROLE, walletAddress);
        } else if (role == UserRole.Manager) {
            _grantRole(APPROVER_ROLE, walletAddress);
        }

        emit UserRegistered(newUserId, walletAddress, name);
    }
} 