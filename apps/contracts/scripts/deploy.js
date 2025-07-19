const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  // Get the contract factories
  const FinancialPlatform = await ethers.getContractFactory("FinancialPlatform");
  const MockToken = await ethers.getContractFactory("MockToken");

  // Deploy FinancialPlatform
  console.log("Deploying FinancialPlatform...");
  const financialPlatform = await FinancialPlatform.deploy();
  await financialPlatform.waitForDeployment();
  const platformAddress = await financialPlatform.getAddress();
  console.log("FinancialPlatform deployed to:", platformAddress);

  // Deploy MockToken
  console.log("Deploying MockToken...");
  const mockToken = await MockToken.deploy("Platform Token", "PLT", 1000000); // 1M tokens
  await mockToken.waitForDeployment();
  const tokenAddress = await mockToken.getAddress();
  console.log("MockToken deployed to:", tokenAddress);

  // Get signers for testing
  const [deployer, user1, user2, user3, approver1] = await ethers.getSigners();

  console.log("\nSetting up initial data...");

  // Register test users
  console.log("Registering test users...");

  // Register user1 as Manager
  await financialPlatform.registerUser(
    await user1.getAddress(),
    "John Manager",
    "john.manager@company.com",
    1 // Manager role
  );
  console.log("Registered user1 as Manager");

  // Register user2 as Regular user
  await financialPlatform.registerUser(
    await user2.getAddress(),
    "Alice User",
    "alice.user@company.com",
    0 // Regular role
  );
  console.log("Registered user2 as Regular user");

  // Register user3 as Regular user
  await financialPlatform.registerUser(
    await user3.getAddress(),
    "Bob User",
    "bob.user@company.com",
    0 // Regular role
  );
  console.log("Registered user3 as Regular user");

  // Register approver1 as Manager
  await financialPlatform.registerUser(
    await approver1.getAddress(),
    "Sarah Approver",
    "sarah.approver@company.com",
    1 // Manager role
  );
  console.log("Registered approver1 as Manager");

  // Mint tokens to users for testing
  console.log("Minting tokens to users...");
  const tokenAmount = ethers.parseEther("10000"); // 10,000 tokens each

  await mockToken.mint(await user1.getAddress(), tokenAmount);
  await mockToken.mint(await user2.getAddress(), tokenAmount);
  await mockToken.mint(await user3.getAddress(), tokenAmount);
  await mockToken.mint(await approver1.getAddress(), tokenAmount);

  console.log("Minted 10,000 tokens to each user");

  // Create some sample transactions
  console.log("Creating sample transactions...");

  // Connect as user2 and create transactions
  const user2Platform = financialPlatform.connect(user2);

  // Transaction 1
  await user2Platform.createTransaction(
    await user3.getAddress(),
    ethers.parseEther("1000"),
    "Payment for services"
  );
  console.log("Created transaction 1");

  // Transaction 2
  await user2Platform.createTransaction(
    await user1.getAddress(),
    ethers.parseEther("2500"),
    "Consultation fee"
  );
  console.log("Created transaction 2");

  // Connect as user3 and create transactions
  const user3Platform = financialPlatform.connect(user3);

  // Transaction 3
  await user3Platform.createTransaction(
    await user2.getAddress(),
    ethers.parseEther("500"),
    "Reimbursement"
  );
  console.log("Created transaction 3");

  // Request approvals for transactions
  console.log("Requesting approvals...");

  // Request approval for transaction 1
  await user2Platform.requestApproval(1, "Standard approval request");
  console.log("Requested approval for transaction 1");

  // Request approval for transaction 2
  await user2Platform.requestApproval(2, "High value transaction");
  console.log("Requested approval for transaction 2");

  // Request approval for transaction 3
  await user3Platform.requestApproval(3, "Regular reimbursement");
  console.log("Requested approval for transaction 3");

  // Process some approvals
  console.log("Processing approvals...");
  const approver1Platform = financialPlatform.connect(approver1);

  // Approve transaction 1
  await approver1Platform.processApproval(1, true, "Approved - standard transaction");
  console.log("Approved transaction 1");

  // Reject transaction 2
  await approver1Platform.processApproval(2, false, "Rejected - insufficient documentation");
  console.log("Rejected transaction 2");

  // Complete approved transaction
  await user2Platform.completeTransaction(1);
  console.log("Completed transaction 1");

  console.log("\nDeployment and setup completed successfully!");
  console.log("\nContract Addresses:");
  console.log("FinancialPlatform:", platformAddress);
  console.log("MockToken:", tokenAddress);
  console.log("\nTest Accounts:");
  console.log("Deployer (Admin):", await deployer.getAddress());
  console.log("User1 (Manager):", await user1.getAddress());
  console.log("User2 (Regular):", await user2.getAddress());
  console.log("User3 (Regular):", await user3.getAddress());
  console.log("Approver1 (Manager):", await approver1.getAddress());

  // Save deployment info for frontend
  const deploymentInfo = {
    network: "localhost",
    contracts: {
      FinancialPlatform: platformAddress,
      MockToken: tokenAddress
    },
    abis: {
      FinancialPlatform: JSON.parse(financialPlatform.interface.formatJson()),
      MockToken: JSON.parse(mockToken.interface.formatJson())
    },
    testAccounts: {
      deployer: await deployer.getAddress(),
      user1: await user1.getAddress(),
      user2: await user2.getAddress(),
      user3: await user3.getAddress(),
      approver1: await approver1.getAddress()
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
    console.error(error);
    process.exit(1);
  }); 