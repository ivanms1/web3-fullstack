require('@nomicfoundation/hardhat-toolbox');
const dotenv = require('dotenv');

dotenv.config();

const config = {
  solidity: {
    version: '0.8.22',
    settings: {
      viaIR: true, // Enable viaIR to handle stack too deep errors
      optimizer: {
        enabled: true,
        runs: 1, // Optimize for size instead of runtime gas efficiency
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
      gas: 12000000,
      blockGasLimit: 12000000,
      allowUnlimitedContractSize: true,
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337,
      gas: 12000000,
      blockGasLimit: 12000000,
      allowUnlimitedContractSize: true,
    },
    holesky: {
      url:
        process.env.HOLESKY_RPC_URL ||
        'https://ethereum-holesky.publicnode.com',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 17000,
      timeout: 120000, // 2 minutes timeout
      gasPrice: 'auto',
      gas: 'auto',
    },
    sepolia: {
      url:
        process.env.SEPOLIA_RPC_URL ||
        'https://ethereum-sepolia.publicnode.com',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      timeout: 120000, // 2 minutes timeout
      gasPrice: 'auto',
      gas: 'auto',
    },
  },
  etherscan: {
    apiKey: {
      holesky: process.env.ETHERSCAN_API_KEY || '',
    },
  },
};

module.exports = config;
