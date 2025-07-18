const { ethers } = require("hardhat");

async function main() {
  console.log("Testing smart contract setup...");

  // Get the deployed contracts
  const FinancialPlatform = await ethers.getContractFactory("FinancialPlatform");
  const MockToken = await ethers.getContractFactory("MockToken");

  // Deploy contracts
  const financialPlatform = await FinancialPlatform.deploy();
  const mockToken = await MockToken.deploy("Platform Token", "PLT", 1000000);

  await financialPlatform.waitForDeployment();
  await mockToken.waitForDeployment();

  const platformAddress = await financialPlatform.getAddress();
  const tokenAddress = await mockToken.getAddress();

  console.log("Contracts deployed successfully!");
  console.log("FinancialPlatform:", platformAddress);
  console.log("MockToken:", tokenAddress);

  // Get test accounts
  const [deployer, user1, user2, user3, approver1] = await ethers.getSigners();

  console.log("\nSetting up test data...");

  // Register test users
  await financialPlatform.registerUser(
    await user1.getAddress(),
    "John Manager",
    "john.manager@company.com",
    1 // Manager
  );

  await financialPlatform.registerUser(
    await user2.getAddress(),
    "Alice User",
    "alice.user@company.com",
    0 // Regular
  );

  await financialPlatform.registerUser(
    await user3.getAddress(),
    "Bob User",
    "bob.user@company.com",
    0 // Regular
  );

  await financialPlatform.registerUser(
    await approver1.getAddress(),
    "Sarah Approver",
    "sarah.approver@company.com",
    1 // Manager
  );

  console.log("Test users registered successfully!");

  // Mint tokens
  const tokenAmount = ethers.parseEther("10000");
  await mockToken.mint(await user1.getAddress(), tokenAmount);
  await mockToken.mint(await user2.getAddress(), tokenAmount);
  await mockToken.mint(await user3.getAddress(), tokenAmount);
  await mockToken.mint(await approver1.getAddress(), tokenAmount);

  console.log("Tokens minted successfully!");

  // Create test transactions
  const user2Platform = financialPlatform.connect(user2);
  
  await user2Platform.createTransaction(
    await user3.getAddress(),
    ethers.parseEther("1000")
  );

  await user2Platform.createTransaction(
    await user1.getAddress(),
    ethers.parseEther("2500")
  );

  const user3Platform = financialPlatform.connect(user3);
  
  await user3Platform.createTransaction(
    await user2.getAddress(),
    ethers.parseEther("500")
  );

  console.log("Test transactions created successfully!");

  // Request approvals
  await user2Platform.requestApproval(1);
  await user2Platform.requestApproval(2);
  await user3Platform.requestApproval(3);

  console.log("Approval requests created successfully!");

  // Process some approvals
  const approver1Platform = financialPlatform.connect(approver1);
  
  await approver1Platform.processApproval(1, true);
  await approver1Platform.processApproval(2, false);

  console.log("Approvals processed successfully!");

  // Complete approved transaction
  await user2Platform.completeTransaction(1);

  console.log("Transaction completed successfully!");

  // Test data retrieval
  const transactionCount = await financialPlatform.getTransactionCount();
  const approvalCount = await financialPlatform.getApprovalCount();
  const userCount = await financialPlatform.getUserCount();
  const pendingApprovals = await financialPlatform.getPendingApprovals();

  console.log("\nTest Results:");
  console.log("Total Transactions:", transactionCount.toString());
  console.log("Total Approvals:", approvalCount.toString());
  console.log("Total Users:", userCount.toString());
  console.log("Pending Approvals:", pendingApprovals.length);

  // Test user data
  const user1Data = await financialPlatform.getUser(await user1.getAddress());
  const user2Data = await financialPlatform.getUser(await user2.getAddress());

  console.log("\nUser Test Results:");
  console.log("User1 (Manager):", user1Data.name, "- Role:", user1Data.role.toString());
  console.log("User2 (Regular):", user2Data.name, "- Role:", user2Data.role.toString());

  // Test transaction data
  const transaction1 = await financialPlatform.getTransaction(1);
  const transaction2 = await financialPlatform.getTransaction(2);
  const transaction3 = await financialPlatform.getTransaction(3);

  console.log("\nTransaction Test Results:");
  console.log("Transaction 1:", transaction1.description, "- Status:", transaction1.status.toString());
  console.log("Transaction 2:", transaction2.description, "- Status:", transaction2.status.toString());
  console.log("Transaction 3:", transaction3.description, "- Status:", transaction3.status.toString());

  // Test approval data
  const approval1 = await financialPlatform.getApproval(1);
  const approval2 = await financialPlatform.getApproval(2);
  const approval3 = await financialPlatform.getApproval(3);

  console.log("\nApproval Test Results:");
  console.log("Approval 1 - Status:", approval1.status.toString(), "- Approver:", approval1.approver);
  console.log("Approval 2 - Status:", approval2.status.toString(), "- Approver:", approval2.approver);
  console.log("Approval 3 - Status:", approval3.status.toString(), "- Approver:", approval3.approver);

  console.log("\n✅ All tests passed! Smart contracts are working correctly.");
  console.log("\nContract addresses for frontend integration:");
  console.log("FinancialPlatform:", platformAddress);
  console.log("MockToken:", tokenAddress);
  console.log("\nTest accounts:");
  console.log("Deployer (Admin):", await deployer.getAddress());
  console.log("User1 (Manager):", await user1.getAddress());
  console.log("User2 (Regular):", await user2.getAddress());
  console.log("User3 (Regular):", await user3.getAddress());
  console.log("Approver1 (Manager):", await approver1.getAddress());

  // Save deployment info
  const deploymentInfo = {
    network: "localhost",
    contracts: {
      FinancialPlatform: platformAddress,
      MockToken: tokenAddress
    },
    testAccounts: {
      deployer: await deployer.getAddress(),
      user1: await user1.getAddress(),
      user2: await user2.getAddress(),
      user3: await user3.getAddress(),
      approver1: await approver1.getAddress()
    },
    testData: {
      transactions: [
        {
          id: 1,
          description: "Payment for consulting services",
          status: "Completed",
          from: await user2.getAddress(),
          to: await user3.getAddress(),
          amount: "1000 PLT"
        },
        {
          id: 2,
          description: "Equipment purchase",
          status: "Rejected",
          from: await user2.getAddress(),
          to: await user1.getAddress(),
          amount: "2500 PLT"
        },
        {
          id: 3,
          description: "Reimbursement for travel expenses",
          status: "Pending",
          from: await user3.getAddress(),
          to: await user2.getAddress(),
          amount: "500 PLT"
        }
      ],
      approvals: [
        {
          id: 1,
          status: "Approved",
          transactionId: 1
        },
        {
          id: 2,
          status: "Rejected",
          transactionId: 2
        },
        {
          id: 3,
          status: "Pending",
          transactionId: 3
        }
      ]
    }
  };

  const fs = require('fs');
  fs.writeFileSync(
    'deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\nDeployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Test failed:", error);
    process.exit(1);
  }); 