const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('FinancialPlatform', function () {
  let financialPlatform;
  let mockToken;
  let owner;
  let user1, user2, user3, approver1;
  let addrs;

  beforeEach(async function () {
    [owner, user1, user2, user3, approver1, ...addrs] =
      await ethers.getSigners();

    const FinancialPlatform =
      await ethers.getContractFactory('FinancialPlatform');
    const MockToken = await ethers.getContractFactory('MockToken');

    financialPlatform = await FinancialPlatform.deploy();
    mockToken = await MockToken.deploy('Platform Token', 'PLT', 1000000);

    // Register test users
    await financialPlatform.registerUser(
      await user1.getAddress(),
      'John Manager',
      'john.manager@company.com',
      1 // Manager
    );

    await financialPlatform.registerUser(
      await user2.getAddress(),
      'Alice User',
      'alice.user@company.com',
      0 // Regular
    );

    await financialPlatform.registerUser(
      await user3.getAddress(),
      'Bob User',
      'bob.user@company.com',
      0 // Regular
    );

    await financialPlatform.registerUser(
      await approver1.getAddress(),
      'Sarah Approver',
      'sarah.approver@company.com',
      1 // Manager
    );
  });

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      expect(
        await financialPlatform.hasRole(
          await financialPlatform.DEFAULT_ADMIN_ROLE(),
          owner.address
        )
      ).to.equal(true);
    });

    it('Should register deployer as admin user', async function () {
      const user = await financialPlatform.getUser(owner.address);
      expect(user.name).to.equal('Platform Admin');
      expect(user.role).to.equal(2); // Admin
    });
  });

  describe('User Management', function () {
    it('Should register new users correctly', async function () {
      const user = await financialPlatform.getUser(await user1.getAddress());
      expect(user.name).to.equal('John Manager');
      expect(user.email).to.equal('john.manager@company.com');
      expect(user.role).to.equal(1); // Manager
      expect(user.isActive).to.equal(true);
    });

    it('Should not allow duplicate user registration', async function () {
      await expect(
        financialPlatform.registerUser(
          await user1.getAddress(),
          'Duplicate User',
          'duplicate@company.com',
          0
        )
      ).to.be.revertedWith('User already registered');
    });

    it('Should update user roles correctly', async function () {
      await financialPlatform.updateUserRole(await user2.getAddress(), 1); // Manager
      const user = await financialPlatform.getUser(await user2.getAddress());
      expect(user.role).to.equal(1);
    });

    it('Should only allow admin to update user roles', async function () {
      await expect(
        financialPlatform
          .connect(user1)
          .updateUserRole(await user2.getAddress(), 1)
      ).to.be.revertedWith('Admin role required');
    });
  });

  describe('Transaction Management', function () {
    beforeEach(async function () {
      // Create a transaction
      await financialPlatform
        .connect(user2)
        .createTransaction(
          await user3.getAddress(),
          ethers.parseEther('1000'),
          'Test transaction'
        );
    });

    it('Should create transactions correctly', async function () {
      const transaction = await financialPlatform.getTransaction(1);
      expect(transaction.from).to.equal(await user2.getAddress());
      expect(transaction.to).to.equal(await user3.getAddress());
      expect(transaction.amount).to.equal(ethers.parseEther('1000'));
      expect(transaction.description).to.equal('Test transaction');
      expect(transaction.status).to.equal(0); // Pending
    });

    it('Should not allow non-registered users to create transactions', async function () {
      await expect(
        financialPlatform
          .connect(addrs[0])
          .createTransaction(
            await user3.getAddress(),
            ethers.parseEther('1000'),
            'Test transaction'
          )
      ).to.be.revertedWith('User not registered');
    });

    it('Should not allow zero amount transactions', async function () {
      await expect(
        financialPlatform
          .connect(user2)
          .createTransaction(await user3.getAddress(), 0, 'Test transaction')
      ).to.be.revertedWith('Amount must be greater than 0');
    });

    it('Should not allow transactions to zero address', async function () {
      await expect(
        financialPlatform
          .connect(user2)
          .createTransaction(
            ethers.ZeroAddress,
            ethers.parseEther('1000'),
            'Test transaction'
          )
      ).to.be.revertedWith('Invalid recipient address');
    });
  });

  describe('Approval Workflow', function () {
    beforeEach(async function () {
      // Create and request approval for a transaction
      await financialPlatform
        .connect(user2)
        .createTransaction(
          await user3.getAddress(),
          ethers.parseEther('1000'),
          'Test transaction'
        );
      await financialPlatform
        .connect(user2)
        .requestApproval(1, 'Need approval');
    });

    it('Should request approval correctly', async function () {
      const approval = await financialPlatform.getApproval(1);
      expect(approval.transactionId).to.equal(1);
      expect(approval.requester).to.equal(await user2.getAddress());
      expect(approval.status).to.equal(0); // Pending
      expect(approval.reason).to.equal('Need approval');
    });

    it('Should only allow transaction owner to request approval', async function () {
      await expect(
        financialPlatform
          .connect(user3)
          .requestApproval(1, 'Not my transaction')
      ).to.be.revertedWith('Not transaction owner');
    });

    it('Should process approval correctly', async function () {
      await financialPlatform
        .connect(approver1)
        .processApproval(1, true, 'Approved');

      const approval = await financialPlatform.getApproval(1);
      expect(approval.status).to.equal(1); // Approved
      expect(approval.approver).to.equal(await approver1.getAddress());

      const transaction = await financialPlatform.getTransaction(1);
      expect(transaction.status).to.equal(1); // Active
    });

    it('Should reject approval correctly', async function () {
      await financialPlatform
        .connect(approver1)
        .processApproval(1, false, 'Rejected');

      const approval = await financialPlatform.getApproval(1);
      expect(approval.status).to.equal(2); // Rejected

      const transaction = await financialPlatform.getTransaction(1);
      expect(transaction.status).to.equal(3); // Rejected
    });

    it('Should only allow approvers to process approvals', async function () {
      await expect(
        financialPlatform
          .connect(user3)
          .processApproval(1, true, 'Not authorized')
      ).to.be.revertedWith('Not authorized');
    });

    it('Should not allow processing already processed approvals', async function () {
      await financialPlatform
        .connect(approver1)
        .processApproval(1, true, 'Approved');

      await expect(
        financialPlatform
          .connect(approver1)
          .processApproval(1, false, 'Already processed')
      ).to.be.revertedWith('Approval already processed');
    });
  });

  describe('Transaction Completion', function () {
    beforeEach(async function () {
      // Create, request approval, and approve a transaction
      await financialPlatform
        .connect(user2)
        .createTransaction(
          await user3.getAddress(),
          ethers.parseEther('1000'),
          'Test transaction'
        );
      await financialPlatform
        .connect(user2)
        .requestApproval(1, 'Need approval');
      await financialPlatform
        .connect(approver1)
        .processApproval(1, true, 'Approved');
    });

    it('Should complete approved transactions', async function () {
      await financialPlatform.connect(user2).completeTransaction(1);

      const transaction = await financialPlatform.getTransaction(1);
      expect(transaction.status).to.equal(2); // Completed
    });

    it('Should only allow transaction owner to complete', async function () {
      await expect(
        financialPlatform.connect(user3).completeTransaction(1)
      ).to.be.revertedWith('Not transaction owner');
    });

    it('Should not allow completing non-active transactions', async function () {
      // Create another transaction without approval
      await financialPlatform
        .connect(user2)
        .createTransaction(
          await user3.getAddress(),
          ethers.parseEther('500'),
          'Another transaction'
        );

      await expect(
        financialPlatform.connect(user2).completeTransaction(2)
      ).to.be.revertedWith('Transaction not active');
    });
  });

  describe('Data Retrieval', function () {
    beforeEach(async function () {
      // Create multiple transactions
      await financialPlatform
        .connect(user2)
        .createTransaction(
          await user3.getAddress(),
          ethers.parseEther('1000'),
          'Transaction 1'
        );
      await financialPlatform
        .connect(user3)
        .createTransaction(
          await user2.getAddress(),
          ethers.parseEther('500'),
          'Transaction 2'
        );
      await financialPlatform
        .connect(user2)
        .createTransaction(
          await user1.getAddress(),
          ethers.parseEther('2000'),
          'Transaction 3'
        );
    });

    it('Should get user transactions correctly', async function () {
      const userTransactions = await financialPlatform.getUserTransactions(
        await user2.getAddress()
      );
      expect(userTransactions.length).to.equal(3); // 2 as sender, 1 as recipient
    });

    it('Should get correct transaction count', async function () {
      expect(await financialPlatform.getTransactionCount()).to.equal(3);
    });

    it('Should get correct user count', async function () {
      expect(await financialPlatform.getUserCount()).to.equal(5); // owner + 4 registered users
    });
  });

  describe('Pending Approvals', function () {
    beforeEach(async function () {
      // Create transactions and request approvals
      await financialPlatform
        .connect(user2)
        .createTransaction(
          await user3.getAddress(),
          ethers.parseEther('1000'),
          'Transaction 1'
        );
      await financialPlatform.connect(user2).requestApproval(1, 'Approval 1');

      await financialPlatform
        .connect(user3)
        .createTransaction(
          await user2.getAddress(),
          ethers.parseEther('500'),
          'Transaction 2'
        );
      await financialPlatform.connect(user3).requestApproval(2, 'Approval 2');

      // Process one approval
      await financialPlatform
        .connect(approver1)
        .processApproval(1, true, 'Approved');
    });

    it('Should get pending approvals correctly', async function () {
      const pendingApprovals = await financialPlatform.getPendingApprovals();
      expect(pendingApprovals.length).to.equal(1); // Only approval 2 should be pending
    });
  });

  describe('Events', function () {
    it('Should emit TransactionCreated event', async function () {
      await expect(
        financialPlatform
          .connect(user2)
          .createTransaction(
            await user3.getAddress(),
            ethers.parseEther('1000'),
            'Test transaction'
          )
      )
        .to.emit(financialPlatform, 'TransactionCreated')
        .withArgs(
          1,
          await user2.getAddress(),
          await user3.getAddress(),
          ethers.parseEther('1000')
        );
    });

    it('Should emit ApprovalRequested event', async function () {
      await financialPlatform
        .connect(user2)
        .createTransaction(
          await user3.getAddress(),
          ethers.parseEther('1000'),
          'Test transaction'
        );

      await expect(
        financialPlatform.connect(user2).requestApproval(1, 'Need approval')
      )
        .to.emit(financialPlatform, 'ApprovalRequested')
        .withArgs(1, 1, await user2.getAddress());
    });

    it('Should emit ApprovalProcessed event', async function () {
      await financialPlatform
        .connect(user2)
        .createTransaction(
          await user3.getAddress(),
          ethers.parseEther('1000'),
          'Test transaction'
        );
      await financialPlatform
        .connect(user2)
        .requestApproval(1, 'Need approval');

      await expect(
        financialPlatform
          .connect(approver1)
          .processApproval(1, true, 'Approved')
      )
        .to.emit(financialPlatform, 'ApprovalProcessed')
        .withArgs(1, 1, await approver1.getAddress());
    });
  });
});
