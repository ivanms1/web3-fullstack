require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");

dotenv.config();

const config = {
  solidity: {
    version: "0.8.22",
    settings: {
      viaIR: true, // Enable viaIR to handle stack too deep errors
      optimizer: {
        enabled: true,
        runs: 1, // Optimize for size instead of runtime gas efficiency
      },
    },
  },
  networks: {
    holesky: {
      url: process.env.HOLESKY_RPC_URL || "https://ethereum-holesky.publicnode.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 17000,
      timeout: 120000, // 2 minutes timeout
      gasPrice: "auto",
      gas: "auto",
    },
  },
  etherscan: {
    apiKey: {
      holesky: process.env.ETHERSCAN_API_KEY || "",
    },
  },
};

module.exports = config;